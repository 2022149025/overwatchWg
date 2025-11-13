import React, { useState } from 'react';
import {
  OverwatchRole,
  OverwatchHero,
  FullTier,
  Tier,
  Division,
  GameMode,
  DayOfWeek,
  TeammateCommunicationStyle,
  SelfCommunicationStyle,
  TeammatePreferenceType,
  PersonaTestResult
} from '../../types';
import {
  OVERWATCH_HEROES_BY_ROLE,
  ALL_ROLES,
  TIER_OPTIONS,
  GAME_MODE_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  TEAMMATE_COMMUNICATION_OPTIONS,
  SELF_COMMUNICATION_OPTIONS,
  TEAMMATE_PREFERENCE_OPTIONS,
} from '../../constants';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Input from '../Input';
import HeroAvatar from '../HeroAvatar';

interface MatchingPreferencesFormProps {
  onComplete: (data: Omit<PersonaTestResult, 'mbti' | 'hero'>) => void;
  onPrevious: () => void;
}

const MatchingPreferencesForm: React.FC<MatchingPreferencesFormProps> = ({ onComplete, onPrevious }) => {
  const [mainRole, setMainRole] = useState<OverwatchRole>(OverwatchRole.ALLROUNDER);
  const [preferredTanks, setPreferredTanks] = useState<OverwatchHero[]>([]);
  const [preferredDamage, setPreferredDamage] = useState<OverwatchHero[]>([]);
  const [preferredSupports, setPreferredSupports] = useState<OverwatchHero[]>([]);
  const [maxTiers, setMaxTiers] = useState<{[key in OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT]?: FullTier}>({});
  const [preferredTeammateCommunication, setPreferredTeammateCommunication] = useState<TeammateCommunicationStyle>(TeammateCommunicationStyle.ANY);
  const [selfCommunicationStyle, setSelfCommunicationStyle] = useState<SelfCommunicationStyle>(SelfCommunicationStyle.QUIET_PLAY);
  const [teammatePreference, setTeammatePreference] = useState<TeammatePreferenceType>(TeammatePreferenceType.ANY);

  const handleMaxTierChange = (role: OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT, value: FullTier) => {
    setMaxTiers((prev) => ({ ...prev, [role]: value }));
  };

  const handleHeroSelection = (
    role: OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT,
    hero: OverwatchHero,
    isSelected: boolean
  ) => {
    const setter =
      role === OverwatchRole.TANK
        ? setPreferredTanks
        : role === OverwatchRole.DAMAGE
        ? setPreferredDamage
        : setPreferredSupports;
    const currentList =
      role === OverwatchRole.TANK
        ? preferredTanks
        : role === OverwatchRole.DAMAGE
        ? preferredDamage
        : preferredSupports;

    if (isSelected) {
      if (currentList.length < 3) {
        setter([...currentList, hero]);
      }
    } else {
      setter(currentList.filter((h) => h !== hero));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      mainRole,
      preferredTanks,
      preferredDamage,
      preferredSupports,
      maxTiers,
      preferredTeammateCommunication,
      selfCommunicationStyle,
      teammatePreference,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg shadow-xl my-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-300">매칭에 쓰일 데이터 질문</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Dropdown
          id="mainRole"
          label="돌격, 공격, 지원 중 어떤 포지션을 선호하시나요?"
          options={ALL_ROLES.map((role) => ({ value: role, label: role }))}
          value={mainRole}
          onChange={(e) => setMainRole(e.target.value as OverwatchRole)}
        />

        {Object.values(OverwatchRole).slice(0, 3).map((role) => (
          <div key={role} className="border border-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-200">
              {role} 영웅 중 어떤 영웅을 주로 사용하시나요? (최대 3개)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-1.5">
              {OVERWATCH_HEROES_BY_ROLE[role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT].map((hero) => {
                const isSelected =
                  (role === OverwatchRole.TANK && preferredTanks.includes(hero)) ||
                  (role === OverwatchRole.DAMAGE && preferredDamage.includes(hero)) ||
                  (role === OverwatchRole.SUPPORT && preferredSupports.includes(hero));
                return (
                  <button
                    key={hero}
                    type="button"
                    onClick={() =>
                      handleHeroSelection(
                        role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT,
                        hero,
                        !isSelected
                      )
                    }
                    className={`
                      flex flex-col items-center p-1.5 rounded-md transition-all
                      ${isSelected 
                        ? 'bg-blue-600 border-2 border-blue-400 shadow-lg scale-105' 
                        : 'bg-gray-700 border border-gray-600 hover:border-gray-500'
                      }
                      cursor-pointer hover:scale-105
                    `}
                  >
                    <HeroAvatar 
                      heroName={hero} 
                      size="small" 
                      showBorder={false}
                    />
                    <span className={`text-[10px] mt-0.5 font-medium text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {hero}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <Dropdown
                id={`${role}-max-tier`}
                label={`${role} 포지션 별로 달성했던 최대 티어를 선택해주세요`}
                options={[{ value: '', label: '선택 안함' }, ...TIER_OPTIONS]}
                value={maxTiers[role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT] || ''}
                onChange={(e) =>
                  handleMaxTierChange(
                    role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT,
                    e.target.value as FullTier
                  )
                }
              />
            </div>
          </div>
        ))}

        <Dropdown
          id="preferredTeammateCommunication"
          label="어떤 유형의 팀원을 선호하시나요?"
          options={TEAMMATE_COMMUNICATION_OPTIONS.map((style) => ({ value: style, label: style }))}
          value={preferredTeammateCommunication}
          onChange={(e) => setPreferredTeammateCommunication(e.target.value as TeammateCommunicationStyle)}
        />

        <Dropdown
          id="selfCommunicationStyle"
          label="자신은 어떤 유형인가요?"
          options={SELF_COMMUNICATION_OPTIONS.map((style) => ({ value: style, label: style }))}
          value={selfCommunicationStyle}
          onChange={(e) => setSelfCommunicationStyle(e.target.value as SelfCommunicationStyle)}
        />

        <Dropdown
          id="teammatePreference"
          label="셋 중 어떤 팀원을 선호하시나요?"
          options={TEAMMATE_PREFERENCE_OPTIONS.map((type) => ({ value: type, label: type }))}
          value={teammatePreference}
          onChange={(e) => setTeammatePreference(e.target.value as TeammatePreferenceType)}
        />

        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious} variant="secondary" className="w-1/3 mr-2">
            이전
          </Button>
          <Button type="submit" variant="primary" className="w-2/3 ml-2">
            완료! 영웅 결과 보기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MatchingPreferencesForm;