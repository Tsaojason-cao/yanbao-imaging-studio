import { Redirect } from "expo-router";

// 重定向到主界面
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
