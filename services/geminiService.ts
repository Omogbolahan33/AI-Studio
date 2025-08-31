
import { GoogleGenAI, Type } from "@google/genai";
import type { Dispute, AIAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (!API_KEY) {
  // A real app would handle this more gracefully, but for this context,
  // we'll throw an error if the key is missing.
  // The environment is expected to provide this key.
  console.warn("API_KEY environment variable not set. AI features will not work.");
} else {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

const schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, neutral summary of the dispute.",
    },
    buyer_claims: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key claims or points made by the buyer.",
    },
    seller_claims: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of key claims or points made by the seller.",
    },
    policy_violations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of any potential platform policy violations by either party.",
    },
    suggested_resolution: {
      type: Type.STRING,
      description: "A suggested, fair resolution based on the evidence. E.g., 'Full refund to buyer', 'Release funds to seller', 'Partial refund of 50% to buyer'.",
    },
  },
  required: ["summary", "buyer_claims", "seller_claims", "policy_violations", "suggested_resolution"],
};

export const analyzeDispute = async (dispute: Dispute): Promise<AIAnalysis | null> => {
  if (!API_KEY || !ai) {
    // Return a mock response if API key is not available
    return {
      summary: "This is a mock analysis because the API key is not configured. The dispute involves an item not matching its description.",
      buyer_claims: ["The item has a crack that was not shown in the photos.", "The packaging was not damaged, suggesting the item was sent in this condition."],
      seller_claims: ["The item was in perfect condition when shipped.", "Damage must have occurred during transit."],
      policy_violations: ["Potential misrepresentation of item condition by the seller."],
      suggested_resolution: "Suggest a 50% partial refund to the buyer as a compromise."
    };
  }

  const chatHistoryText = dispute.chatHistory
    .map(chat => `${chat.sender}: "${chat.message}"`)
    .join('\n');
    
  const prompt = `
    Analyze the following marketplace dispute and provide a structured resolution suggestion.

    Dispute Details:
    - Reason for dispute: ${dispute.reason}
    - Buyer: ${dispute.buyer}
    - Seller: ${dispute.seller}

    Chat History:
    ${chatHistoryText}

    Task:
    Act as an impartial mediator. Based on the provided information, analyze the dispute. Identify the main points from each party, check for any policy violations (like misrepresenting an item), and suggest a fair resolution.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIAnalysis;

  } catch (error) {
    console.error("Error analyzing dispute with Gemini API:", error);
    // In case of an API error, return null or a specific error object
    return null;
  }
};
