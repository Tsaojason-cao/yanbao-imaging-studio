-- 第一阶段：AI 消除 - 数据库迁移脚本
-- 创建 edit_tasks 表用于追踪所有 AI 处理任务
-- 
-- 功能：
-- - 追踪 AI 消除、视频美颜、批量处理、姿势引导、AI 扩图等任务
-- - 记录任务状态、进度、结果
-- - 支持用户历史记录查询
--
-- 作者：Manus AI
-- 日期：2025-01-13

-- 创建 edit_tasks 表
CREATE TABLE IF NOT EXISTS edit_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 任务基本信息
  task_type VARCHAR(50) NOT NULL, -- 'inpaint', 'expand', 'beautify', 'batch', 'pose'
  status VARCHAR(50) NOT NULL DEFAULT 'queued', -- 'queued', 'validating', 'preprocessing', 'processing', 'postprocessing', 'completed', 'failed', 'cancelled'
  progress INT DEFAULT 0, -- 0-100
  
  -- 输入文件
  original_image_url TEXT NOT NULL, -- 原始图片 URL
  mask_image_url TEXT, -- 掩码图片 URL（仅用于 inpaint）
  
  -- 输出文件
  result_image_url TEXT, -- 处理结果 URL
  
  -- 元数据
  image_size JSONB, -- { "width": 1920, "height": 1080 }
  processing_params JSONB, -- 处理参数，如 refinement_steps, quality 等
  
  -- 性能指标
  processing_time_ms INT, -- 处理耗时（毫秒）
  worker_id INT, -- 处理该任务的 worker ID
  
  -- 错误信息
  error_message TEXT,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- 索引
  CONSTRAINT valid_task_type CHECK (task_type IN ('inpaint', 'expand', 'beautify', 'batch', 'pose')),
  CONSTRAINT valid_status CHECK (status IN ('queued', 'validating', 'preprocessing', 'processing', 'postprocessing', 'completed', 'failed', 'cancelled')),
  CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100)
);

-- 创建索引以加快查询
CREATE INDEX IF NOT EXISTS idx_edit_tasks_user_id ON edit_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_edit_tasks_status ON edit_tasks(status);
CREATE INDEX IF NOT EXISTS idx_edit_tasks_task_type ON edit_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_edit_tasks_created_at ON edit_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edit_tasks_user_created ON edit_tasks(user_id, created_at DESC);

-- 创建视图：用户的最近任务
CREATE OR REPLACE VIEW user_recent_tasks AS
SELECT 
  id,
  user_id,
  task_type,
  status,
  progress,
  result_image_url,
  processing_time_ms,
  created_at,
  completed_at
FROM edit_tasks
WHERE status = 'completed'
ORDER BY completed_at DESC;

-- 创建视图：任务统计
CREATE OR REPLACE VIEW task_statistics AS
SELECT 
  user_id,
  task_type,
  status,
  COUNT(*) as count,
  AVG(processing_time_ms) as avg_processing_time_ms,
  MAX(processing_time_ms) as max_processing_time_ms,
  MIN(processing_time_ms) as min_processing_time_ms
FROM edit_tasks
GROUP BY user_id, task_type, status;

-- 创建触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_edit_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_edit_tasks_updated_at
BEFORE UPDATE ON edit_tasks
FOR EACH ROW
EXECUTE FUNCTION update_edit_tasks_updated_at();

-- 启用行级安全 (RLS)
ALTER TABLE edit_tasks ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看自己的任务
CREATE POLICY "Users can view their own tasks"
  ON edit_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- 创建 RLS 策略：用户只能插入自己的任务
CREATE POLICY "Users can insert their own tasks"
  ON edit_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建 RLS 策略：用户只能更新自己的任务
CREATE POLICY "Users can update their own tasks"
  ON edit_tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 创建 RLS 策略：用户只能删除自己的任务
CREATE POLICY "Users can delete their own tasks"
  ON edit_tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建存储桶用于存储处理结果
INSERT INTO storage.buckets (id, name, public)
VALUES ('edit-results', 'edit-results', true)
ON CONFLICT DO NOTHING;

-- 创建存储桶策略：允许认证用户上传
CREATE POLICY "Allow authenticated users to upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'edit-results' 
    AND auth.role() = 'authenticated'
  );

-- 创建存储桶策略：允许公开读取
CREATE POLICY "Allow public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'edit-results');
