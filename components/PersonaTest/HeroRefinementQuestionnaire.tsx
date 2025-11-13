import React, { useState, useEffect } from 'react';
import { HeroRefinementQuestion, OverwatchHero, MbtiType } from '../../types';
import { HERO_REFINEMENT_QUESTIONS } from '../../constants';
import QuestionCard from '../QuestionCard';
import Button from '../Button';

interface HeroRefinementQuestionnaireProps {
  mbti: MbtiType;
  initialHeroes: OverwatchHero[];
  onComplete: (selectedHero: OverwatchHero) => void;
  onPrevious: () => void;
}

const HeroRefinementQuestionnaire: React.FC<HeroRefinementQuestionnaireProps> = ({
  mbti,
  initialHeroes,
  onComplete,
  onPrevious,
}) => {
  const [currentHeroes, setCurrentHeroes] = useState<OverwatchHero[]>(initialHeroes);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());

  const refinementQuestions = HERO_REFINEMENT_QUESTIONS[mbti] || [];

  // Determine the next question to show based on `currentHeroes`
  const getNextQuestion = (
    heroes: OverwatchHero[],
    startIndex: number
  ): { question: HeroRefinementQuestion; index: number } | null => {
    for (let i = startIndex; i < refinementQuestions.length; i++) {
      const question = refinementQuestions[i];
      
      // Skip if already answered
      if (answeredQuestionIds.has(question.id)) {
        continue;
      }
      
      // Check if any hero in the current pool is part of this question's options
      const relevant = question.options.some(option =>
        option.nextHeroes.some(hero => heroes.includes(hero))
      );
      if (relevant) {
        return { question, index: i };
      }
    }
    return null;
  };

  const [displayQuestion, setDisplayQuestion] = useState<{ question: HeroRefinementQuestion; index: number } | null>(
    null
  );

  useEffect(() => {
    console.log('useEffect triggered, currentHeroes:', currentHeroes);
    
    if (currentHeroes.length === 1) {
      console.log('Only 1 hero left, completing:', currentHeroes[0]);
      onComplete(currentHeroes[0]);
      return;
    }
    
    const nextQ = getNextQuestion(currentHeroes, 0);
    console.log('Next question found:', nextQ);
    
    if (nextQ) {
      setDisplayQuestion(nextQ);
      setCurrentQuestionIndex(nextQ.index);
    } else {
      console.log('No more questions, completing with first hero:', currentHeroes[0]);
      onComplete(currentHeroes[0]);
    }
  }, [currentHeroes, mbti, onComplete]);

  const [pendingNextHeroes, setPendingNextHeroes] = useState<OverwatchHero[] | null>(null);

  const handleSelect = (questionId: string, selectedValue: string, nextHeroes: OverwatchHero[]) => {
    console.log('Selected:', questionId, selectedValue, nextHeroes);
    setAnswers((prev) => ({ ...prev, [questionId]: selectedValue }));
    const filteredNextHeroes = nextHeroes.filter(hero => initialHeroes.includes(hero));
    console.log('Filtered next heroes:', filteredNextHeroes);
    setPendingNextHeroes(filteredNextHeroes);
  };

  const handleNext = () => {
    console.log('Next clicked, pending heroes:', pendingNextHeroes);
    if (pendingNextHeroes && pendingNextHeroes.length > 0 && displayQuestion) {
      // Mark current question as answered
      setAnsweredQuestionIds(prev => new Set([...prev, displayQuestion.question.id]));
      setCurrentHeroes(pendingNextHeroes);
      setPendingNextHeroes(null);
    }
  };

  if (currentHeroes.length === 1) {
    return null; // Hero determined, component will unmount
  }

  if (!displayQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <div className="max-w-xl w-full text-center text-gray-400">
          <p>영웅을 선택하는 중입니다...</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const question = displayQuestion.question;
  const canProceed = pendingNextHeroes !== null && pendingNextHeroes.length > 0;
  
  console.log('Current state:', {
    questionId: question.id,
    answers,
    pendingNextHeroes,
    canProceed
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="max-w-xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-300">영웅을 더 자세히 선택해 주세요!</h2>
        <QuestionCard
          questionText={question.text}
          options={question.options.map((opt) => ({
            text: opt.text,
            value: JSON.stringify(opt.nextHeroes), // Store nextHeroes array as string
          }))}
          onSelect={(value) => handleSelect(question.id, value, JSON.parse(value) as OverwatchHero[])}
          selectedValue={answers[question.id]}
          className="animate-fade-in"
        />

        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious} variant="secondary" className="w-1/3 mr-2">
            이전 단계로
          </Button>
          <Button 
            onClick={() => {
              console.log('Button clicked!');
              handleNext();
            }} 
            disabled={!canProceed} 
            variant="primary" 
            className="w-2/3 ml-2"
          >
            다음으로 {canProceed ? '✓' : '✗'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroRefinementQuestionnaire;