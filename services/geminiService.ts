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

export const generateDescriptionFromMedia = async (mimeType: string, mediaData: string, categoryName?: string): Promise<string | null> => {
  if (!API_KEY || !ai) {
    console.warn("API key not configured. Using mock description.");
    // Return a mock response for development without API key
    return new Promise(resolve => setTimeout(() => resolve("This is a mock description for a cool item, generated because the API key is missing. It looks like a great product!"), 1500));
  }

  let prompt = "You are an expert in e-commerce and marketing. Analyze this image or video of an item for sale. Your task is to identify the item and write a short, appealing, and professional description for a social marketplace listing. Be enthusiastic but honest. Do not mention a specific price.";

  if (categoryName) {
    const lowerCategory = categoryName.toLowerCase();
    if (lowerCategory.includes('real estate')) {
        prompt += "\n\nThis is a real estate listing. Describe the property type (e.g., house, apartment, commercial space), its architectural style, and key features like number of bedrooms or bathrooms if they can be inferred. Comment on the overall condition and atmosphere. Mention any visible outdoor features like a garden, balcony, or yard. Use inviting language suitable for potential buyers or renters.";
    } else if (lowerCategory.includes('electronics')) {
        prompt += "\n\nThis is an electronics item. Try to identify the brand and model. Describe its condition (e.g., new, like-new, used), key specs or features, and its primary function. Mention any visible accessories included in the image.";
    } else if (lowerCategory.includes('home goods')) {
        prompt += "\n\nThis item is for the home (e.g., furniture, appliance). Describe its function, style (e.g., modern, vintage), condition, and materials if identifiable. Suggest how it could fit into a home, for example, 'a perfect centerpiece for a living room' or 'a reliable washing machine for a family'.";
    } else {
        prompt += "\n\nFor this item, focus on describing its key features, its physical condition, and its potential uses for a buyer.";
    }
  } else {
      prompt += "\n\nFor this item, focus on describing its key features, its physical condition, and its potential uses for a buyer.";
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: mediaData,
      },
    };
    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    return null;
  }
};

export const generateAvatar = async (prompt: string): Promise<string[] | null> => {
    if (!API_KEY || !ai) {
        console.warn("API key not configured. Using mock avatar.");
        // Return mock avatar images for development
        return new Promise(resolve => setTimeout(() => resolve([
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2QxYzRmNSIvPjxwYXRoIGQ9Ik01MCAyMUMzMy40MyAyMSAyMCAzNC40MyAyMCA1MVMzMy40MyA3OSA1MCA3OSA2Mi40OSA3My4xIDY4LjU0IDYySDUwVjU3aDIzLjU0Yy40Ni0yLjUgLjctNS4xMy43LTcuOTIgMC0xMS42NS03LjE0LTIxLjY0LTE3LjM0LTI1LjA4em0wIDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzM0OTg4YyIvPjxwYXRoIGQ9Ik0zMyA2N2gxM2wtMy0xMGMtNC0xMyAxMi0xNyAxMi0xNy0yMS01LTIxIDE5LTEyIDE3bC0zIDEwaDEzbDEzLTIwSDE5bDE0IDIwem0zMy00N2MyLTIgNS0yIDcgMGwyIDJjMiAyIDIgNSAwIDdsLTIgMmMtMiAyLTUgMi03IDBsLTItMmMtMi0yLTItNSAwLTd6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
        ]), 1500));
    }
    
    const fullPrompt = `A modern, minimalist avatar of ${prompt}. Flat vector art style, clean lines, vibrant colors, suitable for a social media profile picture. No text.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 2,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
        }
        return null;
    } catch (error) {
        console.error("Error generating avatar with Gemini API:", error);
        return null;
    }
}