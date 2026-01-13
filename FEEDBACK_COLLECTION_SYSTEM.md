# 用戶反饋收集系統
# User Feedback Collection System

## 📋 反饋收集策略

### 1. 應用內反饋表單

#### 位置：設定頁面
```typescript
// app/(tabs)/settings.tsx
<TouchableOpacity
  style={styles.feedbackButton}
  onPress={() => {
    // 打開反饋表單
    navigation.navigate('FeedbackForm');
  }}
>
  <MessageCircle size={20} color="#FF6B9D" />
  <Text>意見反饋</Text>
</TouchableOpacity>
```

#### 反饋表單結構
```typescript
interface FeedbackForm {
  userId: string;
  feedbackType: 'bug' | 'feature' | 'improvement' | 'other';
  category: 'memory' | 'camera' | 'edit' | 'gallery' | 'settings' | 'general';
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  attachments?: string[]; // 截圖路徑
  deviceInfo: {
    platform: 'iOS' | 'Android';
    osVersion: string;
    appVersion: string;
    deviceModel: string;
  };
  timestamp: string;
  email?: string;
}
```

---

### 2. 反饋收集組件

#### FeedbackForm.tsx
```typescript
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Picker,
} from 'react-native';
import { Star, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface FeedbackFormProps {
  onSubmit?: (feedback: FeedbackForm) => Promise<void>;
  onCancel?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'improvement' | 'other'>('improvement');
  const [category, setCategory] = useState<'memory' | 'camera' | 'edit' | 'gallery' | 'settings' | 'general'>('general');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('提示', '請填寫標題和描述');
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const feedback: FeedbackForm = {
        userId: 'user123', // 從認證系統獲取
        feedbackType,
        category,
        rating,
        title,
        description,
        email,
        deviceInfo: {
          platform: 'iOS', // 動態獲取
          osVersion: '17.0',
          appVersion: '2.2.0',
          deviceModel: 'iPhone 13 Pro',
        },
        timestamp: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(feedback);
      }

      Alert.alert('✓ 感謝反饋', '您的意見已提交，我們會盡快處理');
      onCancel?.();
    } catch (error) {
      Alert.alert('❌ 提交失敗', '請稍後重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => {
            setRating(star as 1 | 2 | 3 | 4 | 5);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Star
            size={32}
            color={star <= rating ? '#FFD700' : '#333333'}
            fill={star <= rating ? '#FFD700' : 'none'}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 頭部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>意見反饋</Text>
        <Text style={styles.headerSubtitle}>幫助我們改進 yanbao AI</Text>
      </View>

      {/* 評分 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>您的評分</Text>
        {renderStarRating()}
      </View>

      {/* 反饋類型 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>反饋類型</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={feedbackType}
            onValueChange={setFeedbackType}
            style={styles.picker}
          >
            <Picker.Item label="改進建議" value="improvement" />
            <Picker.Item label="功能請求" value="feature" />
            <Picker.Item label="Bug 報告" value="bug" />
            <Picker.Item label="其他" value="other" />
          </Picker>
        </View>
      </View>

      {/* 反饋分類 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分類</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="記憶系統" value="memory" />
            <Picker.Item label="拍照功能" value="camera" />
            <Picker.Item label="編輯功能" value="edit" />
            <Picker.Item label="相冊功能" value="gallery" />
            <Picker.Item label="設定" value="settings" />
            <Picker.Item label="其他" value="general" />
          </Picker>
        </View>
      </View>

      {/* 標題 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>標題</Text>
        <TextInput
          style={styles.input}
          placeholder="請輸入反饋標題"
          placeholderTextColor="#666666"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <Text style={styles.charCount}>{title.length}/100</Text>
      </View>

      {/* 描述 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>詳細描述</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="請詳細描述您的反饋..."
          placeholderTextColor="#666666"
          value={description}
          onChangeText={setDescription}
          maxLength={1000}
          multiline
          numberOfLines={6}
        />
        <Text style={styles.charCount}>{description.length}/1000</Text>
      </View>

      {/* 聯繫方式 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>聯繫方式 (可選)</Text>
        <TextInput
          style={styles.input}
          placeholder="請輸入您的郵箱地址"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* 提交按鈕 */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Send size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '提交中...' : '提交反饋'}
        </Text>
      </TouchableOpacity>

      {/* 取消按鈕 */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>取消</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B9D',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  submitButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  bottomSpacer: {
    height: 16,
  },
});
```

---

### 3. 反饋數據存儲

