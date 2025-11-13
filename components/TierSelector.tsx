import React, { useState } from 'react';
import { FullTier, Tier, Division } from '../types';
import Button from './Button';

interface TierSelectorProps {
  label: string;
  value: FullTier | '';
  onChange: (value: FullTier | '') => void;
}

const TIERS = [
  Tier.BRONZE,
  Tier.SILVER,
  Tier.GOLD,
  Tier.PLATINUM,
  Tier.DIAMOND,
  Tier.MASTER,
  Tier.GRANDMASTER,
  Tier.CHALLENGER,
];

const DIVISIONS = [Division.FIVE, Division.FOUR, Division.THREE, Division.TWO, Division.ONE];

const TierSelector: React.FC<TierSelectorProps> = ({ label, value, onChange }) => {
  const [selectedTier, setSelectedTier] = useState<Tier | ''>('');
  const [showDivisions, setShowDivisions] = useState(false);

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setShowDivisions(true);
  };

  const handleDivisionSelect = (division: Division) => {
    const fullTier = `${selectedTier}${division}` as FullTier;
    onChange(fullTier);
    setShowDivisions(false);
  };

  const handleReset = () => {
    setSelectedTier('');
    setShowDivisions(false);
    onChange('');
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
      
      {value && (
        <div className="mb-2 p-2 bg-gray-700 rounded flex justify-between items-center">
          <span className="text-white font-semibold">{value}</span>
          <button
            onClick={handleReset}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            초기화
          </button>
        </div>
      )}

      {!showDivisions ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS.map((tier) => (
            <Button
              key={tier}
              type="button"
              variant="secondary"
              onClick={() => handleTierSelect(tier)}
              className="!text-sm !py-2 !min-w-0 !h-auto"
            >
              {tier}
            </Button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              {selectedTier} 티어 - 세부 등급 선택:
            </span>
            <button
              onClick={() => setShowDivisions(false)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 뒤로
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {DIVISIONS.map((division) => (
              <Button
                key={division}
                type="button"
                variant="primary"
                onClick={() => handleDivisionSelect(division)}
                className="!text-sm !py-2 !min-w-0 !h-auto"
              >
                {division}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TierSelector;
