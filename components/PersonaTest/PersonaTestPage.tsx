import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MbtiLetter,
  MbtiScore,
  MbtiDimension,
  MbtiType,
  OverwatchHero,
  PersonaTestResult,
  OverwatchRole,
  FullTier,
} from '../../types';
import { MBTI_QUESTIONS, MBTI_HERO_MAP } from '../../constants';
import MBTIQuestionnaire from './MBTIQuestionnaire';
import MatchingPreferencesForm from './MatchingPreferencesForm';
import HeroRefinementQuestionnaire from './HeroRefinementQuestionnaire';
import PersonaResultDisplay from './PersonaResultDisplay';
import Button from '../Button';

// Helper to calculate MBTI from scores
const calculateMBTI = (scores: MbtiScore): MbtiType => {
  const e_i = scores.EI.E >= scores.EI.I ? MbtiLetter.E : MbtiLetter.I;
  const n_s = scores.NS.N >= scores.NS.S ? MbtiLetter.N : MbtiLetter.S;
  const t_f = scores.TF.T >= scores.TF.F ? MbtiLetter.T : MbtiLetter.F;
  const j_p = scores.JP.J >= scores.JP.P ? MbtiLetter.J : MbtiLetter.P;
  return `${e_i}${n_s}${t_f}${j_p}` as MbtiType;
};

const PersonaTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(-1); // -1: Welcome, 0: MBTI, 1: Matching Prefs, 2: Hero Refinement, 3: Result
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<string, MbtiLetter | null>>(
    MBTI_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: null }), {})
  );
  const [mbtiScores, setMbtiScores] = useState<MbtiScore>({
    EI: { E: 0, I: 0 },
    NS: { N: 0, S: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  });
  const [currentMbtiQuestionIndex, setCurrentMbtiQuestionIndex] = useState(0);

  const [finalMbti, setFinalMbti] = useState<MbtiType | null>(null);
  const [possibleHeroes, setPossibleHeroes] = useState<OverwatchHero[]>([]);
  const [finalHero, setFinalHero] = useState<OverwatchHero | null>(null);

  const [matchingPreferences, setMatchingPreferences] = useState<
    Omit<PersonaTestResult, 'mbti' | 'hero'> | null
  >(null);

  // Calculate MBTI when all MBTI questions are answered or navigating to next step
  useEffect(() => {
    const allMbtiAnswered = Object.values(mbtiAnswers).every((answer) => answer !== null);
    if (allMbtiAnswered && step === 0 && currentMbtiQuestionIndex === MBTI_QUESTIONS.length) {
      const calculatedMbti = calculateMBTI(mbtiScores);
      setFinalMbti(calculatedMbti);
      setPossibleHeroes(MBTI_HERO_MAP[calculatedMbti] || []);
      setStep(1); // Move to matching preferences
    }
  }, [mbtiAnswers, mbtiScores, step, currentMbtiQuestionIndex]);

  const handleMbtiAnswer = (questionId: string, answer: MbtiLetter) => {
    const question = MBTI_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    // Reset score for previous answer if changed
    const prevAnswer = mbtiAnswers[questionId];
    if (prevAnswer && prevAnswer !== answer) {
      setMbtiScores((prev) => ({
        ...prev,
        [question.dimension]: {
          ...prev[question.dimension],
          [prevAnswer]: prev[question.dimension][prevAnswer as MbtiLetter] - 1,
        },
      }));
    }

    setMbtiAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setMbtiScores((prev) => ({
      ...prev,
      [question.dimension]: {
        ...prev[question.dimension],
        [answer]: prev[question.dimension][answer as MbtiLetter] + 1,
      },
    }));
  };

  const handleMbtiNext = () => {
    if (currentMbtiQuestionIndex < MBTI_QUESTIONS.length - 1) {
      setCurrentMbtiQuestionIndex((prev) => prev + 1);
    } else {
      // All MBTI questions are answered, calculate MBTI and move to next step
      const calculatedMbti = calculateMBTI(mbtiScores);
      setFinalMbti(calculatedMbti);
      const heroes = MBTI_HERO_MAP[calculatedMbti] || [];
      setPossibleHeroes(heroes);
      if (heroes.length === 1) {
        setFinalHero(heroes[0]);
        setStep(1); // Skip hero refinement if only one hero
      } else if (heroes.length > 1) {
        setStep(1); // Move to Matching Prefs, then Hero Refinement after
      } else {
        // Fallback for no hero found (shouldn't happen with current mapping)
        console.warn('No hero found for MBTI:', calculatedMbti);
        setStep(1);
      }
    }
  };

  const handleMbtiPrevious = () => {
    if (currentMbtiQuestionIndex > 0) {
      setCurrentMbtiQuestionIndex((prev) => prev - 1);
    }
  };

  const handleMatchingPreferencesComplete = (data: Omit<PersonaTestResult, 'mbti' | 'hero'>) => {
    setMatchingPreferences(data);
    if (finalHero) {
      setStep(3); // Go directly to result if hero already determined
    } else {
      setStep(2); // Go to hero refinement
    }
  };

  const handleHeroRefinementComplete = (hero: OverwatchHero) => {
    setFinalHero(hero);
    setStep(3); // Move to final result display
  };

  const handleSignupStart = () => {
    if (finalMbti && finalHero && matchingPreferences) {
      const personaResult: PersonaTestResult = {
        mbti: finalMbti,
        hero: finalHero,
        ...matchingPreferences,
      };
      // Store personaResult in local storage or URL hash.
      localStorage.setItem('personaTestResult', JSON.stringify(personaResult));
      navigate('/auth'); // Redirect to login/signup page
    } else {
      console.error('Persona test not fully completed.');
    }
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };


  return (
    <div className="persona-test-page ow-layout ow-content-center bg-gradient-to-b from-[#E8E4F3] to-[#D4E4F7] min-h-screen flex flex-col items-center justify-center p-4">
      {step === -1 && (
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center animate-fade-in">
          <h1 className="ow-heading-h1 text-[#FA9C1D] mb-6">
            환영합니다! 🎮
          </h1>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p className="font-semibold text-xl">
              간단한 질문들 이후 원하는 팀원을 입력해주시면 매칭시켜드릴게요!
            </p>
            <div className="bg-gray-50 p-6 rounded-lg text-left space-y-3">
              <p className="flex items-start">
                <span className="text-[#FA9C1D] font-bold mr-2">1.</span>
                <span>'당신이 오버워치 영웅이라면?' 테스트를 진행합니다.</span>
              </p>
              <p className="flex items-start">
                <span className="text-[#FA9C1D] font-bold mr-2">2.</span>
                <span>로그인합니다.</span>
              </p>
              <p className="flex items-start">
                <span className="text-[#FA9C1D] font-bold mr-2">3.</span>
                <span>원하는 팀원의 조건을 입력하면 최적의 매칭을 찾아드립니다</span>
              </p>
            </div>
            <p className="text-gray-600 text-base mt-4">
              소요 시간: 약 3-5분
            </p>
          </div>
          <Button
            onClick={() => setStep(0)}
            variant="primary"
            className="mt-8 !text-xl !py-4 !px-8"
          >
            시작하기
          </Button>
        </div>
      )}

      {step === 0 && (
        <MBTIQuestionnaire
          questions={MBTI_QUESTIONS}
          answers={mbtiAnswers}
          onAnswer={handleMbtiAnswer}
          onNext={handleMbtiNext}
          onPrevious={handleMbtiPrevious}
          currentQuestionIndex={currentMbtiQuestionIndex}
        />
      )}

      {step === 1 && finalMbti && (
        <MatchingPreferencesForm
          onComplete={handleMatchingPreferencesComplete}
          onPrevious={handlePreviousStep}
        />
      )}

      {step === 2 && finalMbti && possibleHeroes.length > 1 && matchingPreferences && (
        <HeroRefinementQuestionnaire
          mbti={finalMbti}
          initialHeroes={possibleHeroes}
          onComplete={handleHeroRefinementComplete}
          onPrevious={handlePreviousStep}
        />
      )}

      {step === 3 && finalMbti && finalHero && matchingPreferences && (
        <PersonaResultDisplay
          mbti={finalMbti}
          hero={finalHero}
          onSignupStart={handleSignupStart}
        />
      )}
    </div>
  );
};

export default PersonaTestPage;