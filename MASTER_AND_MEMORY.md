# yanbao AI - 大师功能与记忆系统

## 🎓 大师功能 (Master Mode)

### 概述

大师功能是 yanbao AI 的核心 AI 能力，通过高度定制的 Prompt 角色扮演，为用户提供专业级的摄影、编辑和地点推荐建议。

---

## 📸 大师类型

### 1. 摄影大师 (Photography Master)

**职责**:
- 拍摄构图建议
- 光线分析与建议
- 相机参数推荐
- 拍摄时机指导

**示例对话**:
```
用户: "我想在外滩拍夜景，怎么拍比较好？"

摄影大师: "根据你的偏好（冷色调、简约风格），我建议：
1. 最佳时间：日落后30分钟（蓝调时刻）
2. 构图：使用三分法，将东方明珠放在右侧三分线
3. 参数：ISO 800, f/8, 快门 1/60s
4. 技巧：使用三脚架，开启长曝光模式"
```

### 2. 编辑大师 (Editing Master)

**职责**:
- 调色方案推荐
- 滤镜选择建议
- 参数调节指导
- 风格匹配分析

**示例对话**:
```
用户: "这张照片怎么调色？"

编辑大师: "分析你的照片和历史偏好：
1. 推荐滤镜：霓虹（Neon）
2. 参数调整：
   - 亮度 +10
   - 对比度 +20
   - 饱和度 -5
3. 理由：你喜欢赛博朋克风格，这个配方能突出城市夜景的霓虹感"
```

### 3. 地点大师 (Location Master)

**职责**:
- 拍摄地点推荐
- 最佳时间建议
- 路线规划
- 拍摄技巧提示

**示例对话**:
```
用户: "推荐上海适合拍照的地方"

地点大师: "基于你的位置和偏好：
1. 武康路（距离 2.3km）
   - 特色：法式梧桐、复古建筑
   - 最佳时间：下午 3-5 点
   - 拍摄建议：使用 50mm 镜头拍摄街景
2. 田子坊（距离 3.1km）
   - 特色：石库门、文艺小店
   - 最佳时间：上午 10-12 点
   - 拍摄建议：捕捉光影对比"
```

---

## 🧠 技术实现

### Python 后端实现

