/**
 * 统一进度显示系统
 * 
 * 功能：
 * - 所有 AI 处理环节添加进度百分比
 * - 显示预计完成时间（ETA）
 * - 实时更新进度信息
 * 
 * 作者：Manus AI
 * 日期：2026-01-13
 */

export interface ProgressInfo {
  taskId: string;
  stage: string;              // 处理阶段（预处理、处理中、后处理）
  progress: number;           // 进度百分比（0-100）
  eta: number;                // 预计完成时间（秒）
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message: string;            // 进度消息
  startTime: number;          // 开始时间戳
  elapsedTime: number;        // 已用时间（秒）
  speed?: number;             // 处理速度（%/s）
}

export type ProgressListener = (progress: ProgressInfo) => void;

export class ProgressDisplaySystem {
  private tasks: Map<string, ProgressInfo> = new Map();
  private listeners: Map<string, Set<ProgressListener>> = new Map();

  /**
   * 创建新的进度任务
   */
  createTask(taskId: string, stage: string = '初始化'): ProgressInfo {
    const task: ProgressInfo = {
      taskId,
      stage,
      progress: 0,
      eta: 0,
      status: 'queued',
      message: '等待处理中...',
      startTime: Date.now(),
      elapsedTime: 0,
      speed: 0
    };

    this.tasks.set(taskId, task);
    this.notifyListeners(taskId, task);

    return task;
  }

  /**
   * 更新进度
   */
  updateProgress(
    taskId: string,
    progress: number,
    stage?: string,
    message?: string
  ): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const previousProgress = task.progress;
    task.progress = Math.min(Math.max(progress, 0), 100);
    task.elapsedTime = (Date.now() - task.startTime) / 1000;

    if (stage) task.stage = stage;
    if (message) task.message = message;

    // 计算处理速度（%/s）
    if (task.elapsedTime > 0) {
      task.speed = task.progress / task.elapsedTime;
    }

    // 计算 ETA
    if (task.progress > 0 && task.progress < 100) {
      if (task.speed && task.speed > 0) {
        const remainingProgress = 100 - task.progress;
        task.eta = Math.ceil(remainingProgress / task.speed);
      }
    } else if (task.progress === 100) {
      task.eta = 0;
    }

    // 更新状态
    if (task.progress === 100) {
      task.status = 'completed';
      task.message = '处理完成！';
    } else if (task.progress > 0) {
      task.status = 'processing';
    }

    this.notifyListeners(taskId, task);
  }

  /**
   * 标记任务完成
   */
  completeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.progress = 100;
    task.status = 'completed';
    task.message = '处理完成！';
    task.eta = 0;
    task.elapsedTime = (Date.now() - task.startTime) / 1000;

    this.notifyListeners(taskId, task);
  }

  /**
   * 标记任务失败
   */
  failTask(taskId: string, error: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = 'failed';
    task.message = `处理失败：${error}`;
    task.elapsedTime = (Date.now() - task.startTime) / 1000;

    this.notifyListeners(taskId, task);
  }

  /**
   * 获取进度信息
   */
  getProgress(taskId: string): ProgressInfo | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * 订阅进度更新
   */
  subscribe(taskId: string, callback: ProgressListener): () => void {
    if (!this.listeners.has(taskId)) {
      this.listeners.set(taskId, new Set());
    }

    const listeners = this.listeners.get(taskId)!;
    listeners.add(callback);

    // 如果任务已存在，立即通知
    const task = this.tasks.get(taskId);
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
   * 获取进度显示文本
   */
  getProgressText(taskId: string): string {
    const task = this.tasks.get(taskId);
    if (!task) return '';

    const progressBar = this.renderProgressBar(task.progress);
    const etaText = task.eta > 0 ? `，剩余 ${task.eta}s` : '';
    const speedText = task.speed ? `，速度 ${task.speed.toFixed(1)}%/s` : '';

    return `${progressBar} ${task.progress}%${etaText}${speedText}\n${task.message}`;
  }

  /**
   * 获取简洁进度文本
   */
  getSimpleProgressText(taskId: string): string {
    const task = this.tasks.get(taskId);
    if (!task) return '';

    const etaText = task.eta > 0 ? ` (${task.eta}s)` : '';
    return `${task.progress}%${etaText} - ${task.message}`;
  }

  /**
   * 渲染进度条
   */
  private renderProgressBar(progress: number, width: number = 20): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  /**
   * 清除任务
   */
  clearTask(taskId: string): void {
    this.tasks.delete(taskId);
    this.listeners.delete(taskId);
  }

  /**
   * 清除所有任务
   */
  clearAll(): void {
    this.tasks.clear();
    this.listeners.clear();
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): ProgressInfo[] {
    return Array.from(this.tasks.values());
  }

  // ============ 私有方法 ============

  private notifyListeners(taskId: string, task: ProgressInfo): void {
    const listeners = this.listeners.get(taskId);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(task);
        } catch (error) {
          console.error('[ProgressDisplaySystem] Listener error:', error);
        }
      });
    }
  }
}

export default ProgressDisplaySystem;
