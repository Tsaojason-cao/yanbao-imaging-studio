# yanbao AI - 新 Manus 账号执行手册

## 🚀 快速开始（5分钟）

```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 2. 安装依赖
pnpm install

# 3. 查看所有文档
ls -la *.md

# 4. 开始执行
# 按照下面的 Day 1-7 逐步执行
```

---

## 📅 Day 1: 环境搭建与架构校对

### 🎯 目标
剔除老代码中臃肿、迟钝的传统逻辑，为智能化升级做准备

### ⏰ 时间分配
- 上午 (4h): 代码审计
- 下午 (4h): 架构重构

---

### 上午: 代码审计 (9:00-13:00)

#### Step 1: 克隆并检查项目 (30分钟)

```bash
# 1.1 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 1.2 查看项目结构
tree -L 2 -I 'node_modules|.git'

# 1.3 查看所有文档
ls -la *.md

# 1.4 阅读核心文档（必读）
cat INTELLIGENCE_UPGRADE.md    # 智能化升级方案
cat ARCHITECTURE.md             # 云端架构
cat MASTER_AND_MEMORY.md        # 大师功能与记忆系统
```

#### Step 2: 安装依赖 (15分钟)

```bash
# 2.1 安装 Node.js 依赖
pnpm install

# 2.2 安装 Python 依赖（后端）
sudo pip3 install openai pinecone-client redis neo4j

# 2.3 验证安装
pnpm list
pip3 list | grep -E "openai|pinecone|redis|neo4j"
```

#### Step 3: 代码质量分析 (1小时)

```bash
# 3.1 运行 Linter
npm run lint

# 3.2 查找孤立功能
grep -r "export.*function" src/ | grep -v "Memory\|Master\|AI"

# 3.3 查找硬编码数据
grep -r "const.*=.*\[" src/ | grep -v "import"

# 3.4 查找缺少记忆集成的部分
grep -r "camera\|photo\|edit" src/ | grep -v "Memory"
```

#### Step 4: 识别问题代码 (1.5小时)

创建问题清单：

```bash
# 创建问题清单文件
cat > /tmp/code_issues.md << 'EOF'
# 代码问题清单

## 孤立功能（需要集成记忆）
- [ ] CameraScreen.tsx - 拍照功能没有记忆集成
- [ ] EditorScreen.tsx - 编辑器没有配方记忆
- [ ] GalleryScreen.tsx - 相册没有智能分类
- [ ] MapScreen.tsx - 地图没有足迹记忆

## 冗余代码（需要优化）
- [ ] 重复的数据库查询
- [ ] 重复的状态管理
- [ ] 重复的样式定义

## 缺失功能（需要添加）
- [ ] 记忆服务接口
- [ ] 大师推理接口
- [ ] 向量检索接口
- [ ] 自进化反馈收集
EOF

cat /tmp/code_issues.md
```

#### Step 5: 创建重构计划 (1小时)

```bash
# 创建重构计划
cat > /tmp/refactor_plan.md << 'EOF'
# 重构计划

## 阶段1: 创建核心服务层
1. 创建 MemoryService.ts - 记忆服务
2. 创建 MasterService.ts - 大师服务
3. 创建 VectorService.ts - 向量检索服务

## 阶段2: 重构现有组件
1. 重构 CameraScreen.tsx - 集成记忆
2. 重构 EditorScreen.tsx - 集成配方记忆
3. 重构 GalleryScreen.tsx - 集成智能分类
4. 重构 MapScreen.tsx - 集成足迹记忆

## 阶段3: 添加智能化功能
1. 添加主动推荐
2. 添加场景识别
3. 添加自进化反馈
EOF

cat /tmp/refactor_plan.md
```

---

### 下午: 架构重构 (14:00-18:00)

#### Step 6: 创建核心服务层 (2小时)

##### 6.1 创建 MemoryService.ts

```typescript
// src/services/MemoryService.ts
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

interface Memory {
  id: string;
  type: 'photo' | 'recipe' | 'footprint' | 'preference';
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
  timestamp: number;
}

class MemoryService {
  private static instance: MemoryService;
  private pinecone: Pinecone;
  private openai: OpenAI;
  private userId: string;

  private constructor(userId: string) {
    this.userId = userId;
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || ''
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
  }

  static getInstance(userId: string): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService(userId);
    }
    return MemoryService.instance;
  }

  /**
   * 存储记忆
   */
  async store(memory: Omit<Memory, 'id' | 'embedding' | 'timestamp'>): Promise<string> {
    try {
      // 1. 生成 embedding
      const embedding = await this.generateEmbedding(memory.content);

      // 2. 生成 ID
      const id = `${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 3. 存储到向量数据库
      const index = this.pinecone.index('yanbao-memory');
      await index.upsert([{
        id,
        values: embedding,
        metadata: {
          userId: this.userId,
          type: memory.type,
          content: memory.content,
          ...memory.metadata,
          timestamp: Date.now()
        }
      }]);

      console.log(`✅ Memory stored: ${id}`);
      return id;
    } catch (error) {
      console.error('❌ Failed to store memory:', error);
      throw error;
    }
  }

  /**
   * 检索记忆
   */
  async retrieve(query: string, options?: {
    type?: Memory['type'];
    topK?: number;
    filter?: Record<string, any>;
  }): Promise<Memory[]> {
    try {
      // 1. 生成查询 embedding
      const queryEmbedding = await this.generateEmbedding(query);

      // 2. 构建过滤器
      const filter: Record<string, any> = {
        userId: this.userId
      };
      if (options?.type) {
        filter.type = options.type;
      }
      if (options?.filter) {
        Object.assign(filter, options.filter);
      }

      // 3. 检索
      const index = this.pinecone.index('yanbao-memory');
      const results = await index.query({
        vector: queryEmbedding,
        topK: options?.topK || 5,
        filter,
        includeMetadata: true
      });

      // 4. 转换结果
      const memories: Memory[] = results.matches?.map(match => ({
        id: match.id,
        type: match.metadata?.type as Memory['type'],
        content: match.metadata?.content as string,
        metadata: match.metadata || {},
        timestamp: match.metadata?.timestamp as number
      })) || [];

      console.log(`✅ Retrieved ${memories.length} memories for query: "${query}"`);
      return memories;
    } catch (error) {
      console.error('❌ Failed to retrieve memories:', error);
      throw error;
    }
  }

  /**
   * 生成 embedding
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    return response.data[0].embedding;
  }

  /**
   * 更新记忆
   */
  async update(id: string, updates: Partial<Memory>): Promise<void> {
    try {
      const index = this.pinecone.index('yanbao-memory');
      
      // 如果更新了 content，需要重新生成 embedding
      let embedding: number[] | undefined;
      if (updates.content) {
        embedding = await this.generateEmbedding(updates.content);
      }

      await index.update({
        id,
        values: embedding,
        metadata: updates.metadata
      });

      console.log(`✅ Memory updated: ${id}`);
    } catch (error) {
      console.error('❌ Failed to update memory:', error);
      throw error;
    }
  }

  /**
   * 删除记忆
   */
  async delete(id: string): Promise<void> {
    try {
      const index = this.pinecone.index('yanbao-memory');
      await index.deleteOne(id);
      console.log(`✅ Memory deleted: ${id}`);
    } catch (error) {
      console.error('❌ Failed to delete memory:', error);
      throw error;
    }
  }
}

export default MemoryService;
export type { Memory };
```

保存文件：

```bash
# 创建目录
mkdir -p src/services

# 保存文件（复制上面的代码）
# 使用你喜欢的编辑器，或者：
cat > src/services/MemoryService.ts << 'EOF'
[粘贴上面的代码]
EOF
```

##### 6.2 创建 MasterService.ts

```typescript
// src/services/MasterService.ts
import OpenAI from 'openai';
import MemoryService from './MemoryService';

type MasterType = 'photography' | 'editing' | 'location';

interface ReasoningChain {
  step: number;
  description: string;
  result: any;
}

interface MasterResponse {
  advice: string;
  reasoningChain: ReasoningChain[];
  confidence: number;
  alternatives?: string[];
}

class MasterService {
  private static instance: MasterService;
  private openai: OpenAI;
  private memoryService: MemoryService;
  private userId: string;

  private constructor(userId: string) {
    this.userId = userId;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
    this.memoryService = MemoryService.getInstance(userId);
  }

  static getInstance(userId: string): MasterService {
    if (!MasterService.instance) {
      MasterService.instance = new MasterService(userId);
    }
    return MasterService.instance;
  }

  /**
   * 获取大师建议
   */
  async getAdvice(
    masterType: MasterType,
    userInput: string,
    context?: Record<string, any>
  ): Promise<MasterResponse> {
    const reasoningChain: ReasoningChain[] = [];

    try {
      // Step 1: 理解意图
      reasoningChain.push({
        step: 1,
        description: '理解用户意图',
        result: 'analyzing...'
      });
      const intent = await this.understandIntent(userInput);
      reasoningChain[0].result = intent;

      // Step 2: 检索记忆
      reasoningChain.push({
        step: 2,
        description: '检索相关记忆',
        result: 'retrieving...'
      });
      const memories = await this.memoryService.retrieve(userInput, {
        topK: 5
      });
      reasoningChain[1].result = `找到 ${memories.length} 条相关记忆`;

      // Step 3: 分析上下文
      reasoningChain.push({
        step: 3,
        description: '分析当前情境',
        result: 'analyzing...'
      });
      const contextAnalysis = this.analyzeContext(memories, context);
      reasoningChain[2].result = contextAnalysis;

      // Step 4: 生成建议
      reasoningChain.push({
        step: 4,
        description: '生成个性化建议',
        result: 'generating...'
      });
      const advice = await this.generateAdvice(
        masterType,
        userInput,
        intent,
        memories,
        contextAnalysis
      );
      reasoningChain[3].result = '建议已生成';

      return {
        advice,
        reasoningChain,
        confidence: 0.85,
        alternatives: []
      };
    } catch (error) {
      console.error('❌ Failed to get master advice:', error);
      throw error;
    }
  }

