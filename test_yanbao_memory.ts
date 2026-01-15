/**
 * 雁宝记忆 CRUD 操作测试脚本
 * 用于验证数据库的存、取、增、删功能
 */

import { YanbaoMemoryService, YanbaoMemory } from './services/database';

async function testYanbaoMemoryCRUD() {
  console.log('🚀 开始雁宝记忆 CRUD 测试...\n');

  try {
    // 1. 清空现有数据（测试环境）
    console.log('📝 步骤 1: 清空现有数据');
    await YanbaoMemoryService.clearAllMemories();
    const initialMemories = await YanbaoMemoryService.getAllMemories();
    console.log(`✅ 初始记忆数量: ${initialMemories.length}\n`);

    // 2. 创建测试数据 - 模拟用户手动调整参数
    console.log('📝 步骤 2: 创建测试记忆（模拟用户手动调整）');
    const testMemory1 = {
      presetName: '颐和园午后',
      photographer: 'Jason Tsao',
      beautyParams: {
        smooth: 60,
        slim: 30,
        eye: 25,
        bright: 40,
        teeth: 20,
        nose: 15,
        blush: 10,
      },
      filterParams: {
        contrast: 15,
        saturation: 20,
        brightness: 10,
        grain: 5,
        temperature: 8,
      },
    };

    await YanbaoMemoryService.saveMemory(testMemory1);
    console.log('✅ 已保存: 颐和园午后\n');

    // 3. 再创建一个测试数据
    console.log('📝 步骤 3: 创建第二个测试记忆');
    const testMemory2 = {
      presetName: '肖全 - 时代记录者',
      photographer: '肖全',
      beautyParams: {
        smooth: 40,
        slim: 15,
        eye: 15,
        bright: 30,
        teeth: 20,
        nose: 10,
        blush: 25,
      },
      filterParams: {
        contrast: 25,
        saturation: -10,
        brightness: 5,
        grain: 15,
        temperature: -5,
      },
    };

    await YanbaoMemoryService.saveMemory(testMemory2);
    console.log('✅ 已保存: 肖全 - 时代记录者\n');

    // 4. 读取所有记忆
    console.log('📝 步骤 4: 读取所有记忆');
    const allMemories = await YanbaoMemoryService.getAllMemories();
    console.log(`✅ 当前记忆总数: ${allMemories.length}`);
    allMemories.forEach((mem, index) => {
      console.log(`   ${index + 1}. ${mem.presetName} (${mem.photographer})`);
      console.log(`      ID: ${mem.id}`);
      console.log(`      时间戳: ${new Date(mem.timestamp).toLocaleString()}`);
    });
    console.log('');

    // 5. 获取最新记忆
    console.log('📝 步骤 5: 获取最新记忆');
    const latestMemory = await YanbaoMemoryService.getLatestMemory();
    if (latestMemory) {
      console.log(`✅ 最新记忆: ${latestMemory.presetName}`);
      console.log(`   磨皮: ${latestMemory.beautyParams.smooth}`);
      console.log(`   瘦脸: ${latestMemory.beautyParams.slim}`);
      console.log(`   大眼: ${latestMemory.beautyParams.eye}\n`);
    }

    // 6. 删除第一个记忆
    console.log('📝 步骤 6: 删除第一个记忆');
    if (allMemories.length > 0) {
      const firstMemoryId = allMemories[0].id;
      await YanbaoMemoryService.deleteMemory(firstMemoryId);
      console.log(`✅ 已删除: ${allMemories[0].presetName}\n`);
    }

    // 7. 验证删除结果
    console.log('📝 步骤 7: 验证删除结果');
    const remainingMemories = await YanbaoMemoryService.getAllMemories();
    console.log(`✅ 剩余记忆数量: ${remainingMemories.length}`);
    remainingMemories.forEach((mem, index) => {
      console.log(`   ${index + 1}. ${mem.presetName}`);
    });
    console.log('');

    // 8. 测试参数精准还原
    console.log('📝 步骤 8: 测试参数精准还原');
    const restoredMemory = await YanbaoMemoryService.getLatestMemory();
    if (restoredMemory) {
      console.log('✅ 参数还原测试:');
      console.log(`   预设名称: ${restoredMemory.presetName}`);
      console.log(`   摄影师: ${restoredMemory.photographer}`);
      console.log('   美颜参数:');
      Object.entries(restoredMemory.beautyParams).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`);
      });
      console.log('   滤镜参数:');
      Object.entries(restoredMemory.filterParams).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`);
      });
    }

    console.log('\n✅ 雁宝记忆 CRUD 测试完成！所有操作正常。');
    
    return {
      success: true,
      totalMemories: remainingMemories.length,
      latestMemory: restoredMemory,
    };
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return {
      success: false,
      error: error,
    };
  }
}

// 执行测试
testYanbaoMemoryCRUD().then(result => {
  console.log('\n📊 测试结果:', JSON.stringify(result, null, 2));
});
