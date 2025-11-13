import React, { useState } from 'react';
import { UserProfile, OverwatchRole, FullTier } from '../../types';
import Button from '../Button';
import Input from '../Input';
import Dropdown from '../Dropdown';
import HeroAvatar from '../HeroAvatar';
import {
  OVERWATCH_HEROES_BY_ROLE,
  ALL_ROLES,
  TIER_OPTIONS,
  TEAMMATE_COMMUNICATION_OPTIONS,
  SELF_COMMUNICATION_OPTIONS,
  TEAMMATE_PREFERENCE_OPTIONS,
} from '../../constants';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  React.useEffect(() => {
    if (userProfile) {
      setEditedProfile({ ...userProfile });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [id]: value });
    }
  };

  const handleDropdownChange = (id: string, value: string) => {
    if (editedProfile) {
      if (id === 'mainRole') {
        setEditedProfile({ ...editedProfile, mainRole: value as OverwatchRole });
      } else if (
        id === 'preferredTeammateCommunication'
      ) {
        setEditedProfile({ ...editedProfile, preferredTeammateCommunication: value as any });
      } else if (
        id === 'selfCommunicationStyle'
      ) {
        setEditedProfile({ ...editedProfile, selfCommunicationStyle: value as any });
      } else if (
        id === 'teammatePreference'
      ) {
        setEditedProfile({ ...editedProfile, teammatePreference: value as any });
      } else if (id.startsWith('maxTier-')) {
        const role = id.split('-')[1] as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT;
        setEditedProfile((prev) => ({
          ...prev!,
          maxTiers: { ...prev!.maxTiers, [role]: value as FullTier || undefined },
        }));
      }
    }
  };

  const handleHeroSelection = (
    role: OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT,
    hero: string,
    isSelected: boolean
  ) => {
    if (!editedProfile) return;

    let currentList: string[] = [];
    let setter: (heroes: string[]) => void;

    switch (role) {
      case OverwatchRole.TANK:
        currentList = editedProfile.preferredTanks || [];
        setter = (heroes) => setEditedProfile((prev) => ({ ...prev!, preferredTanks: heroes }));
        break;
      case OverwatchRole.DAMAGE:
        currentList = editedProfile.preferredDamage || [];
        setter = (heroes) => setEditedProfile((prev) => ({ ...prev!, preferredDamage: heroes }));
        break;
      case OverwatchRole.SUPPORT:
        currentList = editedProfile.preferredSupports || [];
        setter = (heroes) => setEditedProfile((prev) => ({ ...prev!, preferredSupports: heroes }));
        break;
      default:
        return;
    }

    if (isSelected) {
      if (currentList.length < 3) {
        setter([...currentList, hero]);
      }
    } else {
      setter(currentList.filter((h) => h !== hero));
    }
  };

  const handleSave = () => {
    if (editedProfile) {
      onUpdateProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile ? { ...userProfile } : null);
    setIsEditing(false);
  };

  if (!userProfile || !editedProfile) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-300">프로필을 보려면 로그인 해주세요.</p>
        <Button onClick={() => window.location.hash = '/auth'} className="mt-6">로그인 페이지로 이동</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">프로필</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-6 mb-4">
          <img
            src={editedProfile.profilePicture || 'https://picsum.photos/200/200'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <HeroAvatar 
            heroName={editedProfile.hero} 
            size="xlarge" 
            borderColor="border-orange-500"
          />
        </div>
        {isEditing && (
          <Input
            id="profilePicture"
            type="text"
            value={editedProfile.profilePicture}
            onChange={handleInputChange}
            placeholder="프로필 사진 URL"
            className="w-full max-w-xs text-center"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">닉네임</label>
          {isEditing ? (
            <Input id="nickname" value={editedProfile.nickname} onChange={handleInputChange} />
          ) : (
            <p className="text-lg text-white font-semibold">{userProfile.nickname}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">MBTI</label>
          <p className="text-lg text-white">{userProfile.mbti}</p>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">영웅 유형</label>
          <div className="flex items-center space-x-4">
            <HeroAvatar heroName={userProfile.hero} size="medium" />
            <p className="text-lg text-white font-semibold">{userProfile.hero}</p>
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">주 포지션</label>
          {isEditing ? (
            <Dropdown
              id="mainRole"
              options={ALL_ROLES.map((role) => ({ value: role, label: role }))}
              value={editedProfile.mainRole}
              onChange={(e) => handleDropdownChange('mainRole', e.target.value)}
            />
          ) : (
            <p className="text-lg text-white">{userProfile.mainRole}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-bold mb-2">자기소개</label>
          {isEditing ? (
            <textarea
              id="bio"
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 min-h-[100px]"
              value={editedProfile.bio}
              onChange={handleInputChange}
            ></textarea>
          ) : (
            <p className="text-white bg-gray-700 p-3 rounded-md">{userProfile.bio}</p>
          )}
        </div>

        {Object.values(OverwatchRole).slice(0, 3).map((role) => (
          <div key={role} className="md:col-span-2 border border-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3 text-blue-200">주 {role} 영웅 (최대 3개)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OVERWATCH_HEROES_BY_ROLE[role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT].map((hero) => {
                const currentList =
                  role === OverwatchRole.TANK ? editedProfile.preferredTanks :
                  role === OverwatchRole.DAMAGE ? editedProfile.preferredDamage :
                  editedProfile.preferredSupports;
                const isSelected = currentList?.includes(hero) || false;

                return (
                  <button
                    key={hero}
                    type="button"
                    onClick={() => isEditing && handleHeroSelection(role as any, hero, !isSelected)}
                    disabled={!isEditing}
                    className={`
                      flex flex-col items-center p-2 rounded-lg transition-all
                      ${isSelected 
                        ? 'bg-blue-600 border-2 border-blue-400 shadow-lg scale-105' 
                        : 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                      }
                      ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                    `}
                  >
                    <HeroAvatar 
                      heroName={hero} 
                      size="small" 
                      showBorder={isSelected}
                      borderColor={isSelected ? 'border-blue-300' : 'border-gray-500'}
                    />
                    <span className={`text-xs mt-1 font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {hero}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <Dropdown
                id={`maxTier-${role}`}
                label={`${role} 포지션 최대 티어`}
                options={[{ value: '', label: '선택 안함' }, ...TIER_OPTIONS]}
                value={editedProfile.maxTiers[role as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT] || ''}
                onChange={(e) => handleDropdownChange(`maxTier-${role}`, e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        ))}

        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">선호 팀원 소통 유형</label>
          {isEditing ? (
            <Dropdown
              id="preferredTeammateCommunication"
              options={TEAMMATE_COMMUNICATION_OPTIONS.map((style) => ({ value: style, label: style }))}
              value={editedProfile.preferredTeammateCommunication}
              onChange={(e) => handleDropdownChange('preferredTeammateCommunication', e.target.value)}
            />
          ) : (
            <p className="text-lg text-white">{userProfile.preferredTeammateCommunication}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">자신의 소통 유형</label>
          {isEditing ? (
            <Dropdown
              id="selfCommunicationStyle"
              options={SELF_COMMUNICATION_OPTIONS.map((style) => ({ value: style, label: style }))}
              value={editedProfile.selfCommunicationStyle}
              onChange={(e) => handleDropdownChange('selfCommunicationStyle', e.target.value)}
            />
          ) : (
            <p className="text-lg text-white">{userProfile.selfCommunicationStyle}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-bold mb-2">팀원 선호 유형</label>
          {isEditing ? (
            <Dropdown
              id="teammatePreference"
              options={TEAMMATE_PREFERENCE_OPTIONS.map((type) => ({ value: type, label: type }))}
              value={editedProfile.teammatePreference}
              onChange={(e) => handleDropdownChange('teammatePreference', e.target.value)}
            />
          ) : (
            <p className="text-lg text-white">{userProfile.teammatePreference}</p>
          )}
        </div>

        {/* 디스코드 ID 필드 추가 */}
        <div className="md:col-span-2 border-t border-gray-700 pt-6">
          <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 mb-4">
            <p className="text-blue-200 text-sm font-semibold mb-2">💬 디스코드 ID</p>
            <p className="text-blue-300 text-xs">
              매칭 성공 시 상대방과 디스코드 ID를 공유할 수 있습니다. 
              양쪽 모두 공유에 동의해야 ID가 표시됩니다.
            </p>
          </div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            디스코드 ID (예: YourName#1234)
          </label>
          {isEditing ? (
            <Input 
              id="discordId" 
              value={editedProfile.discordId || ''} 
              onChange={handleInputChange}
              placeholder="YourDiscord#1234"
            />
          ) : (
            <div className="bg-gray-700 p-3 rounded-md">
              {userProfile.discordId ? (
                <p className="text-white font-mono text-lg">{userProfile.discordId}</p>
              ) : (
                <p className="text-gray-400 italic">디스코드 ID가 설정되지 않았습니다</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={handleCancel}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSave}>
              저장
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            프로필 편집
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;