  /**
   * 理解用户意图
   */
  private async understandIntent(userInput: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `分析用户意图："${userInput}"

请识别：
1. 主要目标（拍照/编辑/推荐地点）
2. 具体需求（技术指导/创意建议/实用技巧）
3. 隐含信息（时间/地点/情绪）

以 JSON 格式返回。`
      }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  /**
   * 分析上下文
   */
  private analyzeContext(memories: any[], context?: Record<string, any>): any {
    return {
      userPreferences: this.extractPreferences(memories),
      pastBehaviors: this.extractBehaviors(memories),
      currentSituation: context || {},
      constraints: this.identifyConstraints(context)
    };
  }

  /**
   * 提取用户偏好
   */
  private extractPreferences(memories: any[]): any {
    // 从记忆中提取偏好
    const preferences: Record<string, number> = {};
    
    memories.forEach(memory => {
      if (memory.type === 'preference') {
        const key = memory.metadata.key;
        preferences[key] = (preferences[key] || 0) + 1;
      }
    });

    return preferences;
  }

  /**
   * 提取用户行为
   */
  private extractBehaviors(memories: any[]): any {
    return memories
      .filter(m => m.type === 'photo' || m.type === 'recipe')
      .map(m => ({
        type: m.type,
        timestamp: m.timestamp,
        metadata: m.metadata
      }));
  }

  /**
   * 识别限制条件
   */
  private identifyConstraints(context?: Record<string, any>): any {
    const constraints: any = {};

    if (context?.device) {
      constraints.device = context.device;
    }
    if (context?.location) {
      constraints.location = context.location;
    }
    if (context?.time) {
      constraints.time = context.time;
    }

    return constraints;
  }

  /**
   * 生成建议
   */
  private async generateAdvice(
    masterType: MasterType,
    userInput: string,
    intent: any,
    memories: any[],
    contextAnalysis: any
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(masterType);
    const userMemory = this.formatMemories(memories);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `
用户问题：${userInput}

用户意图：${JSON.stringify(intent, null, 2)}

用户记忆：
${userMemory}

上下文分析：${JSON.stringify(contextAnalysis, null, 2)}

请给出个性化、可执行的建议。要求：
1. 使用简体中文
2. 语气专业但亲切
3. 提到用户的历史（如"记得上次..."）
4. 给出具体步骤
5. 主动提供额外帮助
` }
      ]
    });

    return response.choices[0].message.content || '';
  }

  /**
   * 获取系统 Prompt
   */
  private getSystemPrompt(masterType: MasterType): string {
    const prompts = {
      photography: `你是 yanbao AI 的摄影大师。你精通各种摄影技巧，能够根据用户的设备、场景和偏好给出专业建议。`,
      editing: `你是 yanbao AI 的编辑大师。你精通照片后期处理，能够推荐合适的滤镜和参数调节方案。`,
      location: `你是 yanbao AI 的地点推荐大师。你熟悉各地的拍摄地点，能够根据用户的风格偏好推荐合适的地方。`
    };

    return prompts[masterType];
  }

  /**
   * 格式化记忆
   */
  private formatMemories(memories: any[]): string {
    if (memories.length === 0) {
      return '暂无相关记忆';
    }

    return memories.map((m, i) => 
      `${i + 1}. [${m.type}] ${m.content} (${new Date(m.timestamp).toLocaleDateString()})`
    ).join('\n');
  }
}

export default MasterService;
export type { MasterType, MasterResponse, ReasoningChain };
```

保存文件：

```bash
cat > src/services/MasterService.ts << 'EOF'
[粘贴上面的代码]
EOF
```

#### Step 7: 重构现有组件 (1.5小时)

##### 7.1 重构 CameraScreen.tsx

在现有的 CameraScreen.tsx 中添加记忆集成：

```typescript
// 在 CameraScreen.tsx 顶部添加导入
import MemoryService from './services/MemoryService';
import MasterService from './services/MasterService';

// 在组件中添加服务实例
const memoryService = MemoryService.getInstance('user_123'); // 替换为实际用户 ID
const masterService = MasterService.getInstance('user_123');