#### 本地存儲
```typescript
// lib/services/feedbackService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFeedbackLocally = async (feedback: FeedbackForm) => {
  try {
    const existingFeedback = await AsyncStorage.getItem('feedbacks');
    const feedbacks = existingFeedback ? JSON.parse(existingFeedback) : [];
    feedbacks.push(feedback);
    await AsyncStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
};

export const getFeedbackList = async (): Promise<FeedbackForm[]> => {
  try {
    const feedbacks = await AsyncStorage.getItem('feedbacks');
    return feedbacks ? JSON.parse(feedbacks) : [];
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return [];
  }
};
```

#### 雲端上傳
```typescript
// 上傳到 Supabase
export const uploadFeedbackToCloud = async (feedback: FeedbackForm) => {
  try {
    const response = await fetch('https://your-supabase-url/feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_SUPABASE_KEY}`,
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading feedback:', error);
    throw error;
  }
};
```

---

### 4. 反饋分析儀表板

#### 反饋統計
```typescript
interface FeedbackStatistics {
  totalFeedbacks: number;
  averageRating: number;
  feedbacksByType: {
    bug: number;
    feature: number;
    improvement: number;
    other: number;
  };
  feedbacksByCategory: {
    memory: number;
    camera: number;
    edit: number;
    gallery: number;
    settings: number;
    general: number;
  };
  topIssues: FeedbackForm[];
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export const analyzeFeedback = (feedbacks: FeedbackForm[]): FeedbackStatistics => {
  return {
    totalFeedbacks: feedbacks.length,
    averageRating: feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length,
    feedbacksByType: {
      bug: feedbacks.filter(f => f.feedbackType === 'bug').length,
      feature: feedbacks.filter(f => f.feedbackType === 'feature').length,
      improvement: feedbacks.filter(f => f.feedbackType === 'improvement').length,
      other: feedbacks.filter(f => f.feedbackType === 'other').length,
    },
    feedbacksByCategory: {
      memory: feedbacks.filter(f => f.category === 'memory').length,
      camera: feedbacks.filter(f => f.category === 'camera').length,
      edit: feedbacks.filter(f => f.category === 'edit').length,
      gallery: feedbacks.filter(f => f.category === 'gallery').length,
      settings: feedbacks.filter(f => f.category === 'settings').length,
      general: feedbacks.filter(f => f.category === 'general').length,
    },
    topIssues: feedbacks.sort((a, b) => b.rating - a.rating).slice(0, 5),
    sentimentAnalysis: {
      positive: feedbacks.filter(f => f.rating >= 4).length,
      neutral: feedbacks.filter(f => f.rating === 3).length,
      negative: feedbacks.filter(f => f.rating <= 2).length,
    },
  };
};
```

---

### 5. 反饋處理流程

#### 優先級分類
| 優先級 | 條件 | 處理時間 |
|-------|------|--------|
| 🔴 P0 | Bug 導致應用崩潰 | 24 小時內 |
| 🟠 P1 | Bug 影響核心功能 | 48 小時內 |
| 🟡 P2 | Bug 影響次要功能 | 1 週內 |
| 🟢 P3 | 改進建議或功能請求 | 2 週內 |
| ⚪ P4 | 其他反饋 | 1 個月內 |

#### 反饋回應模板
```
感謝您的反饋！

您的反饋已被記錄：
- 反饋 ID：[ID]
- 類型：[類型]
- 優先級：[優先級]

我們會盡快處理您的反饋。如有進展，我們會通過郵件通知您。

感謝您對 yanbao AI 的支持！
```

---

### 6. 反饋收集指標

#### 關鍵指標
- **反饋收集率**：目標 > 10% 的活躍用戶
- **平均評分**：目標 > 4.0 / 5.0
- **反饋回應率**：目標 100%
- **反饋解決率**：目標 > 80%
- **用戶滿意度**：目標 > 85%

#### 監控儀表板
```
反饋統計
├── 本週反饋：45 條
├── 平均評分：4.3 / 5.0
├── 回應率：98%
├── 解決率：85%
└── 用戶滿意度：87%

反饋分佈
├── Bug：15 條 (33%)
├── 功能請求：12 條 (27%)
├── 改進建議：18 條 (40%)
└── 其他：0 條 (0%)

分類分佈
├── 記憶系統：18 條 (40%)
├── 拍照功能：12 條 (27%)
├── 編輯功能：8 條 (18%)
├── 相冊功能：4 條 (9%)
├── 設定：2 條 (4%)
└── 其他：1 條 (2%)
```

---

## ✅ 反饋收集完成檢查清單

- [ ] 反饋表單已集成到設定頁面
- [ ] 反饋數據結構已定義
- [ ] 本地存儲已實現
- [ ] 雲端上傳已配置
- [ ] 反饋分析已實現
- [ ] 優先級分類已定義
- [ ] 回應模板已準備
- [ ] 監控儀表板已設置

---

**反饋收集系統已準備就緒！** 🚀
