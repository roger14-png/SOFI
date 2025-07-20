
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeSpending = async (transactions: Transaction[], prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Please set the API_KEY environment variable to use the Smart Assistant.";
  }

  const model = 'gemini-2.5-flash';

  const transactionData = transactions
    .filter(t => t.status === 'Completed')
    .map(t => `- To ${t.payee} for $${t.amount.toFixed(2)} on ${t.date} (Memo: ${t.memo})`)
    .join('\n');

  const fullPrompt = `
    You are a friendly and insightful financial assistant for a digital banking application.
    Analyze the user's completed transaction history provided below to answer their question.
    Provide a concise, helpful, and easy-to-understand summary. Do not just list the transactions.
    
    User's Question: "${prompt}"

    Completed Transaction History:
    ${transactionData}

    Your analysis:
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            temperature: 0.5,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while analyzing your spending. Please try again later.";
  }
};

export const getSecurityTips = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        return "API Key not configured. AI features are disabled.";
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
        You are a cybersecurity expert providing helpful advice within a digital banking app. 
        Generate 3 concise, actionable security tips for users to keep their account safe.
        The tone should be reassuring and professional.
        Format the response as a simple string, with each tip on a new line started with a bullet point (e.g., • Tip 1...).
        Do not include a heading or any introductory text.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for security tips:", error);
        return "• Always use a strong, unique password for your financial accounts.\n• Enable two-factor authentication (2FA) if available.\n• Be wary of phishing emails asking for your login details.";
    }
};