// 修改 takePhoto 函数
const takePhoto = async () => {
  try {
    // 1. 检索记忆 - 获取用户的相机偏好
    const memories = await memoryService.retrieve('相机设置偏好', {
      type: 'preference',
      topK: 3
    });

    // 2. 应用偏好设置
    if (memories.length > 0) {
      const latestPreference = memories[0];
      // 应用美颜参数
      if (latestPreference.metadata.beauty) {
        setBeautyLevel(latestPreference.metadata.beauty);
      }
      if (latestPreference.metadata.whitening) {
        setWhiteningLevel(latestPreference.metadata.whitening);
      }
      
      // 显示提示
      Alert.alert('💡 提示', 'yanbao AI 已为你预设常用参数');
    }

    // 3. 拍照
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
      });

      // 4. 保存到记忆
      await memoryService.store({
        type: 'photo',
        content: `拍摄了一张照片`,
        metadata: {
          uri: photo.path,
          beauty: beautyLevel,
          whitening: whiteningLevel,
          location: await getLocation(),
          timestamp: Date.now()
        }
      });

      // 5. 获取大师建议
      const advice = await masterService.getAdvice(
        'photography',
        '刚拍了一张照片，有什么建议吗？',
        {
          photo: photo.path,
          location: await getLocation()
        }
      );

      // 显示建议
      Alert.alert('📷 摄影大师建议', advice.advice);

      navigation.navigate('Preview', { photo: photo.path });
    }
  } catch (error) {
    console.error('拍照失败:', error);
    Alert.alert('错误', '拍照失败，请重试');
  }
};
```

##### 7.2 重构 EditorScreen.tsx

```typescript
// 在 EditorScreen.tsx 中添加智能推荐

// 添加场景识别函数
const analyzeScene = async (photoUri: string): Promise<string> => {
  // 使用 AI 识别场景
  const masterService = MasterService.getInstance('user_123');
  const advice = await masterService.getAdvice(
    'editing',
    `这张照片适合什么滤镜？`,
    { photo: photoUri }
  );
  
  // 从建议中提取场景
  return advice.advice;
};

// 修改组件加载时的逻辑
useEffect(() => {
  const loadRecommendations = async () => {
    // 1. 分析场景
    const scene = await analyzeScene(photoUri);
    
    // 2. 检索相似场景的配方
    const memoryService = MemoryService.getInstance('user_123');
    const recipes = await memoryService.retrieve(`${scene}场景的配方`, {
      type: 'recipe',
      topK: 3
    });
    
    // 3. 推荐滤镜
    if (recipes.length > 0) {
      const recommendedFilter = recipes[0].metadata.filter;
      Alert.alert(
        '🎨 智能推荐',
        `根据你的偏好，推荐使用"${recommendedFilter}"滤镜`,
        [
          { text: '稍后', style: 'cancel' },
          { 
            text: '应用', 
            onPress: () => applyFilter(recommendedFilter)
          }
        ]
      );
    }
  };
  
  loadRecommendations();
}, [photoUri]);

// 保存配方时存储到记忆
const saveRecipe = async () => {
  const memoryService = MemoryService.getInstance('user_123');
  await memoryService.store({
    type: 'recipe',
    content: `保存了${selectedFilter}滤镜配方`,
    metadata: {
      filter: selectedFilter,
      brightness: brightness,
      contrast: contrast,
      saturation: saturation,
      scene: await analyzeScene(photoUri)
    }
  });
  
  Alert.alert('✅ 成功', '配方已保存到记忆');
};
```

#### Step 8: 提交代码 (30分钟)

```bash
# 8.1 查看修改
git status
git diff

# 8.2 添加文件
git add src/services/MemoryService.ts
git add src/services/MasterService.ts
git add CameraScreen.tsx
git add EditorScreen.tsx

# 8.3 提交
git commit -m "refactor: integrate memory and master services into camera and editor

- Add MemoryService for vector-based memory storage and retrieval
- Add MasterService for AI-powered reasoning and advice
- Integrate memory into CameraScreen for preference recall
- Integrate memory into EditorScreen for recipe recommendations
- Add intelligent filter recommendations based on scene analysis"

# 8.4 推送
git push origin main
```

### ✅ Day 1 验收标准

- [ ] 项目已克隆并安装依赖
- [ ] 已阅读核心文档（INTELLIGENCE_UPGRADE.md 等）
- [ ] 已创建 MemoryService.ts
- [ ] 已创建 MasterService.ts
- [ ] 已重构 CameraScreen.tsx 集成记忆
- [ ] 已重构 EditorScreen.tsx 集成记忆
- [ ] 代码已提交并推送到 GitHub

---

## 📅 Day 2: 大师功能开发

### 🎯 目标
让大师功能具备"思考过程"（Chain of Thought）

### ⏰ 时间分配
- 上午 (4h): 推理链实现
- 下午 (4h): Prompt 优化与测试

---

### 上午: 推理链实现 (9:00-13:00)

#### Step 1: 创建推理链模块 (2小时)

```python
# backend/master_reasoning.py
from typing import Dict, List, Any
from openai import OpenAI
import json

