/**
 * 입력 검증 유틸리티
 * SQL Injection 및 잘못된 입력 방어
 */

/**
 * UUID 형식 검증
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 디스코드 ID 형식 검증
 * 형식: username#1234 또는 새로운 형식 username
 */
export function isValidDiscordId(discordId: string): boolean {
  if (!discordId || typeof discordId !== 'string') return false;
  
  // 새로운 Discord 형식 (username만) 또는 구 형식 (username#1234)
  const newFormatRegex = /^[a-z0-9._]{2,32}$/i;
  const oldFormatRegex = /^.{2,32}#[0-9]{4}$/;
  
  return newFormatRegex.test(discordId) || oldFormatRegex.test(discordId);
}

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: '비밀번호를 입력해주세요.' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '대문자를 최소 1개 포함해야 합니다.' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '소문자를 최소 1개 포함해야 합니다.' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '숫자를 최소 1개 포함해야 합니다.' };
  }
  
  return { valid: true, message: '' };
}

/**
 * 문자열 길이 검증
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  if (!str || typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
}

/**
 * 닉네임 검증
 */
export function isValidNickname(nickname: string): boolean {
  if (!nickname || typeof nickname !== 'string') return false;
  
  // 2-20자, 한글/영문/숫자/언더스코어만 허용
  const nicknameRegex = /^[가-힣a-zA-Z0-9_]{2,20}$/;
  return nicknameRegex.test(nickname);
}

/**
 * 숫자 범위 검증
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return typeof num === 'number' && num >= min && num <= max;
}

/**
 * SQL Injection 방어를 위한 문자열 정제
 * (Supabase는 자동으로 파라미터화하지만 추가 방어층)
 */
export function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  // 위험한 SQL 키워드 제거
  const dangerous = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi;
  return str.replace(dangerous, '');
}