```python
# master_processor.py
import openai
from typing import Dict, List, Optional
import json

class MasterProcessor:
    """
    yanbao AI 大师功能核心处理器
    """
    
    def __init__(self, user_id: str, master_type: str):
        """
        初始化大师处理器
        
        Args:
            user_id: 用户 ID
            master_type: 大师类型 ('photography', 'editing', 'location')
        """
        self.user_id = user_id
        self.master_type = master_type
        self.memory = self._load_user_memory()
        self.client = openai.OpenAI()
        
    def _load_user_memory(self) -> Dict:
        """
        从记忆系统加载用户记忆
        
        Returns:
            用户记忆字典
        """
        # 从向量数据库检索用户记忆
        memory_service = MemoryService(self.user_id)
        return memory_service.get_relevant_memories(
            query=f"{self.master_type} preferences",
            top_k=5
        )
    
    def _build_system_prompt(self) -> str:
        """
        构建大师角色的系统提示词
        
        Returns:
            系统提示词字符串
        """
        role_prompts = {
            'photography': """
你是 yanbao AI 的摄影大师。你拥有 20 年专业摄影经验，擅长：
- 构图分析与建议
- 光线评估与运用
- 相机参数设置
- 拍摄时机把握

请结合用户的拍摄习惯和审美偏好，提供专业、个性化的建议。
""",
            'editing': """
你是 yanbao AI 的编辑大师。你精通照片后期处理，擅长：
- 调色方案设计
- 滤镜效果推荐
- 参数精细调节
- 风格匹配分析

请根据用户的历史编辑记录和审美偏好，提供精准的调色建议。
""",
            'location': """
你是 yanbao AI 的地点大师。你熟悉全国各地的拍摄地点，擅长：
- 拍摄地点推荐
- 最佳时间建议
- 路线规划
- 拍摄技巧提示

请结合用户的位置、偏好和历史足迹，推荐最合适的拍摄地点。
"""
        }
        
        base_prompt = role_prompts.get(self.master_type, "")
        
        # 注入用户记忆
        memory_context = self._format_memory_context()
        
        return f"""{base_prompt}

用户背景信息：
{memory_context}

请用简体中文回答，语气专业但亲切。
"""
    
    def _format_memory_context(self) -> str:
        """
        格式化用户记忆为上下文
        
        Returns:
            格式化的记忆字符串
        """
        if not self.memory:
            return "暂无用户历史记录"
        
        context_parts = []
        
        if 'preferences' in self.memory:
            prefs = self.memory['preferences']
            context_parts.append(f"审美偏好：{', '.join(prefs)}")
        
        if 'habits' in self.memory:
            habits = self.memory['habits']
            context_parts.append(f"拍摄习惯：{', '.join(habits)}")
        
        if 'favorite_locations' in self.memory:
            locs = self.memory['favorite_locations']
            context_parts.append(f"常去地点：{', '.join(locs)}")
        
        return "\n".join(context_parts)
    
    def generate_response(self, user_input: str, context: Optional[Dict] = None) -> Dict:
        """
        生成大师建议
        
        Args:
            user_input: 用户输入
            context: 额外上下文（如照片元数据、位置信息等）
        
        Returns:
            包含建议和元数据的字典
        """
        # 构建消息列表
        messages = [
            {"role": "system", "content": self._build_system_prompt()},
            {"role": "user", "content": user_input}
        ]
        
        # 如果有额外上下文，添加到用户消息
        if context:
            context_str = json.dumps(context, ensure_ascii=False)
            messages.append({
                "role": "user",
                "content": f"额外信息：{context_str}"
            })
        
        # 调用大模型
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        advice = response.choices[0].message.content
        
        # 异步更新记忆
        self._update_memory_async(user_input, advice)
        
        return {
            "advice": advice,
            "master_type": self.master_type,
            "confidence": 0.9,  # 可以通过模型输出计算
            "timestamp": int(time.time())
        }
    
    def _update_memory_async(self, user_input: str, advice: str):
        """
        异步更新用户记忆
        
        Args:
            user_input: 用户输入
            advice: 大师建议
        """
        # 提取关键信息并更新记忆
        memory_service = MemoryService(self.user_id)
        memory_service.update_from_interaction(
            user_input=user_input,
            ai_response=advice,
            interaction_type=self.master_type
        )


# 使用示例
if __name__ == "__main__":
    # 初始化摄影大师
    master = MasterProcessor(
        user_id="user_123",
        master_type="photography"
    )
    
    # 用户请求建议
    response = master.generate_response(
        user_input="我想在外滩拍夜景，怎么拍比较好？",
        context={
            "location": {"lat": 31.2397, "lng": 121.4912},
            "time": "18:30",
            "weather": "晴"
        }
    )
    
    print(response["advice"])
```

### TypeScript 前端实现

```typescript
// MasterService.ts
import axios from 'axios';

interface MasterRequest {
  userId: string;
  masterType: 'photography' | 'editing' | 'location';
  userInput: string;
  context?: Record<string, any>;
}

interface MasterResponse {
  advice: string;
  masterType: string;
  confidence: number;
  timestamp: number;
}

class MasterService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API_URL || 'https://api.yanbao.ai';
  }

  async getAdvice(request: MasterRequest): Promise<MasterResponse> {
    try {
      const response = await axios.post<MasterResponse>(
        `${this.apiUrl}/api/v1/master/advice`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Master service error:', error);
      throw error;
    }
  }

  private getToken(): string {
    // 从本地存储获取 JWT token
    return localStorage.getItem('auth_token') || '';
  }
}

export default new MasterService();
```

---

## 💾 雁宝记忆系统 (yanbao Memory)

### 概述

雁宝记忆系统让 AI 能够记住用户的偏好、习惯和历史，提供个性化的服务。

---

## 🧩 记忆类型

### 1. 短期记忆 (Short-term Memory)

**存储**: Redis  
**生命周期**: 24 小时  
**用途**: 会话上下文、临时偏好

```python
# 短期记忆示例
short_term_memory = {
    "session_id": "sess_abc123",
    "user_id": "user_123",
    "context": [
        {"role": "user", "content": "我想拍夜景"},
        {"role": "assistant", "content": "推荐外滩..."}
    ],
    "temp_preferences": {
        "current_location": {"lat": 31.2397, "lng": 121.4912},
        "current_mood": "探索"
    },
    "expires_at": 1705449600
}
```

### 2. 长期记忆 (Long-term Memory)

**存储**: 向量数据库 (Pinecone/Milvus)  
**生命周期**: 永久  
**用途**: 用户偏好、习惯、配方

```python
# 长期记忆示例
long_term_memory = {
    "memory_id": "mem_xyz789",
    "user_id": "user_123",
    "memory_type": "preference",
    "content": "用户偏好冷色调、简约风格的照片",
    "embedding": [0.123, 0.456, ...],  # 1536 维向量
    "metadata": {
        "confidence": 0.95,
        "source": "editing_history",
        "created_at": "2026-01-15T10:30:00Z",
        "updated_at": "2026-01-17T15:45:00Z"
    }
}
```