class MasterReasoning:
    """
    大师推理链实现
    """
    
    def __init__(self, user_id: str, master_type: str):
        self.user_id = user_id
        self.master_type = master_type
        self.client = OpenAI()
        self.reasoning_steps: List[Dict] = []
    
    def reason(self, user_input: str, context: Dict) -> Dict:
        """
        执行完整推理链
        
        Returns:
            {
                "advice": "最终建议",
                "reasoning_chain": [...],
                "confidence": 0.85
            }
        """
        self.reasoning_steps = []
        
        # Step 1: 理解意图
        intent = self._understand_intent(user_input)
        self._log_step("理解意图", intent)
        
        # Step 2: 检索记忆
        memories = self._retrieve_memories(user_input, intent)
        self._log_step("检索记忆", f"找到 {len(memories)} 条相关记忆")
        
        # Step 3: 分析上下文
        analysis = self._analyze_context(user_input, memories, context)
        self._log_step("分析上下文", analysis)
        
        # Step 4: 生成假设
        hypotheses = self._generate_hypotheses(intent, analysis)
        self._log_step("生成假设", f"生成了 {len(hypotheses)} 个方案")
        
        # Step 5: 验证假设
        best_hypothesis = self._validate_hypotheses(hypotheses, memories)
        self._log_step("验证假设", f"选择了方案 {best_hypothesis['id']}")
        
        # Step 6: 生成建议
        advice = self._generate_advice(best_hypothesis, memories)
        self._log_step("生成建议", "建议已生成")
        
        return {
            "advice": advice,
            "reasoning_chain": self.reasoning_steps,
            "confidence": best_hypothesis.get("confidence", 0.7)
        }
    
    def _understand_intent(self, user_input: str) -> Dict:
        """理解用户意图"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""分析用户意图："{user_input}"

请识别：
1. 主要目标（拍照/编辑/推荐地点）
2. 具体需求（技术指导/创意建议/实用技巧）
3. 隐含信息（时间/地点/情绪）

以 JSON 格式返回。"""
            }],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _retrieve_memories(self, user_input: str, intent: Dict) -> List[Dict]:
        """检索相关记忆"""
        # TODO: 集成 Pinecone 向量检索
        # 这里先返回模拟数据
        return [
            {
                "id": "mem_001",
                "content": "用户上次在外滩拍夜景",
                "metadata": {"location": "外滩", "time": "夜晚"}
            },
            {
                "id": "mem_002",
                "content": "用户喜欢冷色调滤镜",
                "metadata": {"preference": "cold_tone"}
            }
        ]
    
    def _analyze_context(
        self,
        user_input: str,
        memories: List[Dict],
        context: Dict
    ) -> Dict:
        """分析上下文"""
        return {
            "user_preferences": self._extract_preferences(memories),
            "past_behaviors": self._extract_behaviors(memories),
            "current_situation": context,
            "constraints": self._identify_constraints(context)
        }
    
    def _extract_preferences(self, memories: List[Dict]) -> Dict:
        """从记忆中提取偏好"""
        preferences = {}
        for memory in memories:
            if "preference" in memory.get("metadata", {}):
                pref = memory["metadata"]["preference"]
                preferences[pref] = preferences.get(pref, 0) + 1
        return preferences
    
    def _extract_behaviors(self, memories: List[Dict]) -> List[Dict]:
        """从记忆中提取行为"""
        return [
            {
                "action": m.get("content", ""),
                "metadata": m.get("metadata", {})
            }
            for m in memories
        ]
    
    def _identify_constraints(self, context: Dict) -> Dict:
        """识别限制条件"""
        constraints = {}
        
        if "device" in context:
            constraints["device"] = context["device"]
        if "location" in context:
            constraints["location"] = context["location"]
        if "time" in context:
            constraints["time"] = context["time"]
            
        return constraints
    
    def _generate_hypotheses(self, intent: Dict, analysis: Dict) -> List[Dict]:
        """生成多个假设方案"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""基于以下信息生成 3 个建议方案：

用户意图：{json.dumps(intent, ensure_ascii=False)}
上下文分析：{json.dumps(analysis, ensure_ascii=False)}

要求：
1. 每个方案要有明确的理由
2. 考虑用户的偏好和限制
3. 提供具体的执行步骤

以 JSON 数组格式返回。"""
            }],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        hypotheses = result.get("hypotheses", [])
        
        # 添加 ID
        for i, h in enumerate(hypotheses):
            h["id"] = i + 1
            
        return hypotheses
    
    def _validate_hypotheses(
        self,
        hypotheses: List[Dict],
        memories: List[Dict]
    ) -> Dict:
        """验证假设，选择最佳方案"""
        scores = []
        
        for hypothesis in hypotheses:
            score = 0.0
            
            # 与用户偏好的匹配度 (40%)
            preference_match = self._calculate_preference_match(hypothesis, memories)
            score += preference_match * 0.4
            
            # 可执行性 (30%)
            feasibility = self._calculate_feasibility(hypothesis)
            score += feasibility * 0.3
            
            # 创新性 (30%)
            novelty = self._calculate_novelty(hypothesis, memories)
            score += novelty * 0.3
            
            scores.append({
                **hypothesis,
                "score": score,
                "confidence": min(score, 0.95)
            })
        
        # 返回得分最高的假设
        return max(scores, key=lambda x: x["score"])
    
    def _calculate_preference_match(self, hypothesis: Dict, memories: List[Dict]) -> float:
        """计算与用户偏好的匹配度"""
        # 简化实现，实际应该更复杂
        return 0.8
    
    def _calculate_feasibility(self, hypothesis: Dict) -> float:
        """计算可执行性"""
        # 简化实现
        return 0.7
    
    def _calculate_novelty(self, hypothesis: Dict, memories: List[Dict]) -> float:
        """计算创新性"""
        # 简化实现
        return 0.6
    
    def _generate_advice(self, hypothesis: Dict, memories: List[Dict]) -> str:
        """生成最终建议"""
        memory_context = "\n".join([
            f"- {m['content']}" for m in memories[:3]
        ])
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""基于以下推理过程，生成自然、亲切的建议：

