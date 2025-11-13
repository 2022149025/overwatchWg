/**
 * 오버워치 영웅 이미지 매핑 유틸리티
 * CDN + 폴백 시스템
 */

// 영웅 이미지 매핑 (로컬 이미지 사용 - public/heroes 폴더)
// 실제 이미지는 public/heroes/ 폴더에 저장해야 합니다
const HERO_IMAGES: { [key: string]: string } = {
  // 돌격군
  '디바': '/heroes/dva.png',
  '둠피스트': '/heroes/doomfist.png',
  '정크랫퀸': '/heroes/junker-queen.png',
  '오리사': '/heroes/orisa.png',
  '라마트라': '/heroes/ramattra.png',
  '라인하르트': '/heroes/reinhardt.png',
  '로드호그': '/heroes/roadhog.png',
  '시그마': '/heroes/sigma.png',
  '윈스턴': '/heroes/winston.png',
  '레킹볼': '/heroes/wrecking-ball.png',
  '자리야': '/heroes/zarya.png',
  '마우가': '/heroes/mauga.png',
  
  // 공격군
  '애쉬': '/heroes/ashe.png',
  '바스티온': '/heroes/bastion.png',
  '캐서디': '/heroes/cassidy.png',
  '에코': '/heroes/echo.png',
  '겐지': '/heroes/genji.png',
  '한조': '/heroes/hanzo.png',
  '정크랫': '/heroes/junkrat.png',
  '메이': '/heroes/mei.png',
  '파라': '/heroes/pharah.png',
  '리퍼': '/heroes/reaper.png',
  '솔져: 76': '/heroes/soldier-76.png',
  '솜브라': '/heroes/sombra.png',
  '시메트라': '/heroes/symmetra.png',
  '토르비욘': '/heroes/torbjorn.png',
  '트레이서': '/heroes/tracer.png',
  '위도우메이커': '/heroes/widowmaker.png',
  '벤처': '/heroes/venture.png',
  
  // 지원군
  '아나': '/heroes/ana.png',
  '바티스트': '/heroes/baptiste.png',
  '브리기테': '/heroes/brigitte.png',
  '키리코': '/heroes/kiriko.png',
  '루시우': '/heroes/lucio.png',
  '메르시': '/heroes/mercy.png',
  '모이라': '/heroes/moira.png',
  '젠야타': '/heroes/zenyatta.png',
  '라이프위버': '/heroes/lifeweaver.png',
  '일리아리': '/heroes/illari.png',
  '주노': '/heroes/juno.png',
};

// 폴백 이미지 (기본 오버워치 로고)
const FALLBACK_IMAGE = 'https://logos-world.net/wp-content/uploads/2021/01/Overwatch-Logo.png';

/**
 * 영웅 이름으로 이미지 URL 가져오기
 */
export function getHeroImage(heroName: string | null | undefined): string {
  if (!heroName) return FALLBACK_IMAGE;
  
  // 한글 이름을 영어 파일명으로 변환
  const fileName = getHeroFileName(heroName);
  const imageUrl = `/heroes/${fileName}.png`;
  
  return imageUrl;
}

/**
 * 영웅 이미지가 존재하는지 확인
 */
export function hasHeroImage(heroName: string | null | undefined): boolean {
  if (!heroName) return false;
  return HERO_IMAGES[heroName] !== undefined;
}

/**
 * 모든 영웅 목록 가져오기
 */
export function getAllHeroes(): string[] {
  return Object.keys(HERO_IMAGES);
}

/**
 * 역할별 영웅 목록
 */
export const HEROES_BY_ROLE = {
  돌격: ['디바', '둠피스트', '정크랫퀸', '오리사', '라마트라', '라인하르트', '로드호그', '시그마', '윈스턴', '레킹볼', '자리야', '마우가'],
  공격: ['애쉬', '바스티온', '캐서디', '에코', '겐지', '한조', '정크랫', '메이', '파라', '리퍼', '솔져: 76', '솜브라', '시메트라', '토르비욘', '트레이서', '위도우메이커', '벤처'],
  지원: ['아나', '바티스트', '브리기테', '키리코', '루시우', '메르시', '모이라', '젠야타', '라이프위버', '일리아리', '주노']
};

/**
 * 영웅 이름 정규화 (별명 -> 정식 이름)
 */
export function normalizeHeroName(heroName: string): string {
  const aliases: { [key: string]: string } = {
    '메르시주챔': '메르시',
    '겐지장인': '겐지',
    '트레장': '트레이서',
    '솔저76': '솔져: 76',
    '솔저': '솔져: 76',
    '디바': '디바',
    '라인': '라인하르트',
    '로드': '로드호그',
    '볼': '레킹볼',
    '자리': '자리야',
    '윈': '윈스턴',
    '위도우': '위도우메이커',
    '퀸': '정크랫퀸',
  };
  
  return aliases[heroName] || heroName;
}

/**
 * 한글 영웅 이름을 영어 파일명으로 변환
 */
export function getHeroFileName(heroName: string): string {
  const nameMap: { [key: string]: string } = {
    // 돌격군
    'D.Va': 'dva',
    '디바': 'dva',
    '둠피스트': 'doomfist',
    '정커퀸': 'junker queen',
    '정크랫퀸': 'junker queen',
    '오리사': 'orisa',
    '라마트라': 'ramattra',
    '라인하르트': 'reinhardt',
    '로드호그': 'roadhog',
    '시그마': 'sigma',
    '윈스턴': 'winston',
    '레킹볼': 'wrecking ball',
    '자리야': 'zarya',
    '마우가': 'mauga',
    '해저드': 'hazard',
    
    // 공격군
    '겐지': 'genji',
    '리퍼': 'reaper',
    '메이': 'mei',
    '바스티온': 'bastion',
    '벤처': 'venture',
    '소전': 'sojourn',
    '솔저: 76': 'soldier76',
    '솔져: 76': 'soldier76',
    '솜브라': 'sombra',
    '시메트라': 'symmetra',
    '애쉬': 'ashe',
    '에코': 'echo',
    '위도우메이커': 'widowmaker',
    '정크랫': 'junkrat',
    '캐서디': 'cassidy',
    '토르비욘': 'torbjorn',
    '트레이서': 'tracer',
    '파라': 'pharah',
    '프레야': 'freja',
    '한조': 'hanzo',
    
    // 지원군
    '라이프위버': 'lifeweaver',
    '루시우': 'lucio',
    '메르시': 'mercy',
    '모이라': 'moira',
    '바티스트': 'baptiste',
    '브리기테': 'brigitte',
    '아나': 'ana',
    '우양': 'wuyang',
    '일리아리': 'illari',
    '젠야타': 'zenyatta',
    '주노': 'juno',
    '키리코': 'kiriko',
  };
  
  return nameMap[heroName] || heroName.toLowerCase();
}
