/**
 * 雁宝AI - Supabase机位管理服务
 * 
 * 实现动态机位数据管理和用户贡献功能
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ShootingSpot } from './shooting-spots-service';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kbsezvxaydmalzfirhdn.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA';

/**
 * Supabase客户端实例
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 机位数据库表结构
 */
export interface SpotRecord {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  filter_preset_id: string;
  sample_image_url: string;
  tags: string[];
  rating: number;
  visit_count: number;
  recommended_params: any;
  created_at: string;
  updated_at: string;
  created_by?: string; // 用户贡献的机位
  is_verified: boolean; // 是否经过官方验证
}

/**
 * Supabase机位服务
 */
export class SupabaseSpotsService {
  /**
   * 从Supabase获取所有机位
   */
  static async getAllSpots(): Promise<ShootingSpot[]> {
    try {
      const { data, error } = await supabase
        .from('shooting_spots')
        .select('*')
        .eq('is_verified', true)
        .order('rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching spots from Supabase:', error);
        return [];
      }
      
      return this.transformRecordsToSpots(data || []);
    } catch (error) {
      console.error('Exception fetching spots:', error);
      return [];
    }
  }
  
  /**
   * 根据城市获取机位
   */
  static async getSpotsByCity(city: string): Promise<ShootingSpot[]> {
    try {
      const { data, error } = await supabase
        .from('shooting_spots')
        .select('*')
        .eq('city', city)
        .eq('is_verified', true)
        .order('rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching spots by city:', error);
        return [];
      }
      
      return this.transformRecordsToSpots(data || []);
    } catch (error) {
      console.error('Exception fetching spots by city:', error);
      return [];
    }
  }
  
  /**
   * 根据位置获取附近机位
   */
  static async getNearbySpots(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<ShootingSpot[]> {
    try {
      // 使用Supabase的PostGIS扩展进行地理位置查询
      // 注意：需要在Supabase中启用PostGIS扩展并创建相应的地理索引
      
      const { data, error } = await supabase
        .rpc('nearby_spots', {
          lat: latitude,
          long: longitude,
          radius_km: radiusKm,
        });
      
      if (error) {
        console.error('Error fetching nearby spots:', error);
        // 降级到客户端计算
        return this.getNearbySpotsFallback(latitude, longitude, radiusKm);
      }
      
      return this.transformRecordsToSpots(data || []);
    } catch (error) {
      console.error('Exception fetching nearby spots:', error);
      return this.getNearbySpotsFallback(latitude, longitude, radiusKm);
    }
  }
  
  /**
   * 降级方案：客户端计算附近机位
   */
  private static async getNearbySpotsFallback(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<ShootingSpot[]> {
    const allSpots = await this.getAllSpots();
    
    return allSpots.filter(spot => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= radiusKm;
    });
  }
  
  /**
   * 用户贡献新机位
   */
  static async contributeSpot(
    spot: Omit<ShootingSpot, 'id' | 'rating' | 'visitCount'>,
    userId: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const record: Partial<SpotRecord> = {
        name: spot.name,
        description: spot.description,
        latitude: spot.latitude,
        longitude: spot.longitude,
        city: this.getCityFromCoordinates(spot.latitude, spot.longitude),
        filter_preset_id: spot.filterPresetId || '1',
        sample_image_url: spot.sampleImageUrl || '',
        tags: spot.tags || [],
        rating: 0,
        visit_count: 0,
        recommended_params: spot.recommendedParams || {},
        created_by: userId,
        is_verified: false, // 需要官方审核
      };
      
      const { data, error } = await supabase
        .from('shooting_spots')
        .insert([record])
        .select();
      
      if (error) {
        console.error('Error contributing spot:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, id: data[0]?.id };
    } catch (error: any) {
      console.error('Exception contributing spot:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 更新机位访问次数
   */
  static async incrementVisitCount(spotId: string): Promise<void> {
    try {
      await supabase.rpc('increment_spot_visit_count', { spot_id: spotId });
    } catch (error) {
      console.error('Error incrementing visit count:', error);
    }
  }
  
  /**
   * 更新机位评分
   */
  static async updateRating(spotId: string, rating: number): Promise<void> {
    try {
      // 这里应该实现一个加权平均算法
      // 简化版：直接更新评分
      await supabase
        .from('shooting_spots')
        .update({ rating })
        .eq('id', spotId);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  }
  
  /**
   * 转换数据库记录为应用模型
   */
  private static transformRecordsToSpots(records: SpotRecord[]): ShootingSpot[] {
    return records.map(record => ({
      id: record.id,
      name: record.name,
      description: record.description,
      latitude: record.latitude,
      longitude: record.longitude,
      filterPresetId: record.filter_preset_id,
      sampleImageUrl: record.sample_image_url,
      tags: record.tags,
      rating: record.rating,
      visitCount: record.visit_count,
      recommendedParams: record.recommended_params,
    }));
  }
  
  /**
   * 根据坐标识别城市
   */
  private static getCityFromCoordinates(latitude: number, longitude: number): string {
    // 北京
    if (latitude >= 39.4 && latitude <= 41.6 && longitude >= 115.7 && longitude <= 117.4) {
      return '北京';
    }
    // 杭州
    if (latitude >= 29.2 && latitude <= 30.6 && longitude >= 118.2 && longitude <= 120.9) {
      return '杭州';
    }
    // 上海
    if (latitude >= 30.7 && latitude <= 31.5 && longitude >= 120.9 && longitude <= 122.0) {
      return '上海';
    }
    return '其他';
  }
  
  /**
   * 计算两点之间的距离（公里）
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // 地球半径（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

/**
 * Supabase数据库初始化脚本
 * 
 * 在Supabase SQL编辑器中执行以下SQL创建表和函数：
 * 
 * ```sql
 * -- 创建机位表
 * CREATE TABLE shooting_spots (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   latitude DOUBLE PRECISION NOT NULL,
 *   longitude DOUBLE PRECISION NOT NULL,
 *   city TEXT NOT NULL,
 *   filter_preset_id TEXT,
 *   sample_image_url TEXT,
 *   tags TEXT[],
 *   rating DOUBLE PRECISION DEFAULT 0,
 *   visit_count INTEGER DEFAULT 0,
 *   recommended_params JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   created_by UUID REFERENCES auth.users(id),
 *   is_verified BOOLEAN DEFAULT FALSE
 * );
 * 
 * -- 创建地理位置索引（需要PostGIS扩展）
 * CREATE EXTENSION IF NOT EXISTS postgis;
 * ALTER TABLE shooting_spots ADD COLUMN location GEOGRAPHY(POINT, 4326);
 * UPDATE shooting_spots SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
 * CREATE INDEX shooting_spots_location_idx ON shooting_spots USING GIST (location);
 * 
 * -- 创建附近机位查询函数
 * CREATE OR REPLACE FUNCTION nearby_spots(lat DOUBLE PRECISION, long DOUBLE PRECISION, radius_km DOUBLE PRECISION)
 * RETURNS SETOF shooting_spots AS $$
 * BEGIN
 *   RETURN QUERY
 *   SELECT *
 *   FROM shooting_spots
 *   WHERE ST_DWithin(
 *     location,
 *     ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
 *     radius_km * 1000
 *   )
 *   AND is_verified = TRUE
 *   ORDER BY rating DESC;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * -- 创建访问次数增加函数
 * CREATE OR REPLACE FUNCTION increment_spot_visit_count(spot_id UUID)
 * RETURNS VOID AS $$
 * BEGIN
 *   UPDATE shooting_spots
 *   SET visit_count = visit_count + 1,
 *       updated_at = NOW()
 *   WHERE id = spot_id;
 * END;
 * $$ LANGUAGE plpgsql;
 * ```
 */
