import React from 'react';
import Button from './Button';

interface QuestionOption {
  text: string;
  value: string; // Could be MbtiLetter or a generic value for other questions
}

interface QuestionCardProps {
  questionText: string;
  options: QuestionOption[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  options,
  onSelect,
  selectedValue,
  className = '',
}) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-xl ${className}`}>
      <h3 className="text-xl font-semibold mb-6 text-center text-blue-300">{questionText}</h3>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? 'primary' : 'secondary'}
            onClick={() => onSelect(option.value)}
            className="w-full text-left justify-start !py-4 !px-4 !h-auto !min-h-[60px] !text-base !leading-relaxed"
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;