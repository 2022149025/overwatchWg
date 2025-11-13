import { GoogleGenAI } from "@google/genai";
import { GenerateContentResponse } from "@google/genai"; // Explicitly import
import { geminiRateLimiter, checkRateLimit } from '../lib/rateLimit';
import { logger } from '../lib/logger';

interface TextAnalysisResult {
  keywords: string[];
  sentiment: string;
}

const getGeminiInstance = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("VITE_GEMINI_API_KEY is not set. Gemini API calls will fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

/**
 * Analyzes a given text prompt using the Gemini Flash-Lite model for keywords and sentiment.
 * @param prompt The text to analyze, typically user's matching priority requirements.
 * @returns A promise resolving to TextAnalysisResult containing keywords and sentiment.
 */
export async function analyzeMatchingPreferences(prompt: string): Promise<TextAnalysisResult> {
  // Rate limiting 체크
  checkRateLimit(
    geminiRateLimiter,
    'gemini_analyze',
    'AI 분석 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
  );
  
  const ai = getGeminiInstance();
  try {
    const model = "gemini-2.5-flash-lite"; // Using Flash-Lite for low-latency text analysis
    const fullPrompt = `Analyze the following Overwatch player's matching priority requirements. Extract key preferences, dislikes, and overall sentiment. Provide the output as a JSON object with 'keywords' (an array of strings) and 'sentiment' (a single string, e.g., 'positive', 'negative', 'neutral').\n\nRequirements: "${prompt}"`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: fullPrompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            keywords: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
              description: "Extracted keywords and phrases describing preferences/dislikes.",
            },
            sentiment: {
              type: "STRING",
              description: "Overall sentiment of the requirements (e.g., positive, negative, neutral).",
            },
          },
          propertyOrdering: ["keywords", "sentiment"],
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as TextAnalysisResult;
  } catch (error) {
    logger.error("Error analyzing matching preferences with Gemini:", error);
    // Return a default structure in case of error
    return { keywords: [], sentiment: 'neutral' };
  }
}

/**
 * Generates a match explanation using Gemini AI
 * @param user1 First user's profile
 * @param user2 Second user's profile
 * @param matchScore Calculated match score
 * @returns A promise resolving to a human-readable explanation
 */
export async function generateMatchExplanation(
  user1: any,
  user2: any,
  matchScore: number
): Promise<string> {
  // Rate limiting 체크
  checkRateLimit(
    geminiRateLimiter,
    'gemini_explain',
    'AI 설명 생성 요청이 너무 많습니다.'
  );
  
  const ai = getGeminiInstance();
  try {
    const model = "gemini-2.0-flash-exp";
    const prompt = `두 오버워치 플레이어가 매칭되었습니다. 이들이 잘 맞는 이유를 친근하고 긍정적인 톤으로 2-3문장으로 설명해주세요.

플레이어 1:
- MBTI: ${user1.mbti}
- 주 영웅: ${user1.hero}
- 주 역할: ${user1.main_role}
- 커뮤니케이션 스타일: ${user1.self_communication_style}

플레이어 2:
- MBTI: ${user2.mbti}
- 주 영웅: ${user2.hero}
- 주 역할: ${user2.main_role}
- 커뮤니케이션 스타일: ${user2.self_communication_style}

매칭 점수: ${matchScore}/1.00

설명:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
    });

    return response.text.trim();
  } catch (error) {
    logger.error("Error generating match explanation with Gemini:", error);
    return `매칭 점수 ${Math.round(matchScore * 100)}%로 좋은 궁합입니다! 함께 게임을 즐겨보세요.`;
  }
}
