/**
 * 双轨制接口服务
 * 
 * 实现智能模式和降级模式的无缝切换，确保在 AI 服务不可用时系统依然稳定运行
 * 
 * @author Jason Tsao
 * @date 2026-01-17
 */

enum ServiceMode {
  INTELLIGENT = 'intelligent',  // 智能模式（AI + 记忆）
  FALLBACK = 'fallback'          // 降级模式（基础逻辑）
}

interface ServiceHealth {
  memoryEngine: boolean;
  aiReasoning: boolean;
  vectorSearch: boolean;
  lastCheck: number;
}

class DualModeService {
  private static instance: DualModeService;
  private currentMode: ServiceMode = ServiceMode.INTELLIGENT;
  private health: ServiceHealth = {
    memoryEngine: false,
    aiReasoning: false,
    vectorSearch: false,
    lastCheck: 0
  };
  
  // 健康检查间隔（毫秒）
  private readonly HEALTH_CHECK_INTERVAL = 5000;
  // 超时阈值（毫秒）
  private readonly TIMEOUT_THRESHOLD = 200;
  
  private constructor() {
    // 私有构造函数，确保单例
  }
  
  static getInstance(): DualModeService {
    if (!DualModeService.instance) {
      DualModeService.instance = new DualModeService();
      DualModeService.instance.startHealthCheck();
    }
    return DualModeService.instance;
  }
  
  /**
   * 启动健康检查
   */
  private startHealthCheck() {
    setInterval(async () => {
      await this.checkHealth();
    }, this.HEALTH_CHECK_INTERVAL);
  }
  
  /**
   * 检查系统健康状态
   */
  private async checkHealth(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // 检查记忆引擎
      this.health.memoryEngine = await this.checkMemoryEngine();
      
      // 检查 AI 推理
      this.health.aiReasoning = await this.checkAIReasoning();
      
      // 检查向量检索
      this.health.vectorSearch = await this.checkVectorSearch();
      
      this.health.lastCheck = Date.now();
      
      // 根据健康状态决定模式
      const allHealthy = this.health.memoryEngine && 
                        this.health.aiReasoning && 
                        this.health.vectorSearch;
      
      const previousMode = this.currentMode;
      this.currentMode = allHealthy ? 
        ServiceMode.INTELLIGENT : 
        ServiceMode.FALLBACK;
      
      // 模式切换时记录日志
      if (previousMode !== this.currentMode) {
        console.log(`🔄 Mode switched: ${previousMode} → ${this.currentMode}`);
      }
      
      const checkDuration = Date.now() - startTime;
      console.log(`🔍 Health check completed in ${checkDuration}ms, mode: ${this.currentMode}`);
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.currentMode = ServiceMode.FALLBACK;
    }
  }
  
  /**
   * 检查记忆引擎
   */
  private async checkMemoryEngine(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/memory/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(this.TIMEOUT_THRESHOLD)
      });
      const duration = Date.now() - startTime;
      return response.ok && duration < this.TIMEOUT_THRESHOLD;
    } catch {
      return false;
    }
  }
  
  /**
   * 检查 AI 推理
   */
  private async checkAIReasoning(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/master/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(this.TIMEOUT_THRESHOLD)
      });
      const duration = Date.now() - startTime;
      return response.ok && duration < this.TIMEOUT_THRESHOLD;
    } catch {
      return false;
    }
  }
  
  /**
   * 检查向量检索
   */
  private async checkVectorSearch(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/vector/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(this.TIMEOUT_THRESHOLD)
      });
      const duration = Date.now() - startTime;
      return response.ok && duration < this.TIMEOUT_THRESHOLD;
    } catch {
      return false;
    }
  }
  
  /**
   * 获取当前模式
   */
  getCurrentMode(): ServiceMode {
    return this.currentMode;
  }
  
  /**
   * 获取健康状态
   */
  getHealth(): ServiceHealth {
    return { ...this.health };
  }
  
  /**
   * 是否处于智能模式
   */
  isIntelligentMode(): boolean {
    return this.currentMode === ServiceMode.INTELLIGENT;
  }
  
  /**
   * 智能执行（带降级保护）
   * 
   * @param intelligentFn 智能模式执行函数
   * @param fallbackFn 降级模式执行函数
   * @returns 执行结果
   */
  async executeWithFallback<T>(
    intelligentFn: () => Promise<T>,
    fallbackFn: () => Promise<T>
  ): Promise<T> {
    if (this.currentMode === ServiceMode.INTELLIGENT) {
      try {
        const result = await Promise.race([
          intelligentFn(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), this.TIMEOUT_THRESHOLD)
          )
        ]);
        return result;
      } catch (error) {
        console.warn('⚠️ Intelligent mode failed, falling back to basic mode:', error);
        return await fallbackFn();
      }
    } else {
      console.log('ℹ️ Using fallback mode');
      return await fallbackFn();
    }
  }
  
  /**
   * 强制切换到降级模式（用于测试）
   */
  forceFallbackMode() {
    this.currentMode = ServiceMode.FALLBACK;
    console.log('⚠️ Forced to fallback mode');
  }
  
  /**
   * 强制切换到智能模式（用于测试）
   */
  forceIntelligentMode() {
    this.currentMode = ServiceMode.INTELLIGENT;
    console.log('✅ Forced to intelligent mode');
  }
}

export default DualModeService;
export { ServiceMode, ServiceHealth };
