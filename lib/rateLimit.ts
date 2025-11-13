/**
 * Rate Limiting 유틸리티
 * API 호출 제한으로 DoS 공격 및 비용 폭탄 방지
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // 주기적으로 만료된 항목 정리
    setInterval(() => this.cleanup(), windowMs);
  }

  /**
   * Rate limit 체크
   * @param key 고유 식별자 (userId 등)
   * @returns 허용 여부
   */
  check(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // 새로운 윈도우 시작
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      // 제한 초과
      return false;
    }

    // 카운트 증가
    entry.count++;
    return true;
  }

  /**
   * 남은 요청 수 확인
   */
  getRemaining(key: string): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * 리셋 시간 확인 (밀리초)
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * 만료된 항목 정리
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * 특정 키 초기화
   */
  reset(key: string): void {
    this.limits.delete(key);
  }
}

// Rate Limiter 인스턴스들
export const matchingRateLimiter = new RateLimiter(5, 60000); // 1분에 5회
export const geminiRateLimiter = new RateLimiter(10, 60000); // 1분에 10회
export const notificationRateLimiter = new RateLimiter(20, 60000); // 1분에 20회

/**
 * Rate limit 체크 헬퍼 함수
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string,
  errorMessage: string = 'Too many requests. Please try again later.'
): void {
  if (!limiter.check(key)) {
    const resetTime = Math.ceil(limiter.getResetTime(key) / 1000);
    throw new Error(`${errorMessage} (Reset in ${resetTime}s)`);
  }
}
