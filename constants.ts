import {
  MbtiDimension,
  MbtiLetter,
  Question,
  OverwatchHero,
  MbtiType,
  OverwatchRole,
  Tier,
  Division,
  FullTier,
  HeroRefinementQuestion,
  GameMode,
  DayOfWeek,
  TeammateCommunicationStyle,
  SelfCommunicationStyle,
  TeammatePreferenceType,
  Notification
} from './types';

// MBTI Questions
export const MBTI_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '팀보 채널에서 나는?',
    options: [
      { text: '팀보에 들어가서 적극적으로 제안하고 브리핑한다', value: MbtiLetter.E },
      { text: '필요할 때만 말하거나 채팅을 친다', value: MbtiLetter.I },
    ],
    dimension: MbtiDimension.EI,
  },
  {
    id: 'q2',
    text: '경쟁전을 하려고 한다, 나는 어떻게?',
    options: [
      { text: '혼자 경쟁전을 돌린다', value: MbtiLetter.I },
      { text: '친구창에서 현재 접속 중인 사람에게 같이 하자고 제안한다', value: MbtiLetter.E },
    ],
    dimension: MbtiDimension.EI,
  },
  {
    id: 'q3',
    text: '솔랭 도중 마음에 드는 플레이어가 있다!',
    options: [
      { text: '그룹 신청을 건다', value: MbtiLetter.E },
      { text: '속으로만 생각하고 다음 게임을 바로 돌린다', value: MbtiLetter.I },
    ],
    dimension: MbtiDimension.EI,
  },
  {
    id: 'q4',
    text: '딜러로 게임이 시작됐다, 나는 어떻게?',
    options: [
      { text: '혼자 캐리하는 상상을 한다', value: MbtiLetter.N },
      { text: '아군 조합을 보고 운영법을 생각한다', value: MbtiLetter.S },
    ],
    dimension: MbtiDimension.NS,
  },
  {
    id: 'q5',
    text: '아군 겐지가 2킬 7데스 중이다. 나는 어떻게?',
    options: [
      { text: '"우리 겐지 사람 아님. GG"', value: MbtiLetter.N },
      { text: '"상대 조합 보니까 겐지 불리함. 바꾸는게 나을 듯"', value: MbtiLetter.S },
    ],
    dimension: MbtiDimension.NS,
  },
  {
    id: 'q6',
    text: '한타에서 졌다. 나는 어떻게?',
    options: [
      { text: '아 아깝다 뒤에서 막아야겠다', value: MbtiLetter.N },
      { text: '상대 궁 이제 없으니까 막을 수 있다', value: MbtiLetter.S },
    ],
    dimension: MbtiDimension.NS,
  },
  {
    id: 'q7',
    text: '내가 트레이서로 5킬6데스를 하고 있다. 팀원이 "트레 내리셈" 이라고 했다.',
    options: [
      { text: '내가 못한 게 맞으니까 납득하고 픽을 바꾼다', value: MbtiLetter.T },
      { text: '자존심 상해서 실력으로 증명하기 위해 트레를 계속 한다.', value: MbtiLetter.F },
    ],
    dimension: MbtiDimension.TF,
  },
  {
    id: 'q8',
    text: '팀원이 승급전이라고 한다.',
    options: [
      { text: '우리 으쌰으쌰해봐요!', value: MbtiLetter.F },
      { text: '별로 관심 없다', value: MbtiLetter.T },
    ],
    dimension: MbtiDimension.TF,
  },
  {
    id: 'q9',
    text: '아군 윈스턴이 계속 무리하게 뛴다.',
    options: [
      { text: '"윈스턴님..." 하며 조심스럽게 말한다', value: MbtiLetter.F },
      { text: '바로 지적한다', value: MbtiLetter.T },
    ],
    dimension: MbtiDimension.TF,
  },
  {
    id: 'q10',
    text: '나는 어떤 스타일?',
    options: [
      { text: '미리 운영법을 생각하며 플레이한다.', value: MbtiLetter.J },
      { text: '즉흥적으로 플레이하는 편이다', value: MbtiLetter.P },
    ],
    dimension: MbtiDimension.JP,
  },
  {
    id: 'q11',
    text: '승리하기 위해서는 어떤 게 더 중요한가?',
    options: [
      { text: '유연한 대응', value: MbtiLetter.P },
      { text: '체계적 전략', value: MbtiLetter.J },
    ],
    dimension: MbtiDimension.JP,
  },
  {
    id: 'q12',
    text: '내가 오버워치에 입단했다. 누구와 훈련할까?',
    options: [
      { text: '잘 짜여진 솔저76의 훈련', value: MbtiLetter.J },
      { text: '즐겁게 하는 트레이서와의 훈련', value: MbtiLetter.P },
    ],
    dimension: MbtiDimension.JP,
  },
];