---

## 🔄 记忆工作流程

### 1. 记忆提取 (Memory Extraction)

```python
# memory_extractor.py
from typing import List, Dict
import re

class MemoryExtractor:
    """
    从用户交互中提取记忆
    """
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        提取实体（日期、地点、偏好等）
        
        Args:
            text: 用户输入文本
        
        Returns:
            实体字典
        """
        entities = {
            "locations": [],
            "times": [],
            "preferences": [],
            "actions": []
        }
        
        # 提取地点
        location_patterns = [
            r'在(.{2,10}?)拍',
            r'去(.{2,10}?)拍照',
            r'(.{2,10}?)的风景'
        ]
        for pattern in location_patterns:
            matches = re.findall(pattern, text)
            entities["locations"].extend(matches)
        
        # 提取时间
        time_patterns = [
            r'(早上|上午|中午|下午|傍晚|晚上|夜晚)',
            r'(\d{1,2}[点时])',
            r'(日出|日落|黄昏|蓝调时刻)'
        ]
        for pattern in time_patterns:
            matches = re.findall(pattern, text)
            entities["times"].extend(matches)
        
        # 提取偏好
        preference_keywords = [
            '喜欢', '偏好', '常用', '经常', '习惯',
            '冷色调', '暖色调', '简约', '复古', '文艺'
        ]
        for keyword in preference_keywords:
            if keyword in text:
                entities["preferences"].append(keyword)
        
        return entities
    
    def create_memory(self, entities: Dict, context: str) -> Dict:
        """
        创建记忆对象
        
        Args:
            entities: 提取的实体
            context: 原始上下文
        
        Returns:
            记忆对象
        """
        memory = {
            "content": context,
            "entities": entities,
            "memory_type": self._infer_memory_type(entities),
            "importance": self._calculate_importance(entities),
            "timestamp": int(time.time())
        }
        
        return memory
    
    def _infer_memory_type(self, entities: Dict) -> str:
        """
        推断记忆类型
        """
        if entities["preferences"]:
            return "preference"
        elif entities["locations"]:
            return "location"
        elif entities["times"]:
            return "habit"
        else:
            return "general"
    
    def _calculate_importance(self, entities: Dict) -> float:
        """
        计算记忆重要性（0-1）
        """
        score = 0.5  # 基础分
        
        # 包含偏好信息，重要性高
        if entities["preferences"]:
            score += 0.3
        
        # 包含多个实体，重要性高
        total_entities = sum(len(v) for v in entities.values())
        score += min(total_entities * 0.05, 0.2)
        
        return min(score, 1.0)
```

### 2. 记忆存储 (Memory Storage)

```python
# memory_storage.py
from pinecone import Pinecone, ServerlessSpec
import openai
from typing import List, Dict

class MemoryStorage:
    """
    记忆存储服务
    """
    
    def __init__(self, api_key: str, index_name: str = "yanbao-memory"):
        self.pc = Pinecone(api_key=api_key)
        self.index_name = index_name
        self.openai_client = openai.OpenAI()
        
        # 创建或连接索引
        if index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=index_name,
                dimension=1536,  # OpenAI embedding 维度
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
        
        self.index = self.pc.Index(index_name)
    
    def store_memory(self, user_id: str, memory: Dict) -> str:
        """
        存储记忆
        
        Args:
            user_id: 用户 ID
            memory: 记忆对象
        
        Returns:
            记忆 ID
        """
        # 生成 embedding
        embedding = self._generate_embedding(memory["content"])
        
        # 生成唯一 ID
        memory_id = f"{user_id}_{memory['timestamp']}"
        
        # 准备元数据
        metadata = {
            "user_id": user_id,
            "memory_type": memory["memory_type"],
            "importance": memory["importance"],
            "content": memory["content"],
            "timestamp": memory["timestamp"]
        }
        
        # 存储到向量数据库
        self.index.upsert(
            vectors=[(memory_id, embedding, metadata)]
        )
        
        return memory_id
    
    def retrieve_memories(
        self,
        user_id: str,
        query: str,
        top_k: int = 5,
        filter_type: str = None
    ) -> List[Dict]:
        """
        检索记忆
        
        Args:
            user_id: 用户 ID
            query: 查询文本
            top_k: 返回数量
            filter_type: 记忆类型过滤
        
        Returns:
            记忆列表
        """
        # 生成查询 embedding
        query_embedding = self._generate_embedding(query)
        
        # 构建过滤条件
        filter_dict = {"user_id": user_id}
        if filter_type:
            filter_dict["memory_type"] = filter_type
        
        # 向量检索
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            filter=filter_dict,
            include_metadata=True
        )
        
        # 格式化结果
        memories = []
        for match in results.matches:
            memories.append({
                "memory_id": match.id,
                "content": match.metadata["content"],
                "memory_type": match.metadata["memory_type"],
                "importance": match.metadata["importance"],
                "similarity": match.score,
                "timestamp": match.metadata["timestamp"]
            })
        
        return memories
    
    def _generate_embedding(self, text: str) -> List[float]:
        """
        生成文本 embedding
        
        Args:
            text: 输入文本
        
        Returns:
            embedding 向量
        """
        response = self.openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        
        return response.data[0].embedding
```

