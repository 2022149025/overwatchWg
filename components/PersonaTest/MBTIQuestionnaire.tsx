import React from 'react';
import { Question, MbtiLetter, MbtiDimension } from '../../types';
import QuestionCard from '../QuestionCard';
import Button from '../Button';

interface MBTIQuestionnaireProps {
  questions: Question[];
  answers: Record<string, MbtiLetter | null>;
  onAnswer: (questionId: string, answer: MbtiLetter) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentQuestionIndex: number;
}

const MBTIQuestionnaire: React.FC<MBTIQuestionnaireProps> = ({
  questions,
  answers,
  onAnswer,
  onNext,
  onPrevious,
  currentQuestionIndex,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const canProceed = answers[currentQuestion.id] !== null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-400">
            {currentQuestionIndex + 1} / {questions.length}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <QuestionCard
          questionText={currentQuestion.text}
          options={currentQuestion.options.map((opt) => ({
            text: opt.text,
            value: opt.value,
          }))}
          onSelect={(value) => onAnswer(currentQuestion.id, value as MbtiLetter)}
          selectedValue={answers[currentQuestion.id]}
          className="animate-fade-in"
        />

        <div className="flex justify-between mt-8">
          <Button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            variant="secondary"
            className="w-1/3 mr-2"
          >
            이전
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            variant="primary"
            className="w-2/3 ml-2"
          >
            {isLastQuestion ? '다음 (매칭 질문으로)' : '다음'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MBTIQuestionnaire;
