-- Database_Schema_SQLite.sql
-- YanBao AI Pro 数据库结构定义

-- 1. 照片元数据表 (photo_metadata)
-- 存储每张照片的拍摄信息、位置信息和核心参数
CREATE TABLE IF NOT EXISTS photo_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_uri TEXT NOT NULL, -- 照片在本地的存储路径
    capture_time DATETIME DEFAULT CURRENT_TIMESTAMP, -- 拍摄时间
    location_lat REAL, -- 拍摄地点纬度
    location_lon REAL, -- 拍摄地点经度
    lbs_spot_id INTEGER, -- 关联的 LBS 推荐点 ID
    
    -- 核心：存储 22 维美颜和影调参数的 JSON 字符串
    -- SQLite 推荐使用 TEXT 类型存储 JSON
    shooting_params TEXT NOT NULL, 
    
    is_edited BOOLEAN DEFAULT 0, -- 是否被编辑过
    last_edit_time DATETIME -- 最后编辑时间
);

-- 2. 雁宝记忆表 (yanbao_memories)
-- 存储用户自定义的预设或常用的参数组合 (即“记忆”)
CREATE TABLE IF NOT EXISTS yanbao_memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_name TEXT NOT NULL UNIQUE, -- 记忆名称 (如：我的最爱人像)
    
    -- 核心：存储 22 维美颜和影调参数的 JSON 字符串
    params_json TEXT NOT NULL, 
    
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. LBS 推荐点表 (lbs_spots)
-- 存储 12 个硬编码的摄影点信息
CREATE TABLE IF NOT EXISTS lbs_spots (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    lat REAL NOT NULL,
    lon REAL NOT NULL
);

-- 插入 12 个硬编码的 LBS 推荐点 (示例)
INSERT OR IGNORE INTO lbs_spots (id, name, description, lat, lon) VALUES
(1, '故宫角楼', '日落时分的金色光芒', 39.9298, 116.3970),
(2, '北海公园', '白塔与湖水的倒影', 39.9388, 116.3883),
(3, '三里屯太古里', '都市街拍与时尚人像', 39.9348, 116.4542),
(4, '798艺术区', '工业风与当代艺术', 39.9839, 116.4800),
(5, '国贸三期', '城市天际线与夜景', 39.9075, 116.4660),
(6, '颐和园十七孔桥', '古典园林与长廊', 39.9990, 116.2730),
(7, '天坛公园', '庄严肃穆的建筑群', 39.8822, 116.4074),
(8, '南锣鼓巷', '老北京胡同文化', 39.9410, 116.3970),
(9, '奥林匹克森林公园', '自然风光与运动人像', 40.0120, 116.3870),
(10, '清华大学', '百年学府与建筑', 40.0000, 116.3300),
(11, '中央电视塔', '城市全景与日出', 39.9130, 116.3120),
(12, '后海酒吧街', '夜色与水面光影', 39.9480, 116.3880);
