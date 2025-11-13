export enum MbtiDimension {
  EI = 'EI',
  NS = 'NS',
  TF = 'TF',
  JP = 'JP',
}

export enum MbtiLetter {
  E = 'E',
  I = 'I',
  N = 'N',
  S = 'S',
  T = 'T',
  F = 'F',
  J = 'J',
  P = 'P',
}

export type MbtiScore = {
  [MbtiDimension.EI]: { E: number; I: number };
  [MbtiDimension.NS]: { N: number; S: number };
  [MbtiDimension.TF]: { T: number; F: number };
  [MbtiDimension.JP]: { J: number; P: number };
};

export interface Question {
  id: string;
  text: string;
  options: { text: string; value: MbtiLetter }[];
  dimension: MbtiDimension;
}

export interface HeroRefinementQuestion {
  id: string;
  text: string;
  options: { text: string; nextHeroes: OverwatchHero[] }[];
}

export type MbtiType = `${MbtiLetter}${MbtiLetter}${MbtiLetter}${MbtiLetter}`;

export type OverwatchHero = string; // Using string for hero names

export enum OverwatchRole {
  TANK = '돌격',
  DAMAGE = '공격',
  SUPPORT = '지원',
  ALLROUNDER = '올라운더',
  NONE = '플레이하지 않는다'
}

export enum Tier {
  BRONZE = '브론즈',
  SILVER = '실버',
  GOLD = '골드',
  PLATINUM = '플래티넘',
  DIAMOND = '다이아몬드',
  MASTER = '마스터',
  GRANDMASTER = '그랜드마스터',
  CHALLENGER = '챌린저',
}

export enum Division {
  FIVE = '5',
  FOUR = '4',
  THREE = '3',
  TWO = '2',
  ONE = '1',
}

export type FullTier = `${Tier}${Division}`;

export enum GameMode {
  QUICK_PLAY = '빠른대전',
  COMPETITIVE = '경쟁전',
  FLEX_COMPETITIVE = '자유경쟁전',
  ARCADE = '아케이드',
  CUSTOM_GAME = '사설방',
  DEATHMATCH = '데스매치',
  ONE_VS_ONE = '1vs1',
  SCRIM = '스크림',
}

export enum DayOfWeek {
  MON = '월',
  TUE = '화',
  WED = '수',
  THU = '목',
  FRI = '금',
  SAT = '토',
  SUN = '일',
}

export enum TeammateCommunicationStyle {
  TALKATIVE = '계속 팀보로 브리핑하고 수다 떠는 팀원',
  CHAT_ONLY = '채팅만 치는 팀원',
  QUIET = '아무 말 없이 조용히 게임만 하는 팀원',
  ANY = '아무나 상관 없다.',
}

export enum SelfCommunicationStyle {
  TALKATIVE_BRIEFING = '계속 팀보로 브리핑하는 플레이어',
  CHAT_ONLY = '채팅만 치는 플레이어',
  QUIET_PLAY = '아무 말 없이 조용히 게임만 하는 플레이어',
}

export enum TeammatePreferenceType {
  SKILL_OVER_TEMPER = '실력이 좋지만 화와 짜증을 많이 내는 팀원',
  MANNERS_OVER_SKILL = '실력은 부족해도 말을 예쁘게 하고 사기를 북돋아주는 팀원',
  CASUAL = '극단의 즐겜러(라인하르트, 정크랫 선호)',
  ANY = '아무나 상관 없다.',
}

export interface PersonaTestResult {
  mbti: MbtiType;
  hero: OverwatchHero;
  mainRole: OverwatchRole;
  preferredTanks: OverwatchHero[];
  preferredDamage: OverwatchHero[];
  preferredSupports: OverwatchHero[];
  maxTiers: {
    [OverwatchRole.TANK]?: FullTier;
    [OverwatchRole.DAMAGE]?: FullTier;
    [OverwatchRole.SUPPORT]?: FullTier;
  };
  preferredTeammateCommunication: TeammateCommunicationStyle;
  selfCommunicationStyle: SelfCommunicationStyle;
  teammatePreference: TeammatePreferenceType;
}

export interface UserProfile extends PersonaTestResult {
  id: string;
  nickname: string;
  bio: string;
  profilePicture: string; // URL
  discordId?: string;
}

export interface MatchmakingPreferences {
  preferredTiers: {
    min?: FullTier;
    max?: FullTier;
  };
  gameModes: GameMode[];
  playDays: DayOfWeek[];
  playTimeStart: number; // 0-23
  playTimeEnd: number; // 0-23
  priorityRequirements: string; // Free text input
  preferredRole?: OverwatchRole; // 선호하는 상대 포지션
}

export interface MatchedUser {
  id: string;
  nickname: string;
  profilePicture: string;
  bio: string;
  mbti: MbtiType;
  hero: OverwatchHero;
  mainRole: OverwatchRole;
  maxTiers: {
    [OverwatchRole.TANK]?: FullTier;
    [OverwatchRole.DAMAGE]?: FullTier;
    [OverwatchRole.SUPPORT]?: FullTier;
  };
  discordId?: string;
}

export interface Notification {
  id: string;
  type: 'match_found' | 'message'; // Extendable
  message: string;
  timestamp: string;
  isRead: boolean;
  matchedUserId?: string; // If type is 'match_found'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
}