推理链：
{self._format_reasoning_chain()}

最佳方案：
{json.dumps(hypothesis, ensure_ascii=False, indent=2)}

用户记忆：
{memory_context}

要求：
1. 使用简体中文
2. 语气专业但亲切
3. 提到用户的历史（如"记得上次..."）
4. 给出具体步骤
5. 主动提供额外帮助"""
            }]
        )
        
        return response.choices[0].message.content
    
    def _log_step(self, description: str, result: Any):
        """记录推理步骤"""
        self.reasoning_steps.append({
            "step": len(self.reasoning_steps) + 1,
            "description": description,
            "result": result
        })
    
    def _format_reasoning_chain(self) -> str:
        """格式化推理链"""
        return "\n".join([
            f"{s['step']}. {s['description']}: {s['result']}"
            for s in self.reasoning_steps
        ])


# 测试代码
if __name__ == "__main__":
    reasoning = MasterReasoning(
        user_id="test_user",
        master_type="photography"
    )
    
    result = reasoning.reason(
        user_input="如何拍夜景？",
        context={
            "device": "iPhone 15 Pro",
            "location": "外滩",
            "time": "20:00"
        }
    )
    
    print("=== 推理结果 ===")
    print(f"建议：{result['advice']}")
    print(f"\n置信度：{result['confidence']}")
    print(f"\n推理链：")
    for step in result['reasoning_chain']:
        print(f"  {step['step']}. {step['description']}: {step['result']}")
```

保存文件：

```bash
# 创建后端目录
mkdir -p backend

# 保存文件
cat > backend/master_reasoning.py << 'EOF'
[粘贴上面的代码]
EOF

# 测试
cd backend
python3 master_reasoning.py
```

#### Step 2: 创建 API 接口 (1小时)

```python
# backend/api.py
from flask import Flask, request, jsonify
from master_reasoning import MasterReasoning
import os

app = Flask(__name__)

@app.route('/api/master/advice', methods=['POST'])
def get_master_advice():
    """
    获取大师建议
    
    Request:
        {
            "user_id": "user_123",
            "master_type": "photography",
            "user_input": "如何拍夜景？",
            "context": {...}
        }
    
    Response:
        {
            "advice": "...",
            "reasoning_chain": [...],
            "confidence": 0.85
        }
    """
    try:
        data = request.json
        
        user_id = data.get('user_id')
        master_type = data.get('master_type')
        user_input = data.get('user_input')
        context = data.get('context', {})
        
        if not all([user_id, master_type, user_input]):
            return jsonify({
                "error": "Missing required fields"
            }), 400
        
        # 执行推理
        reasoning = MasterReasoning(user_id, master_type)
        result = reasoning.reason(user_input, context)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
```

保存并测试：

```bash
# 保存文件
cat > backend/api.py << 'EOF'
[粘贴上面的代码]
EOF

# 安装依赖
pip3 install flask

# 启动服务器
python3 backend/api.py

# 在另一个终端测试
curl -X POST http://localhost:5000/api/master/advice \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "master_type": "photography",
    "user_input": "如何拍夜景？",
    "context": {
      "device": "iPhone 15 Pro",
      "location": "外滩"
    }
  }'
```

#### Step 3: 集成到前端 (1小时)

```typescript
// src/services/MasterService.ts 更新

// 添加 API 调用方法
async getAdviceFromAPI(
  masterType: MasterType,
  userInput: string,
  context?: Record<string, any>
): Promise<MasterResponse> {
  try {
    const response = await fetch('http://localhost:5000/api/master/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.userId,
        master_type: masterType,
        user_input: userInput,
        context: context || {}
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Failed to get advice from API:', error);
    throw error;
  }
}
```

---

### 下午: Prompt 优化与测试 (14:00-18:00)

#### Step 4: 优化 Prompt (2小时)

创建 Prompt 模板库：

```python
# backend/prompts.py

MASTER_PROMPTS = {
    "photography": {
        "system": """你是 yanbao AI 的摄影大师。

