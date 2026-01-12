/**
 * 雁宝AI - 生产环境日志工具
 * 
 * 在开发环境下输出日志，在生产环境下静默
 */

const isDevelopment = __DEV__;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // 错误日志在生产环境下也输出，便于调试
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

// 默认导出
export default logger;
