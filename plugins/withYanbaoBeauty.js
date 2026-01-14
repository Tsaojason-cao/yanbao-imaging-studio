/**
 * Expo Config Plugin for yanbao AI Beauty Module
 * 
 * 集成 iOS 和 Android 原生美颜模块到 Expo 项目
 * 
 * @author Jason Tsao
 * @version 2.2.0
 * @since 2026-01-14
 */

const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * 复制 iOS 原生模块文件
 */
const withYanbaoBeautyIOS = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosProjectPath = path.join(config.modRequest.platformProjectRoot);
      
      // 源文件路径
      const sourceDir = path.join(projectRoot, 'ios', 'YanbaoBeauty');
      
      // 目标路径
      const targetDir = path.join(iosProjectPath, 'YanbaoBeauty');
      
      // 创建目标目录
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 复制所有文件
      if (fs.existsSync(sourceDir)) {
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
          const sourcePath = path.join(sourceDir, file);
          const targetPath = path.join(targetDir, file);
          
          if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✅ Copied iOS file: ${file}`);
          }
        });
      }
      
      console.log('✅ iOS YanbaoBeauty module files copied');
      
      return config;
    },
  ]);
};

/**
 * 复制 Android 原生模块文件
 */
const withYanbaoBeautyAndroid = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidProjectPath = config.modRequest.platformProjectRoot;
      
      // 源文件路径
      const sourceDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'java',
        'com',
        'yanbaoai',
        'beauty'
      );
      
      // 目标路径
      const targetDir = path.join(
        androidProjectPath,
        'app',
        'src',
        'main',
        'java',
        'com',
        'yanbaoai',
        'beauty'
      );
      
      // 创建目标目录
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 复制所有文件
      if (fs.existsSync(sourceDir)) {
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
          const sourcePath = path.join(sourceDir, file);
          const targetPath = path.join(targetDir, file);
          
          if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✅ Copied Android file: ${file}`);
          }
        });
      }
      
      // 更新 MainApplication.java 以注册模块
      const mainApplicationPath = path.join(
        androidProjectPath,
        'app',
        'src',
        'main',
        'java',
        'com',
        'yanbaoai',
        'MainApplication.java'
      );
      
      if (fs.existsSync(mainApplicationPath)) {
        let content = fs.readFileSync(mainApplicationPath, 'utf8');
        
        // 添加导入
        if (!content.includes('import com.yanbaoai.beauty.YanbaoBeautyPackage;')) {
          content = content.replace(
            'import com.facebook.react.ReactApplication;',
            'import com.facebook.react.ReactApplication;\nimport com.yanbaoai.beauty.YanbaoBeautyPackage;'
          );
        }
        
        // 添加包注册
        if (!content.includes('new YanbaoBeautyPackage()')) {
          content = content.replace(
            'return packages;',
            '  packages.add(new YanbaoBeautyPackage());\n        return packages;'
          );
        }
        
        fs.writeFileSync(mainApplicationPath, content);
        console.log('✅ Updated MainApplication.java');
      }
      
      // 更新 build.gradle 添加 RenderScript 支持
      const buildGradlePath = path.join(
        androidProjectPath,
        'app',
        'build.gradle'
      );
      
      if (fs.existsSync(buildGradlePath)) {
        let content = fs.readFileSync(buildGradlePath, 'utf8');
        
        // 添加 RenderScript 支持
        if (!content.includes('renderscriptTargetApi')) {
          content = content.replace(
            'defaultConfig {',
            'defaultConfig {\n        renderscriptTargetApi 21\n        renderscriptSupportModeEnabled true'
          );
        }
        
        fs.writeFileSync(buildGradlePath, content);
        console.log('✅ Updated build.gradle with RenderScript support');
      }
      
      console.log('✅ Android YanbaoBeauty module files copied and configured');
      
      return config;
    },
  ]);
};

/**
 * 主插件函数
 */
const withYanbaoBeauty = (config) => {
  return withPlugins(config, [
    withYanbaoBeautyIOS,
    withYanbaoBeautyAndroid,
  ]);
};

module.exports = withYanbaoBeauty;
