/**
 * AR 姿势纠正系统单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ARPoseCorrectionSystem } from '@/lib/innovation/ar-pose-correction-system';

describe('ARPoseCorrectionSystem', () => {
  let system: ARPoseCorrectionSystem;

  beforeEach(async () => {
    system = ARPoseCorrectionSystem.getInstance();
    await system.initialize();
  });

  describe('getAllTemplates', () => {
    it('should load 50+ pose templates', () => {
      const templates = system.getAllTemplates();
      
      expect(templates.length).toBeGreaterThanOrEqual(50);
    });

    it('should have templates from all categories', () => {
      const templates = system.getAllTemplates();
      const categories = new Set(templates.map(t => t.category));
      
      expect(categories.size).toBeGreaterThanOrEqual(5);
      expect(categories).toContain('自拍');
      expect(categories).toContain('全身');
      expect(categories).toContain('坐姿');
      expect(categories).toContain('运动');
      expect(categories).toContain('创意');
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should get templates by category', () => {
      const selfieTemplates = system.getTemplatesByCategory('自拍');
      
      expect(selfieTemplates.length).toBeGreaterThan(0);
      expect(selfieTemplates.every(t => t.category === '自拍')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const templates = system.getTemplatesByCategory('非存在分类');
      
      expect(templates.length).toBe(0);
    });
  });

  describe('getTemplatesByDifficulty', () => {
    it('should get templates by difficulty', () => {
      const easyTemplates = system.getTemplatesByDifficulty('easy');
      
      expect(easyTemplates.length).toBeGreaterThan(0);
      expect(easyTemplates.every(t => t.difficulty === 'easy')).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should get all categories', () => {
      const categories = system.getCategories();
      
      expect(categories.length).toBeGreaterThanOrEqual(5);
      expect(categories).toContain('自拍');
      expect(categories).toContain('全身');
    });

    it('should return sorted categories', () => {
      const categories = system.getCategories();
      const sorted = [...categories].sort();
      
      expect(categories).toEqual(sorted);
    });
  });

  describe('calculateSimilarity', () => {
    it('should calculate pose similarity', () => {
      const currentPose = Array.from({ length: 17 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        confidence: 0.9
      }));
      
      const templates = system.getAllTemplates();
      const similarity = system.calculateSimilarity(currentPose, templates[0].id);
      
      expect(similarity).toBeDefined();
      expect(similarity.overallScore).toBeGreaterThanOrEqual(0);
      expect(similarity.overallScore).toBeLessThanOrEqual(100);
      expect(similarity.keyPointScores.size).toBeGreaterThan(0);
      expect(similarity.feedback.length).toBeGreaterThan(0);
      expect(similarity.voicePrompt).toBeDefined();
    });

    it('should throw error for non-existent template', () => {
      const currentPose = [{ x: 100, y: 100, confidence: 0.9 }];
      
      expect(() => {
        system.calculateSimilarity(currentPose, 'non-existent-id');
      }).toThrow('Template not found');
    });

    it('should calculate high similarity for matching pose', () => {
      const templates = system.getAllTemplates();
      const template = templates[0];
      
      // 使用模板的关键点作为当前姿势
      const currentPose = template.keypoints.map(kp => ({
        x: kp.x,
        y: kp.y,
        confidence: 0.95
      }));
      
      const similarity = system.calculateSimilarity(currentPose, template.id);
      
      // 相同的姿势应该有高相似度
      expect(similarity.overallScore).toBeGreaterThan(70);
    });
  });

  describe('recordCustomPose', () => {
    it('should record custom pose', () => {
      const currentPose = Array.from({ length: 17 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        confidence: 0.9
      }));
      
      const pose = system.recordCustomPose(
        'My Pose',
        'Custom',
        currentPose,
        ['Tip 1', 'Tip 2'],
        'medium'
      );
      
      expect(pose).toBeDefined();
      expect(pose.name).toBe('My Pose');
      expect(pose.category).toBe('Custom');
      expect(pose.isBuiltIn).toBe(false);
      expect(pose.tips).toContain('Tip 1');
      expect(pose.difficulty).toBe('medium');
    });

    it('should be able to retrieve recorded pose', () => {
      const currentPose = [{ x: 100, y: 100, confidence: 0.9 }];
      
      const pose = system.recordCustomPose(
        'Test Pose',
        'Custom',
        currentPose
      );
      
      const retrieved = system.getTemplate(pose.id);
      expect(retrieved).toEqual(pose);
    });
  });

  describe('deleteCustomPose', () => {
    it('should delete custom pose', () => {
      const currentPose = [{ x: 100, y: 100, confidence: 0.9 }];
      
      const pose = system.recordCustomPose(
        'Delete Test',
        'Custom',
        currentPose
      );
      
      const deleted = system.deleteCustomPose(pose.id);
      expect(deleted).toBe(true);
      
      const retrieved = system.getTemplate(pose.id);
      expect(retrieved).toBeUndefined();
    });

    it('should return false when deleting non-existent pose', () => {
      const deleted = system.deleteCustomPose('non-existent-id');
      expect(deleted).toBe(false);
    });

    it('should not delete built-in poses', () => {
      const templates = system.getAllTemplates();
      const builtInPose = templates.find(t => t.isBuiltIn);
      
      if (builtInPose) {
        const deleted = system.deleteCustomPose(builtInPose.id);
        expect(deleted).toBe(false);
      }
    });
  });

  describe('getSimilarityHistory', () => {
    it('should track similarity history', () => {
      const currentPose = Array.from({ length: 17 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        confidence: 0.9
      }));
      
      const templates = system.getAllTemplates();
      
      system.calculateSimilarity(currentPose, templates[0].id);
      system.calculateSimilarity(currentPose, templates[1].id);
      
      const history = system.getSimilarityHistory();
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getBestSimilarity', () => {
    it('should return best similarity', () => {
      const currentPose = Array.from({ length: 17 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        confidence: 0.9
      }));
      
      const templates = system.getAllTemplates();
      
      system.calculateSimilarity(currentPose, templates[0].id);
      system.calculateSimilarity(currentPose, templates[1].id);
      
      const best = system.getBestSimilarity();
      expect(best).toBeDefined();
      expect(best?.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should return undefined when no history', () => {
      system.clearSimilarityHistory();
      
      const best = system.getBestSimilarity();
      expect(best).toBeUndefined();
    });
  });

  describe('getAverageSimilarity', () => {
    it('should calculate average similarity', () => {
      const currentPose = Array.from({ length: 17 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        confidence: 0.9
      }));
      
      const templates = system.getAllTemplates();
      
      system.calculateSimilarity(currentPose, templates[0].id);
      system.calculateSimilarity(currentPose, templates[1].id);
      
      const average = system.getAverageSimilarity();
      expect(average).toBeGreaterThanOrEqual(0);
      expect(average).toBeLessThanOrEqual(100);
    });

    it('should return 0 when no history', () => {
      system.clearSimilarityHistory();
      
      const average = system.getAverageSimilarity();
      expect(average).toBe(0);
    });
  });

  describe('searchTemplates', () => {
    it('should search templates by name', () => {
      const results = system.searchTemplates('自拍');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(t => 
        t.name.includes('自拍') || 
        t.description.includes('自拍') || 
        t.category.includes('自拍')
      )).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = system.searchTemplates('xyz123xyz');
      
      expect(results.length).toBe(0);
    });
  });

  describe('getTemplate', () => {
    it('should get template by id', () => {
      const templates = system.getAllTemplates();
      const template = system.getTemplate(templates[0].id);
      
      expect(template).toEqual(templates[0]);
    });

    it('should return undefined for non-existent template', () => {
      const template = system.getTemplate('non-existent-id');
      
      expect(template).toBeUndefined();
    });
  });

  describe('getCategoryCount', () => {
    it('should return correct category count', () => {
      const categories = system.getCategories();
      
      categories.forEach(category => {
        const count = system.getCategoryCount(category);
        const templates = system.getTemplatesByCategory(category);
        
        expect(count).toBe(templates.length);
      });
    });
  });
});