你的特点：
- 精通各种摄影技巧和器材
- 能够根据用户的设备、场景和偏好给出专业建议
- 语气专业但亲切，像一个经验丰富的摄影师朋友

你的任务：
1. 理解用户的真实需求
2. 回忆用户的历史偏好
3. 分析当前情境
4. 生成个性化、可执行的建议
5. 主动提供额外帮助

请按照 Chain of Thought 的方式思考，展示你的推理过程。""",
        
        "user_template": """用户问题：{user_input}

用户背景：
{user_memory}

当前情境：
- 设备：{device}
- 地点：{location}
- 时间：{time}

请给出你的建议，要求：
1. 提到用户的历史（如"记得上次..."）
2. 给出具体步骤
3. 考虑设备限制
4. 主动提供额外帮助"""
    },
    
    "editing": {
        "system": """你是 yanbao AI 的编辑大师。

你的特点：
- 精通照片后期处理和色彩理论
- 能够推荐合适的滤镜和参数调节方案
- 了解各种风格和流行趋势

你的任务：
1. 分析照片的场景和风格
2. 回忆用户的配方偏好
3. 推荐合适的滤镜和参数
4. 解释推荐理由
5. 提供替代方案

请按照 Chain of Thought 的方式思考，展示你的推理过程。""",
        
        "user_template": """用户问题：{user_input}

照片信息：
- 场景：{scene}
- 拍摄时间：{time}
- 拍摄地点：{location}

用户偏好：
{user_preferences}

历史配方：
{user_recipes}

请推荐滤镜和参数，要求：
1. 解释为什么推荐这个滤镜
2. 给出具体的参数值
3. 提供 2-3 个替代方案
4. 说明每个方案的适用场景"""
    },
    
    "location": {
        "system": """你是 yanbao AI 的地点推荐大师。

你的特点：
- 熟悉各地的拍摄地点和最佳时间
- 能够根据用户的风格偏好推荐合适的地方
- 了解交通、天气等实用信息

你的任务：
1. 理解用户想要的拍摄风格
2. 回忆用户的足迹历史
3. 推荐合适的地点
4. 提供实用的拍摄建议
5. 规划路线和时间

请按照 Chain of Thought 的方式思考，展示你的推理过程。""",
        
        "user_template": """用户问题：{user_input}

用户足迹：
{user_footprints}

用户偏好：
- 喜欢的风格：{preferred_styles}
- 去过的地方：{visited_places}

当前位置：{current_location}

