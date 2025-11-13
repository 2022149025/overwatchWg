import React from 'react';
import { MbtiType, OverwatchHero } from '../../types';
import Button from '../Button';
import { Link } from 'react-router-dom';
import HeroAvatar from '../HeroAvatar';

interface PersonaResultDisplayProps {
  mbti: MbtiType;
  hero: OverwatchHero;
  onSignupStart: () => void;
}

const PersonaResultDisplay: React.FC<PersonaResultDisplayProps> = ({ mbti, hero, onSignupStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">내가 오버워치 영웅이라면? 결과!</h2>
        <p className="text-xl text-gray-200 mb-2">당신의 MBTI는 <span className="text-blue-300 font-bold">{mbti}</span> 입니다!</p>
        <p className="text-2xl text-white font-extrabold mb-8">
          당신의 영웅 유형은 <span className="text-red-500">{hero}</span>!
        </p>

        <HeroAvatar
          heroName={hero}
          size="xlarge"
          className="mx-auto shadow-lg mb-8"
          borderColor="border-red-500"
        />

        <p className="text-lg text-gray-300 mb-8">
          매칭 플랫폼에 가입하고 자신에게 딱 맞는 팀원을 찾아보세요!
        </p>

        <div className="space-y-4">
          <Button variant="primary" size="lg" className="w-full" onClick={onSignupStart}>
            회원가입하기
          </Button>
          <Link to="/auth">
            <Button variant="outline" size="lg" className="w-full">
              이미 계정이 있어요!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonaResultDisplay;