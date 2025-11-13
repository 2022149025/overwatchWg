import React, { useState } from 'react';
import { getHeroImage, normalizeHeroName } from '../lib/heroImages';

interface HeroAvatarProps {
  heroName: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  showBorder?: boolean;
  borderColor?: string;
}

// 영웅별 고유 색상 매핑 (폴백용 - 이미지 로드 실패 시)
const HERO_COLORS: { [key: string]: { from: string; to: string } } = {
  // 돌격군
  'D.Va': { from: 'from-pink-500', to: 'to-pink-700' },
  '디바': { from: 'from-pink-500', to: 'to-pink-700' },
  '둠피스트': { from: 'from-purple-600', to: 'to-purple-800' },
  '정커퀸': { from: 'from-orange-500', to: 'to-red-600' },
  '정크랫퀸': { from: 'from-orange-500', to: 'to-red-600' },
  '오리사': { from: 'from-green-500', to: 'to-green-700' },
  '라마트라': { from: 'from-purple-500', to: 'to-indigo-700' },
  '라인하르트': { from: 'from-gray-400', to: 'to-gray-600' },
  '로드호그': { from: 'from-yellow-600', to: 'to-orange-700' },
  '시그마': { from: 'from-indigo-500', to: 'to-purple-700' },
  '윈스턴': { from: 'from-blue-400', to: 'to-blue-600' },
  '레킹볼': { from: 'from-orange-400', to: 'to-orange-600' },
  '자리야': { from: 'from-pink-600', to: 'to-red-700' },
  '마우가': { from: 'from-red-600', to: 'to-red-800' },
  '해저드': { from: 'from-teal-600', to: 'to-teal-800' },
  
  // 공격군
  '겐지': { from: 'from-green-400', to: 'to-green-600' },
  '리퍼': { from: 'from-gray-700', to: 'to-gray-900' },
  '메이': { from: 'from-blue-400', to: 'to-cyan-600' },
  '바스티온': { from: 'from-green-600', to: 'to-green-800' },
  '벤처': { from: 'from-yellow-600', to: 'to-orange-700' },
  '소전': { from: 'from-blue-500', to: 'to-cyan-600' },
  '솔저: 76': { from: 'from-blue-600', to: 'to-blue-800' },
  '솔져: 76': { from: 'from-blue-600', to: 'to-blue-800' },
  '솜브라': { from: 'from-purple-500', to: 'to-purple-700' },
  '시메트라': { from: 'from-cyan-400', to: 'to-blue-600' },
  '애쉬': { from: 'from-gray-300', to: 'to-gray-500' },
  '에코': { from: 'from-blue-300', to: 'to-blue-500' },
  '위도우메이커': { from: 'from-purple-600', to: 'to-purple-800' },
  '정크랫': { from: 'from-yellow-500', to: 'to-orange-600' },
  '캐서디': { from: 'from-amber-600', to: 'to-amber-800' },
  '토르비욘': { from: 'from-red-500', to: 'to-red-700' },
  '트레이서': { from: 'from-orange-400', to: 'to-orange-600' },
  '파라': { from: 'from-blue-600', to: 'to-indigo-700' },
  '프레야': { from: 'from-purple-400', to: 'to-pink-600' },
  '한조': { from: 'from-blue-500', to: 'to-blue-700' },
  
  // 지원군
  '라이프위버': { from: 'from-pink-400', to: 'to-pink-600' },
  '루시우': { from: 'from-green-400', to: 'to-green-600' },
  '메르시': { from: 'from-yellow-300', to: 'to-yellow-500' },
  '모이라': { from: 'from-purple-600', to: 'to-red-700' },
  '바티스트': { from: 'from-teal-500', to: 'to-teal-700' },
  '브리기테': { from: 'from-orange-500', to: 'to-red-600' },
  '아나': { from: 'from-indigo-500', to: 'to-indigo-700' },
  '우양': { from: 'from-cyan-500', to: 'to-blue-600' },
  '일리아리': { from: 'from-yellow-500', to: 'to-orange-600' },
  '젠야타': { from: 'from-yellow-500', to: 'to-orange-600' },
  '주노': { from: 'from-blue-400', to: 'to-cyan-600' },
  '키리코': { from: 'from-red-500', to: 'to-pink-600' },
};

const HeroAvatar: React.FC<HeroAvatarProps> = ({
  heroName,
  size = 'medium',
  className = '',
  showBorder = true,
  borderColor = 'border-blue-500',
}) => {
  const [imageError, setImageError] = useState(false);
  const normalizedName = normalizeHeroName(heroName);
  const imageUrl = getHeroImage(normalizedName);
  
  // 크기 매핑
  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-20 h-20 text-2xl',
    large: 'w-32 h-32 text-4xl',
    xlarge: 'w-48 h-48 text-6xl',
  };

  const sizeClass = sizeClasses[size];
  const borderClass = showBorder ? `border-4 ${borderColor}` : '';
  
  // 이미지 로드 실패 시 폴백 (그라디언트 + 첫 글자)
  if (imageError) {
    const colors = HERO_COLORS[normalizedName] || { from: 'from-gray-500', to: 'to-gray-700' };
    return (
      <div
        className={`${sizeClass} ${borderClass} rounded-full bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shadow-lg ${className}`}
        title={normalizedName}
      >
        <span className="text-white font-bold drop-shadow-lg">
          {normalizedName.charAt(0)}
        </span>
      </div>
    );
  }

  // 이미지 표시
  return (
    <img
      src={imageUrl}
      alt={normalizedName}
      className={`${sizeClass} ${borderClass} rounded-full object-cover shadow-lg ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
      title={normalizedName}
    />
  );
};

export default HeroAvatar;