// MBTI to Hero Mapping
// FIX: Use Partial<Record<MbtiType, OverwatchHero[]>> because not all 4^4 MbtiType combinations
// are mapped, only the 16 standard MBTI types.
export const MBTI_HERO_MAP: Partial<Record<MbtiType, OverwatchHero[]>> = {
  ISTJ: ['솔저76', '파라'],
  ISFJ: ['에코', '아나', '주노'],
  INFJ: ['젠야타', '라이프위버'],
  INTJ: ['라마트라', '시메트라', '모이라'],
  ISTP: ['로드호그', '겐지', '리퍼', '위도우메이커', '프레야', '한조'],
  ISFP: ['일리아리'],
  INFP: ['메이', '바스티온'],
  INTP: ['시그마', '윈스턴'],
  ESTP: ['마우가', '정커퀸', '해저드', '캐서디'],
  ESFP: ['D.Va', '라인하르트', '루시우'],
  ENFP: ['소전', '트레이서', '키리코', '라이프위버'],
  ENTP: ['레킹볼', '솜브라', '정크랫'],
  ESTJ: ['자리야', '토르비욘'],
  ESFJ: ['오리사', '브리기테'],
  ENFJ: ['메르시', '바티스트', '우양'],
  ENTJ: ['둠피스트', '애쉬'],
};

// Additional questions for hero refinement
// FIX: Use Partial<Record<MbtiType, HeroRefinementQuestion[]>> because not all 4^4 MbtiType combinations
// have refinement questions, only the 16 standard MBTI types.
export const HERO_REFINEMENT_QUESTIONS: Partial<Record<MbtiType, HeroRefinementQuestion[]>> = {
  ISTJ: [
    {
      id: 'istj-q1',
      text: '당신은 조직에서 어떤 역할인가?',
      options: [
        { text: '질서를 통해 조직을 이끄는 리더', nextHeroes: ['파라'] },
        { text: '주어진 임무를 완벽히 수행하는 조직원', nextHeroes: ['솔저76'] },
      ],
    },
  ],
  ISFJ: [
    {
      id: 'isfj-q1',
      text: '당신은 어떤 편인가?',
      options: [
        { text: '새로운 가능성을 탐구하며 성장한다.', nextHeroes: ['에코'] },
        { text: '익숙한 관계를 지킨다.', nextHeroes: ['아나', '주노'] },
      ],
    },
    {
      id: 'isfj-q2', // Only shown if previous answer leads to '아나', '주노'
      text: '팀이 위기 상황일 때 어떻게 할까?',
      options: [
        { text: '경험을 바탕으로 한 멘트로 팀을 안정시킨다.', nextHeroes: ['아나'] },
        { text: '팀의 분위기를 읽고 자연스럽게 조율한다.', nextHeroes: ['주노'] },
      ],
    },
  ],
  INTJ: [
    {
      id: 'intj-q1',
      text: '내가 회사를 운영하는 CEO라면?',
      options: [
        { text: '기존의 질서와 체계를 잘 유지시키려 노력한다.', nextHeroes: ['시메트라'] },
        { text: '변화를 꾀하며 혁신을 추구한다.', nextHeroes: ['라마트라', '모이라'] },
      ],
    },
    {
      id: 'intj-q2', // Only shown if previous answer leads to '라마트라', '모이라'
      text: '“새로운 아이디어가 떠오르면?',
      options: [
        { text: '사람들과 공유해 함께 추진한다.', nextHeroes: ['라마트라'] },
        { text: '혼자 먼저 시도해보고 결과로 보여준다.', nextHeroes: ['모이라'] },
      ],
    },
  ],
  ISTP: [
    {
      id: 'istp-q1',
      text: '만화 주인공의 어떤 서사가 더 좋은가?',
      options: [
        { text: '압도적인 재능을 가진 주인공', nextHeroes: ['로드호그', '리퍼'] },
        { text: '소중한 것을 빼앗아간 원수에게 복수', nextHeroes: ['겐지', '한조', '위도우메이커', '프레야'] },
      ],
    },
    {
      id: 'istp-q2', // Only shown if previous answer leads to '로드호그', '리퍼'
      text: '만화 주인공의 어떤 성격이 더 좋은가?',
      options: [
        { text: '과거의 아픈 기억을 떠올려 동기부여를 얻는다', nextHeroes: ['리퍼'] },
        { text: '세상은 원래 만만한 게 아니다 (냉소)', nextHeroes: ['로드호그'] },
      ],
    },
    {
      id: 'istp-q3', // Only shown if previous answer leads to '겐지', '한조', '위도우메이커', '프레야'
      text: '당신이 싸울 때 집중하는 것은?',
      options: [
        { text: '자신과의 싸움', nextHeroes: ['겐지', '한조'] },
        { text: '적, 완수하려는 임무', nextHeroes: ['위도우메이커', '프레야'] },
      ],
    },
    {
      id: 'istp-q4', // Only shown if previous answer leads to '겐지', '한조'
      text: '당신이 더 중요하게 여기는 것은?',
      options: [
        { text: '내면의 변화를 통한 성장', nextHeroes: ['겐지'] },
        { text: '잘못에 대한 성찰', nextHeroes: ['한조'] },
      ],
    },
    {
      id: 'istp-q5', // Only shown if previous answer leads to '위도우메이커', '프레야'
      text: '감정과 판단에 대한 당신의 생각은?',
      options: [
        { text: '감정이 섞이면 판단이 흐려진다', nextHeroes: ['위도우메이커'] },
        { text: '감정도 판단의 한 부분이다', nextHeroes: ['프레야'] },
      ],
    },
  ],
  INFP: [
    {
      id: 'infp-q1',
      text: '당신은 평화주의자다. 어떤 행동을 하겠는가?',
      options: [
        { text: '자연 속에서 살아간다', nextHeroes: ['메이'] },
        { text: '행동을 취하지 않고 조용하게 기다린다', nextHeroes: ['바스티온'] },
      ],
    },
  ],
  INTP: [
    {
      id: 'intp-q1',
      text: '새로운 현상을 알려 할 때 당신은?',
      options: [
        { text: '원리를 이해하려고 분석한다', nextHeroes: ['시그마'] },
        { text: '직접 부딪혀본다', nextHeroes: ['윈스턴'] },
      ],
    },
  ],
  ESTP: [
    {
      id: 'estp-q1',
      text: '당신이 팀을 이끌 때',
      options: [
        { text: '말과 전략으로 이끈다', nextHeroes: ['캐서디', '정커퀸'] },
        { text: '열정과 기세로 이끈다', nextHeroes: ['마우가', '해저드'] },
      ],
    },
    {
      id: 'estp-q2', // Only shown if previous answer leads to '캐서디', '정커퀸'
      text: '당신이 팀을 이끌 때',
      options: [
        { text: '융통성 있게 다스린다', nextHeroes: ['정커퀸'] },
        { text: '철저한 규칙으로 통제한다', nextHeroes: ['캐서디'] },
      ],
    },
    {
      id: 'estp-q3', // Only shown if previous answer leads to '마우가', '해저드'
      text: '당신이 오버워치에서 재미를 느끼는 요소는?',
      options: [
        { text: '피지컬 싸움', nextHeroes: ['마우가'] },
        { text: '예측할 수 없는 조합과 전략', nextHeroes: ['해저드'] },
      ],
    },
  ],
  ESFP: [
    {
      id: 'esfp-q1',
      text: '당신은 어떤 리더가 되고 싶은가?',
      options: [
        { text: '분위기를 띄우는 리더', nextHeroes: ['D.Va'] },
        { text: '팀의 사기를 끌어올리는 리더', nextHeroes: ['루시우'] },
        { text: '묵묵하게 팀을 지키는 리더', nextHeroes: ['라인하르트'] },
      ],
    },
  ],
  ENFP: [
    {
      id: 'enfp-q1',
      text: '당신은 어떤 친구가 되고 싶은가?',
      options: [
        { text: '용기와 희망을 주는 활기찬 친구', nextHeroes: ['트레이서', '소전'] },
        { text: '다정하게 안정감을 주는 친구', nextHeroes: ['키리코', '라이프위버'] },
      ],
    },
    {
      id: 'enfp-q2', // Only shown if previous answer leads to '트레이서', '소전'
      text: '당신이 되고 싶은 리더는?',
      options: [
        { text: '활기찬 분위기로 팀을 이끈다', nextHeroes: ['트레이서'] },
        { text: '카리스마와 용기로 팀을 이끈다', nextHeroes: ['소전'] },
      ],
    },
    {
      id: 'enfp-q3', // Only shown if previous answer leads to '키리코', '라이프위버'
      text: '친구가 힘들어할 때 어떻게 알아차리는가?',
      options: [
        { text: '무슨 일인지 말하지 않아도 알아차린다', nextHeroes: ['키리코'] },
        { text: '분위기로 유도하여 말하게 한다', nextHeroes: ['라이프위버'] },
      ],
    },
  ],
  ENTP: [
    {
      id: 'entp-q1',
      text: '이번 판은 너무 혼란하고 개판 오분전이다. 당신의 선택은?',
      options: [
        { text: '혼란한 상황을 이용해서 이길 수 있게 한다.', nextHeroes: ['솜브라'] },
        { text: '혼란에 동참해서 즐긴다.', nextHeroes: ['정크랫', '레킹볼'] },
      ],
    },
    {
      id: 'entp-q2', // Only shown if previous answer leads to '정크랫', '레킹볼'
      text: '그렇다면 혼란 속에서 진짜 당신의 모습은?',
      options: [
        { text: '혼란을 진심으로 즐긴다.', nextHeroes: ['정크랫'] },
        { text: '혼란한 와중에도 나만의 계산이 있다.', nextHeroes: ['레킹볼'] },
      ],
    },
  ],
  ESTJ: [
    {
      id: 'estj-q1',
      text: '조직에서 나는 어떤 역할이 더 어울리겠는가?',
      options: [
        { text: '이미 만들어진 시스템을 유지시키는 역할', nextHeroes: ['자리야'] },
        { text: '조직의 초기 시스템을 만드는 역할', nextHeroes: ['토르비욘'] },
      ],
    },
  ],
  ESFJ: [
    {
      id: 'esfj-q1',
      text: '어떤 것이 팀을 더 단단하게 만드는가?',
      options: [
        { text: '모든 팀원의 팀워크', nextHeroes: ['오리사'] },
        { text: '한 사람의 희생과 헌신', nextHeroes: ['브리기테'] },
      ],
    },
  ],
  ENFJ: [
    {
      id: 'enfj-q1',
      text: '만화 주인공의 어떤 서사가 가장 좋은가?',
      options: [
        { text: '어릴 적, 최고의 스승으로부터 배운 주인공', nextHeroes: ['메르시'] },
        { text: '존경하던 아버지의 말로 동기부여를 얻는 주인공', nextHeroes: ['바티스트'] },
        { text: '친한 친구가 자신을 위해 죽었기 때문에 친구 몫까지 강해지려 하는 주인공', nextHeroes: ['우양'] },
      ],
    },
  ],
  ENTJ: [
    {
      id: 'entj-q1',
      text: '당신은 어떤 편인가?',
      options: [
        { text: '힘과 카리스마로 팀을 휘어잡는다.', nextHeroes: ['둠피스트'] },
        { text: '치밀한 지능과 전략으로 팀을 이끈다.', nextHeroes: ['애쉬'] },
      ],
    },
  ],
};


// Matching Data Questions
export const OVERWATCH_HEROES_BY_ROLE = {
  [OverwatchRole.TANK]: [
    'D.Va', '둠피스트', '라마트라', '라인하르트', '레킹볼', '로드호그', '마우가', '시그마', '오리사', '윈스턴', '자리야', '정커퀸', '해저드'
  ],
  [OverwatchRole.DAMAGE]: [
    '겐지', '리퍼', '메이', '바스티온', '벤처', '소전', '솔저: 76', '솜브라', '시메트라', '애쉬', '에코', '위도우메이커', '정크랫', '캐서디', '토르비욘', '트레이서', '파라', '프레야', '한조'
  ],
  [OverwatchRole.SUPPORT]: [
    '라이프위버', '루시우', '메르시', '모이라', '바티스트', '브리기테', '아나', '우양', '일리아리', '젠야타', '주노', '키리코'
  ],
};

export const ALL_ROLES = [
  OverwatchRole.TANK, OverwatchRole.DAMAGE, OverwatchRole.SUPPORT, OverwatchRole.ALLROUNDER
];

export const TIER_OPTIONS: { value: FullTier; label: string }[] = Object.values(Tier).flatMap(
  (tier) => Object.values(Division).map(
    (division) => ({ value: `${tier}${division}` as FullTier, label: `${tier}${division}` })
  )
);

