/**
 * 안전한 로깅 유틸리티
 * 프로덕션 환경에서 민감한 정보 노출 방지
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * 민감한 정보 마스킹
 */
function maskSensitiveData(data: any): any {
  if (typeof data === 'string') {
    // 이메일 마스킹
    data = data.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '***@$2');
    // API 키 마스킹
    data = data.replace(/([A-Za-z0-9]{8})[A-Za-z0-9]{16,}/g, '$1***');
    // UUID 마스킹 (일부만)
    data = data.replace(/([0-9a-f]{8})-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '$1-****');
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked: any = Array.isArray(data) ? [] : {};
    for (const key in data) {
      // 민감한 필드 마스킹
      if (['password', 'token', 'apiKey', 'secret', 'discord_id'].includes(key)) {
        masked[key] = '***';
      } else {
        masked[key] = maskSensitiveData(data[key]);
      }
    }
    return masked;
  }
  
  return data;
}

/**
 * 개발 환경 로그
 */
export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    } else {
      // 프로덕션에서는 마스킹된 정보만
      console.info('[INFO]', ...args.map(maskSensitiveData));
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    } else {
      console.warn('[WARN]', ...args.map(maskSensitiveData));
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error('[ERROR]', ...args);
    } else {
      // 프로덕션에서는 에러 메시지만, 스택 트레이스는 제외
      const safeArgs = args.map(arg => {
        if (arg instanceof Error) {
          return {
            message: arg.message,
            name: arg.name,
          };
        }
        return maskSensitiveData(arg);
      });
      console.error('[ERROR]', ...safeArgs);
    }
  },
};

/**
 * 성능 측정
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  if (!isDevelopment) {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.then(value => {
      const end = performance.now();
      logger.debug(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
      return value;
    });
  }
  
  const end = performance.now();
  logger.debug(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}