### 3. 记忆检索 (Memory Retrieval)

```python
# memory_service.py
from typing import Dict, List
import redis

class MemoryService:
    """
    记忆服务（整合短期和长期记忆）
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.storage = MemoryStorage(api_key="your-pinecone-api-key")
        self.extractor = MemoryExtractor()
    
    def get_relevant_memories(
        self,
        query: str,
        top_k: int = 5
    ) -> Dict:
        """
        获取相关记忆（短期 + 长期）
        
        Args:
            query: 查询文本
            top_k: 返回数量
        
        Returns:
            记忆字典
        """
        memories = {
            "short_term": self._get_short_term_memory(),
            "long_term": self._get_long_term_memory(query, top_k)
        }
        
        return self._merge_memories(memories)
    
    def _get_short_term_memory(self) -> Dict:
        """
        获取短期记忆（Redis）
        """
        key = f"user:{self.user_id}:session"
        data = self.redis_client.hgetall(key)
        
        if not data:
            return {}
        
        return {
            k.decode(): v.decode()
            for k, v in data.items()
        }
    
    def _get_long_term_memory(self, query: str, top_k: int) -> List[Dict]:
        """
        获取长期记忆（向量数据库）
        """
        return self.storage.retrieve_memories(
            user_id=self.user_id,
            query=query,
            top_k=top_k
        )
    
    def _merge_memories(self, memories: Dict) -> Dict:
        """
        合并短期和长期记忆
        """
        merged = {
            "preferences": [],
            "habits": [],
            "favorite_locations": []
        }
        
        # 从长期记忆提取
        for mem in memories["long_term"]:
            if mem["memory_type"] == "preference":
                merged["preferences"].append(mem["content"])
            elif mem["memory_type"] == "habit":
                merged["habits"].append(mem["content"])
            elif mem["memory_type"] == "location":
                merged["favorite_locations"].append(mem["content"])
        
        return merged
    
    def update_from_interaction(
        self,
        user_input: str,
        ai_response: str,
        interaction_type: str
    ):
        """
        从交互中更新记忆
        
        Args:
            user_input: 用户输入
            ai_response: AI 响应
            interaction_type: 交互类型
        """
        # 提取实体
        entities = self.extractor.extract_entities(user_input)
        
        # 创建记忆
        memory = self.extractor.create_memory(
            entities=entities,
            context=f"用户: {user_input}\nAI: {ai_response}"
        )
        
        # 存储记忆
        if memory["importance"] > 0.6:  # 只存储重要记忆
            self.storage.store_memory(self.user_id, memory)
```

---

## 📊 记忆数据结构

### MySQL 表结构

```sql
-- 记忆表
CREATE TABLE memories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  memory_type ENUM('preference', 'habit', 'recipe', 'location') NOT NULL,
  content TEXT NOT NULL,
  vector_id VARCHAR(100),
  importance FLOAT DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_type (user_id, memory_type),
  INDEX idx_importance (importance)
);

-- 记忆标签表
CREATE TABLE memory_tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  memory_id BIGINT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (memory_id) REFERENCES memories(id),
  INDEX idx_tag (tag)
);
```

---

## 🎯 最佳实践

### 1. 记忆管理
- ✅ 定期清理低重要性记忆
- ✅ 合并相似记忆
- ✅ 更新记忆权重

### 2. 隐私保护
- ✅ 敏感信息加密存储
- ✅ 用户可删除记忆
- ✅ 遵守数据保护法规

### 3. 性能优化
- ✅ 缓存热门记忆
- ✅ 异步更新记忆
- ✅ 批量处理记忆

---

**文档作者**: Jason Tsao  
**更新时间**: 2026年1月17日  
**版本**: 1.0