请推荐拍摄地点，要求：
1. 推荐 3-5 个地点
2. 说明每个地点的特色
3. 提供最佳拍摄时间
4. 给出交通建议
5. 提醒注意事项"""
    }
}

def get_prompt(master_type: str, **kwargs) -> tuple[str, str]:
    """
    获取 Prompt
    
    Returns:
        (system_prompt, user_prompt)
    """
    if master_type not in MASTER_PROMPTS:
        raise ValueError(f"Unknown master type: {master_type}")
    
    prompts = MASTER_PROMPTS[master_type]
    system_prompt = prompts["system"]
    user_prompt = prompts["user_template"].format(**kwargs)
    
    return system_prompt, user_prompt
```

#### Step 5: 测试推理链 (2小时)

创建测试脚本：

```python
# backend/test_reasoning.py
from master_reasoning import MasterReasoning
import json

def test_photography_master():
    """测试摄影大师"""
    print("=== 测试摄影大师 ===\n")
    
    reasoning = MasterReasoning(
        user_id="test_user",
        master_type="photography"
    )
    
    test_cases = [
        {
            "input": "如何拍夜景？",
            "context": {
                "device": "iPhone 15 Pro",
                "location": "外滩",
                "time": "20:00"
            }
        },
        {
            "input": "海边拍照有什么技巧？",
            "context": {
                "device": "Canon EOS R5",
                "location": "金山海滩",
                "time": "17:00"
            }
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n--- 测试用例 {i} ---")
        print(f"输入：{test['input']}")
        print(f"上下文：{json.dumps(test['context'], ensure_ascii=False)}")
        
        result = reasoning.reason(test['input'], test['context'])
        
        print(f"\n建议：\n{result['advice']}")
        print(f"\n置信度：{result['confidence']}")
        print(f"\n推理链：")
        for step in result['reasoning_chain']:
            print(f"  {step['step']}. {step['description']}")
        
        print("\n" + "="*50)

def test_editing_master():
    """测试编辑大师"""
    print("\n=== 测试编辑大师 ===\n")
    
    reasoning = MasterReasoning(
        user_id="test_user",
        master_type="editing"
    )
    
    result = reasoning.reason(
        "这张海边的照片适合什么滤镜？",
        {
            "scene": "海边",
            "time": "傍晚",
            "location": "外滩"
        }
    )
    
    print(f"建议：\n{result['advice']}")
    print(f"\n置信度：{result['confidence']}")

def test_location_master():
    """测试地点推荐大师"""
    print("\n=== 测试地点推荐大师 ===\n")
    
    reasoning = MasterReasoning(
        user_id="test_user",
        master_type="location"
    )
    
    result = reasoning.reason(
        "推荐一些适合拍夜景的地方",
        {
            "current_location": "人民广场",
            "preferred_style": "都市夜景"
        }
    )
    
    print(f"建议：\n{result['advice']}")
    print(f"\n置信度：{result['confidence']}")

if __name__ == "__main__":
    test_photography_master()
    test_editing_master()
    test_location_master()
```

运行测试：

```bash
python3 backend/test_reasoning.py
```

#### Step 6: 提交代码 (30分钟)

```bash
# 查看修改
git status

# 添加文件
git add backend/master_reasoning.py
git add backend/api.py
git add backend/prompts.py
git add backend/test_reasoning.py
git add src/services/MasterService.ts

# 提交
git commit -m "feat: implement Chain of Thought reasoning for master services

- Add MasterReasoning class with 6-step reasoning chain
- Add Flask API for master advice
- Add prompt templates for 3 master types
- Add comprehensive test suite
- Integrate API calls into frontend MasterService"

# 推送
git push origin main
```

### ✅ Day 2 验收标准

- [ ] 已实现 MasterReasoning 类（6步推理链）
- [ ] 已创建 Flask API 接口
- [ ] 已优化 Prompt 模板
- [ ] 已创建测试脚本
- [ ] 测试通过（3种大师类型）
- [ ] 代码已提交并推送到 GitHub
- [ ] API 可以正常响应请求

---

## 📅 Day 3-7: 继续执行

由于篇幅限制，Day 3-7 的详细步骤请参考：
- **Day 3**: INTELLIGENCE_UPGRADE.md 中的"Day 3: 记忆系统接入"
- **Day 4**: INTELLIGENCE_UPGRADE.md 中的"Day 4: 媒体处理集成"
- **Day 5**: INTELLIGENCE_UPGRADE.md 中的"Day 5: 地图推荐集成"
- **Day 6**: INTELLIGENCE_UPGRADE.md 中的"Day 6: UI/UX 优化"
- **Day 7**: INTELLIGENCE_UPGRADE.md 中的"Day 7: 测试与上线"

---

## 🔄 Git 同步流程

### 每日同步

```bash
# 早上开始工作前
git pull origin main

# 工作中定期提交
git add .
git commit -m "feat: [描述]"

# 晚上下班前推送
git push origin main
```

### 提交规范

```bash
# 功能开发
git commit -m "feat: add memory activation system"

# Bug 修复
git commit -m "fix: resolve memory retrieval timeout issue"

# 文档更新
git commit -m "docs: update execution playbook"

# 重构
git commit -m "refactor: optimize master reasoning logic"

# 测试
git commit -m "test: add unit tests for memory service"
```

### 备份策略

```bash
# 每天结束时创建备份
tar -czf backup_$(date +%Y%m%d).tar.gz \
  src/ backend/ *.md package.json

# 上传到云端（可选）
# aws s3 cp backup_$(date +%Y%m%d).tar.gz s3://yanbao-backup/
```

---

## ✅ 总验收标准

### 功能完整性
- [ ] 所有 7 天任务已完成
- [ ] 四大智能化升级已实现
- [ ] 所有代码已提交到 GitHub

### 技术指标
- [ ] 记忆检索延迟 < 100ms
- [ ] 推理链响应时间 < 3s
- [ ] 推荐准确率 > 70%
- [ ] 系统可用性 > 99.9%

### 智能化程度
- [ ] 主动推荐命中率 > 60%
- [ ] 用户接受率 > 50%
- [ ] 记忆召回准确率 > 80%

---

**文档作者**: Jason Tsao  
**更新时间**: 2026年1月17日  
**版本**: 1.0

**按照这个手册执行，让 yanbao AI 真正"活"起来！** 🚀
