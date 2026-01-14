import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function FootprintScreen() {
  const [viewMode, setViewMode] = useState('地图');

  const footprints = [
    { id: 1, location: '北京故宫', date: '2026-01-10', photos: 28, lat: 39.9163, lng: 116.3972 },
    { id: 2, location: '杭州西湖', date: '2026-01-08', photos: 45, lat: 30.2489, lng: 120.1500 },
    { id: 3, location: '上海外滩', date: '2026-01-05', photos: 32, lat: 31.2397, lng: 121.4912 },
    { id: 4, location: '成都宽窄巷子', date: '2025-12-28', photos: 19, lat: 30.6667, lng: 104.0667 },
  ];

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>yanbao AI 足迹</Text>
      </View>

      {/* 视图切换 */}
      <View style={styles.viewSwitcher}>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === '地图' && styles.viewButtonActive]}
          onPress={() => setViewMode('地图')}
        >
          <Text style={[styles.viewButtonText, viewMode === '地图' && styles.viewButtonTextActive]}>
            🗺️ 地图
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === '列表' && styles.viewButtonActive]}
          onPress={() => setViewMode('列表')}
        >
          <Text style={[styles.viewButtonText, viewMode === '列表' && styles.viewButtonTextActive]}>
            📋 列表
          </Text>
        </TouchableOpacity>
      </View>

      {/* 地图视图 */}
      {viewMode === '地图' && (
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            {/* 绘制网格背景 */}
            <View style={styles.gridBackground}>
              {[...Array(8)].map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLine, { top: i * 50 }]} />
              ))}
              {[...Array(8)].map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLine, { left: i * 45, width: 1, height: '100%' }]} />
              ))}
            </View>

            {/* 标记点 */}
            {footprints.map((fp, index) => (
              <View
                key={fp.id}
                style={[
                  styles.mapMarker,
                  { 
                    left: 50 + index * 70, 
                    top: 100 + (index % 2) * 80 
                  }
                ]}
              >
                <View style={styles.markerDot} />
                <Text style={styles.markerLabel}>{fp.photos}</Text>
              </View>
            ))}
          </View>

          {/* 统计信息 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>城市</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>照片</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.8k</Text>
              <Text style={styles.statLabel}>公里</Text>
            </View>
          </View>
        </View>
      )}

      {/* 列表视图 */}
      {viewMode === '列表' && (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {footprints.map((fp) => (
            <TouchableOpacity key={fp.id} style={styles.footprintCard}>
              {/* 左侧日期 */}
              <View style={styles.dateContainer}>
                <Text style={styles.dateDay}>{fp.date.split('-')[2]}</Text>
                <Text style={styles.dateMonth}>{fp.date.split('-')[1]}月</Text>
              </View>

              {/* 中间信息 */}
              <View style={styles.infoContainer}>
                <Text style={styles.locationName}>{fp.location}</Text>
                <Text style={styles.photoCount}>📷 {fp.photos} 张照片</Text>
              </View>

              {/* 右侧箭头 */}
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}

          {/* 底部占位 */}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* 底部签名 */}
      <View style={styles.footer}>
        <Text style={styles.signature}>Made with 💜 by Jason Tsao who loves you the most</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  header: {
    height: 100,
    backgroundColor: '#2D1B4E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#2D1B4E',
    borderWidth: 2,
    borderColor: '#E879F9',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#E879F9',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#E879F9',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mapPlaceholder: {
    height: 400,
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#3A2B5E',
    height: 1,
    width: '100%',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E879F9',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  markerLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E879F9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footprintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    padding: 15,
    marginBottom: 12,
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: 15,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E879F9',
  },
  dateMonth: {
    fontSize: 12,
    color: '#888888',
  },
  infoContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  photoCount: {
    fontSize: 14,
    color: '#888888',
  },
  arrow: {
    fontSize: 24,
    color: '#888888',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1A0B2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signature: {
    fontSize: 10,
    color: '#E879F9',
  },
});
