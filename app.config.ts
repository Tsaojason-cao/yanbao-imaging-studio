// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID format: space.manus.<project_name_dots>.<timestamp>
// e.g., "my-app" created at 2024-01-15 10:30:45 -> "space.manus.my.app.t20240115103045"
const bundleId = "space.manus.yanbao.eas.build.t20260111214759";
// Extract timestamp from bundle ID and prefix with "manus" for deep link scheme
// e.g., "space.manus.my.app.t20240115103045" -> "manus20240115103045"
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "雁宝 AI 私人影像工作室",
  appSlug: "yanbao-eas-build",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663274614970/gCwuwVaDqRzMMjMA.png",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "2.2.0-final",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "009c619b-efd9-4ad3-b2f7-661fe9b76b58",
    },
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "READ_MEDIA_IMAGES",
      "READ_MEDIA_VIDEO",
      "VIBRATE",
      "INTERNET",
      "ACCESS_NETWORK_STATE",
      "POST_NOTIFICATIONS",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "./plugins/withYanbaoBeauty",
    "expo-asset",
    "expo-router",
    [
      "expo-camera",
      {
        cameraPermission: "雁宝AI需要相机权限，帮你记录每一个美好的瞬间📸",
        microphonePermission: "雁宝AI需要麦克风权限，让你的视频更加生动🎥",
        recordAudioAndroid: true
      }
    ],
    [
      "expo-media-library",
      {
        photosPermission: "雁宝AI需要相册权限，守护你们的美好回忆📚",
        savePhotosPermission: "雁宝AI需要保存权限，珍藏每一张精心修图的作品✨",
        isAccessMediaLocationEnabled: true
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "雁宝AI需要位置权限，带你发现身边的美好机位📍",
        locationAlwaysPermission: "雁宝AI需要位置权限，带你发现身边的美好机位📍",
        locationWhenInUsePermission: "雁宝AI需要位置权限，带你发现身边的美好机位📍"
      }
    ],
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          // Ultimate Edition: 启用R8深度混淆
          usesCleartextTraffic: false, // 禁止明文HTTP流量，提高安全性
          minSdkVersion: 24, // Android 7.0+
          targetSdkVersion: 34, // Android 14 (修复 SDK 35 兼容性问题)
          compileSdkVersion: 34,
        },
      },
    ]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