export const GAME_MODE_OPTIONS = Object.values(GameMode);
export const DAY_OF_WEEK_OPTIONS = Object.values(DayOfWeek);
export const TEAMMATE_COMMUNICATION_OPTIONS = Object.values(TeammateCommunicationStyle);
export const SELF_COMMUNICATION_OPTIONS = Object.values(SelfCommunicationStyle);
export const TEAMMATE_PREFERENCE_OPTIONS = Object.values(TeammatePreferenceType);


// Dummy data for simulation
export const DUMMY_USER_PROFILE = {
  id: 'user-123',
  nickname: '오버워치 플레이어',
  bio: '재미있게 게임할 친구 찾아요! 주로 힐러 플레이합니다.',
  profilePicture: 'https://picsum.photos/200/200',
  mbti: 'ISFJ' as MbtiType,
  hero: '아나' as OverwatchHero,
  mainRole: OverwatchRole.SUPPORT,
  preferredTanks: [],
  preferredDamage: [],
  preferredSupports: ['아나', '메르시'],
  maxTiers: {
    [OverwatchRole.SUPPORT]: '플래티넘3' as FullTier,
  },
  preferredTeammateCommunication: TeammateCommunicationStyle.TALKATIVE,
  selfCommunicationStyle: SelfCommunicationStyle.CHAT_ONLY,
  teammatePreference: TeammatePreferenceType.MANNERS_OVER_SKILL,
  discordId: 'dummyuser#1234',
};

export const DUMMY_MATCHED_USER = {
  id: 'matched-user-456',
  nickname: '같이할 오버워치 친구',
  profilePicture: 'https://picsum.photos/200/200?grayscale',
  bio: '주로 딜러 합니다. 피지컬 좋아요. 즐겜 지향!',
  mbti: 'ESTP' as MbtiType,
  hero: '캐서디' as OverwatchHero,
  mainRole: OverwatchRole.DAMAGE,
  maxTiers: {
    [OverwatchRole.DAMAGE]: '다이아몬드2' as FullTier,
  },
  discordId: 'matchedfriend#5678',
};

// FIX: Explicitly type DUMMY_NOTIFICATIONS as Notification[] to ensure type correctness
// for `type` property (e.g., 'match_found' | 'message') during state initialization.
export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'match_found',
    message: '새로운 매칭 상대를 찾았습니다!',
    timestamp: new Date().toISOString(),
    isRead: false,
    matchedUserId: DUMMY_MATCHED_USER.id,
  },
  {
    id: 'notif-2',
    type: 'message',
    message: '환영합니다! 친구 찾기를 시작해보세요.',
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    isRead: true,
  },
];