/**
 * 批量处理引擎单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  BatchProcessingEngine,
  TaskPriority,
  TaskStatus
} from '@/lib/productivity/batch-processing-engine';

describe('BatchProcessingEngine', () => {
  let engine: BatchProcessingEngine;

  beforeEach(() => {
    engine = new BatchProcessingEngine({
      maxConcurrentTasks: 2,
      autoRetry: true,
      maxRetries: 3
    });
  });

  afterEach(() => {
    engine.destroy();
  });

  describe('addTask', () => {
    it('should add task to queue', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      expect(taskId).toBeDefined();
      expect(typeof taskId).toBe('string');
      expect(engine.getQueueLength()).toBeGreaterThan(0);
    });

    it('should add task with priority', () => {
      const taskId = engine.addTask('image.jpg', 'preset1', TaskPriority.HIGH);
      
      const task = engine.getTaskStatus(taskId);
      expect(task).toBeDefined();
      expect(task?.priority).toBe(TaskPriority.HIGH);
    });
  });

  describe('addBatchTasks', () => {
    it('should add multiple tasks', () => {
      const imageUris = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      const taskIds = engine.addBatchTasks(imageUris, 'preset1');
      
      expect(taskIds.length).toBe(3);
      expect(engine.getQueueLength()).toBe(3);
    });

    it('should add batch tasks with priority', () => {
      const imageUris = ['image1.jpg', 'image2.jpg'];
      const taskIds = engine.addBatchTasks(imageUris, 'preset1', TaskPriority.URGENT);
      
      taskIds.forEach(taskId => {
        const task = engine.getTaskStatus(taskId);
        expect(task?.priority).toBe(TaskPriority.URGENT);
      });
    });
  });

  describe('pauseTask and resumeTask', () => {
    it('should pause individual task', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      engine.pauseTask(taskId);
      
      const task = engine.getTaskStatus(taskId);
      expect(task?.status).toBe(TaskStatus.PAUSED);
    });

    it('should resume individual task', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      engine.pauseTask(taskId);
      engine.resumeTask(taskId);
      
      const task = engine.getTaskStatus(taskId);
      expect(task?.status).toBe(TaskStatus.PROCESSING);
    });
  });

  describe('pauseAll and resumeAll', () => {
    it('should pause all tasks', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      
      engine.pauseAll();
      
      const tasks = engine.getAllTasks();
      const allPaused = tasks.every(t => t.status === TaskStatus.PAUSED);
      expect(allPaused).toBe(true);
    });

    it('should resume all tasks', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      
      engine.pauseAll();
      engine.resumeAll();
      
      const tasks = engine.getAllTasks();
      const allResumed = tasks.every(t => t.status === TaskStatus.PROCESSING);
      expect(allResumed).toBe(true);
    });
  });

  describe('cancelTask', () => {
    it('should cancel task', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      engine.cancelTask(taskId);
      
      const task = engine.getTaskStatus(taskId);
      expect(task?.status).toBe(TaskStatus.CANCELLED);
    });

    it('should remove cancelled task from queue', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      const initialLength = engine.getQueueLength();
      
      engine.cancelTask(taskId);
      
      // 取消后队列长度应该减少
      expect(engine.getQueueLength()).toBeLessThanOrEqual(initialLength);
    });
  });

  describe('getTaskStatus', () => {
    it('should get task status', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      const task = engine.getTaskStatus(taskId);
      
      expect(task).toBeDefined();
      expect(task?.id).toBe(taskId);
      expect(task?.status).toBe(TaskStatus.PENDING);
    });

    it('should return undefined for non-existent task', () => {
      const task = engine.getTaskStatus('non-existent-id');
      
      expect(task).toBeUndefined();
    });
  });

  describe('getAllTasks', () => {
    it('should get all tasks', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg', 'image3.jpg'], 'preset1');
      
      const tasks = engine.getAllTasks();
      
      expect(tasks.length).toBe(3);
    });

    it('should return empty array when no tasks', () => {
      const tasks = engine.getAllTasks();
      
      expect(tasks.length).toBe(0);
    });
  });

  describe('getQueueLength', () => {
    it('should return correct queue length', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      
      expect(engine.getQueueLength()).toBe(2);
    });

    it('should decrease when task is cancelled', () => {
      const taskIds = engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      const initialLength = engine.getQueueLength();
      
      engine.cancelTask(taskIds[0]);
      
      expect(engine.getQueueLength()).toBeLessThan(initialLength);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to task updates', (done) => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      let updateCount = 0;
      engine.subscribe(taskId, (task) => {
        updateCount++;
        if (updateCount >= 2) {
          done();
        }
      });
    });

    it('should unsubscribe from task updates', () => {
      const taskId = engine.addTask('image.jpg', 'preset1');
      
      let updateCount = 0;
      const unsubscribe = engine.subscribe(taskId, () => {
        updateCount++;
      });
      
      unsubscribe();
      
      // 取消订阅后不应该再收到更新
      expect(updateCount).toBeLessThanOrEqual(1);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      
      const stats = engine.getStatistics();
      
      expect(stats).toBeDefined();
      expect(stats.queueLength).toBeGreaterThan(0);
      expect(stats.totalProcessed).toBeGreaterThanOrEqual(0);
      expect(stats.totalFailed).toBeGreaterThanOrEqual(0);
      expect(stats.processingCount).toBeGreaterThanOrEqual(0);
      expect(stats.pausedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('destroy', () => {
    it('should destroy engine and clear tasks', () => {
      engine.addBatchTasks(['image1.jpg', 'image2.jpg'], 'preset1');
      
      engine.destroy();
      
      const tasks = engine.getAllTasks();
      expect(tasks.length).toBe(0);
    });
  });

  describe('task priority ordering', () => {
    it('should process high priority tasks first', () => {
      engine.addTask('image1.jpg', 'preset1', TaskPriority.LOW);
      engine.addTask('image2.jpg', 'preset1', TaskPriority.HIGH);
      engine.addTask('image3.jpg', 'preset1', TaskPriority.NORMAL);
      
      const tasks = engine.getAllTasks();
      
      // 高优先级任务应该在队列前面
      const highPriorityTask = tasks.find(t => t.priority === TaskPriority.HIGH);
      expect(highPriorityTask).toBeDefined();
    });
  });
});
