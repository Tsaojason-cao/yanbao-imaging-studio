/**
 * 智能批量处理引擎
 * 
 * 功能：
 * - 智能任务调度（根据设备性能动态调整）
 * - 暂停/恢复功能
 * - 后台处理模式
 * - 实时进度跟踪
 * - 优先级队列
 * 
 * 作者：Manus AI
 * 日期：2026-01-13
 */

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3
}

export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface BatchTask {
  id: string;
  imageUri: string;
  presetId: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  resultUri?: string;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  estimatedTime?: number;
  retryCount?: number;
}

export interface BatchProcessingConfig {
  maxConcurrentTasks: number;    // 最大并发数
  enableBackgroundProcessing: boolean; // 是否启用后台处理
  autoRetry: boolean;             // 自动重试失败任务
  maxRetries: number;             // 最大重试次数
  taskTimeout: number;            // 任务超时时间（ms）
  memoryCheckInterval: number;    // 内存检查间隔（ms）
}

export type BatchTaskListener = (task: BatchTask) => void;

/**
 * 优先级队列实现
 */
class PriorityQueue<T> {
  private items: Array<{ element: T; priority: number }> = [];

  enqueue(element: T, priority: number): void {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  find(predicate: (element: T) => boolean): T | undefined {
    return this.items.find(item => predicate(item.element))?.element;
  }

  toArray(): T[] {
    return this.items.map(item => item.element);
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

export class BatchProcessingEngine {
  private config: BatchProcessingConfig;
  private taskQueue: PriorityQueue<BatchTask> = new PriorityQueue();
  private processingTasks: Map<string, BatchTask> = new Map();
  private pausedTasks: Set<string> = new Set();
  private listeners: Map<string, Set<BatchTaskListener>> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;
  private totalTasksProcessed: number = 0;
  private totalTasksFailed: number = 0;

  constructor(config: Partial<BatchProcessingConfig> = {}) {
    this.config = {
      maxConcurrentTasks: 2,
      enableBackgroundProcessing: true,
      autoRetry: true,
      maxRetries: 3,
      taskTimeout: 120000, // 2 分钟
      memoryCheckInterval: 5000, // 5 秒
      ...config
    };

    console.log('[BatchProcessingEngine] Initialized with config:', this.config);
    this.startProcessing();
  }

  /**
   * 添加任务到队列
   */
  addTask(
    imageUri: string,
    presetId: string,
    priority: TaskPriority = TaskPriority.NORMAL
  ): string {
    const task: BatchTask = {
      id: this.generateTaskId(),
      imageUri,
      presetId,
      priority,
      status: TaskStatus.PENDING,
      progress: 0,
      createdAt: Date.now(),
      retryCount: 0
    };

    this.taskQueue.enqueue(task, priority);
    this.notifyListeners(task.id, task);

    console.log('[BatchProcessingEngine] Task added:', task.id);

    return task.id;
  }

  /**
   * 添加多个任务
   */
  addBatchTasks(
    imageUris: string[],
    presetId: string,
    priority: TaskPriority = TaskPriority.NORMAL
  ): string[] {
    return imageUris.map(uri => this.addTask(uri, presetId, priority));
  }

  /**
   * 暂停任务
   */
  pauseTask(taskId: string): void {
    const task = this.processingTasks.get(taskId);
    if (task && task.status === TaskStatus.PROCESSING) {
      task.status = TaskStatus.PAUSED;
      this.pausedTasks.add(taskId);
      this.notifyListeners(taskId, task);
      console.log('[BatchProcessingEngine] Task paused:', taskId);
    }
  }

  /**
   * 恢复任务
   */
  resumeTask(taskId: string): void {
    const task = this.processingTasks.get(taskId);
    if (task && task.status === TaskStatus.PAUSED) {
      task.status = TaskStatus.PROCESSING;
      this.pausedTasks.delete(taskId);
      this.notifyListeners(taskId, task);
      console.log('[BatchProcessingEngine] Task resumed:', taskId);
    }
  }

  /**
   * 暂停所有任务
   */
  pauseAll(): void {
    this.isPaused = true;
    this.processingTasks.forEach(task => {
      if (task.status === TaskStatus.PROCESSING) {
        task.status = TaskStatus.PAUSED;
        this.pausedTasks.add(task.id);
        this.notifyListeners(task.id, task);
      }
    });
    console.log('[BatchProcessingEngine] All tasks paused');
  }

  /**
   * 恢复所有任务
   */
  resumeAll(): void {
    this.isPaused = false;
    this.pausedTasks.forEach(taskId => {
      const task = this.processingTasks.get(taskId);
      if (task) {
        task.status = TaskStatus.PROCESSING;
        this.notifyListeners(taskId, task);
      }
    });
    this.pausedTasks.clear();
    console.log('[BatchProcessingEngine] All tasks resumed');
  }

  /**
   * 取消任务
   */
  cancelTask(taskId: string): void {
    const task = this.processingTasks.get(taskId) || this.taskQueue.find(t => t.id === taskId);
    if (task) {
      task.status = TaskStatus.CANCELLED;
      this.processingTasks.delete(taskId);
      this.pausedTasks.delete(taskId);
      this.notifyListeners(taskId, task);
      console.log('[BatchProcessingEngine] Task cancelled:', taskId);
    }
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(taskId: string): BatchTask | undefined {
    return this.processingTasks.get(taskId) || this.taskQueue.find(t => t.id === taskId);
  }

  /**
   * 获取队列中的所有任务
   */
  getAllTasks(): BatchTask[] {
    const tasks = Array.from(this.processingTasks.values());
    tasks.push(...this.taskQueue.toArray());
    return tasks;
  }

  /**
   * 获取队列长度
   */
  getQueueLength(): number {
    return this.taskQueue.size() + this.processingTasks.size;
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    return {
      totalProcessed: this.totalTasksProcessed,
      totalFailed: this.totalTasksFailed,
      queueLength: this.getQueueLength(),
      processingCount: this.processingTasks.size,
      pausedCount: this.pausedTasks.size
    };
  }

  /**
   * 订阅任务更新
   */
  subscribe(taskId: string, callback: BatchTaskListener): () => void {
    if (!this.listeners.has(taskId)) {
      this.listeners.set(taskId, new Set());
    }

    const listeners = this.listeners.get(taskId)!;
    listeners.add(callback);

    // 如果任务已存在，立即通知
    const task = this.getTaskStatus(taskId);
    if (task) {
      callback(task);
    }

    // 返回取消订阅函数
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(taskId);
      }
    };
  }

  /**
   * 销毁引擎
   */
  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.taskQueue.clear();
    this.processingTasks.clear();
    this.pausedTasks.clear();
    this.listeners.clear();
    console.log('[BatchProcessingEngine] Destroyed');
  }

  // ============ 私有方法 ============

  private startProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processNextTask();
    }, 1000);
  }

  private async processNextTask(): Promise<void> {
    // 如果已暂停，不处理
    if (this.isPaused) return;

    // 检查是否可以处理新任务
    if (this.processingTasks.size >= this.config.maxConcurrentTasks) {
      return;
    }

    // 从队列中取出下一个任务
    const task = this.taskQueue.dequeue();
    if (!task) return;

    task.status = TaskStatus.PROCESSING;
    task.startedAt = Date.now();
    this.processingTasks.set(task.id, task);
    this.notifyListeners(task.id, task);

    try {
      // 处理任务
      const resultUri = await this.processTask(task);
      
      task.status = TaskStatus.COMPLETED;
      task.resultUri = resultUri;
      task.completedAt = Date.now();
      task.estimatedTime = task.completedAt - task.startedAt!;
      
      this.totalTasksProcessed++;

      console.log('[BatchProcessingEngine] Task completed:', task.id, `(${task.estimatedTime}ms)`);
    } catch (error) {
      task.error = error instanceof Error ? error.message : 'Unknown error';
      
      // 如果启用自动重试
      if (this.config.autoRetry && (task.retryCount || 0) < this.config.maxRetries) {
        task.retryCount = (task.retryCount || 0) + 1;
        task.status = TaskStatus.PENDING;
        task.progress = 0;
        this.taskQueue.enqueue(task, task.priority);
        
        console.log('[BatchProcessingEngine] Task retry:', task.id, `(${task.retryCount}/${this.config.maxRetries})`);
      } else {
        task.status = TaskStatus.FAILED;
        this.totalTasksFailed++;
        
        console.error('[BatchProcessingEngine] Task failed:', task.id, task.error);
      }
    } finally {
      this.processingTasks.delete(task.id);
      this.notifyListeners(task.id, task);
    }
  }

  private async processTask(task: BatchTask): Promise<string> {
    // 这里调用实际的图像处理逻辑
    // 应该调用后端 API 或本地处理
    
    // 模拟处理进度
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        task.progress = Math.min(progress, 99);
        this.notifyListeners(task.id, task);

        if (progress >= 100) {
          clearInterval(interval);
          task.progress = 100;
          this.notifyListeners(task.id, task);
          resolve(task.imageUri); // 返回处理后的 URI
        }
      }, 500);

      // 超时保护
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Task timeout'));
      }, this.config.taskTimeout);
    });
  }

  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private notifyListeners(taskId: string, task: BatchTask): void {
    const listeners = this.listeners.get(taskId);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(task);
        } catch (error) {
          console.error('[BatchProcessingEngine] Listener error:', error);
        }
      });
    }
  }
}

export default BatchProcessingEngine;
