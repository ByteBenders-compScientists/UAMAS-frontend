// src/services/groqOCR.service.ts

interface OCRResult {
  success: boolean;
  extractedText: string;
  error?: string;
}

/**
 * Extract text from image using Groq's Llama 4 Vision model
 * @param imageFile - The image file to extract text from
 * @returns Promise with extracted text or error
 */
export async function extractTextFromImage(imageFile: File): Promise<OCRResult> {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Prepare the API request
    const apiKey =  process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Use Llama 4 Scout for faster, cost-effective OCR
        // Or use 'meta-llama/llama-4-maverick-17b-128e-instruct' for better accuracy with multilingual support
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract ALL the text from this image EXACTLY as written. Include:
- All handwritten text
- All printed text
- Mathematical formulas and equations
- Numbers, symbols, and special characters
- Maintain the original line breaks and formatting as much as possible

Return ONLY the extracted text, nothing else. If the image contains no text, respond with "NO_TEXT_FOUND".`
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        temperature: 0.1, // Low temperature for more consistent extraction
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0]?.message?.content?.trim() || '';

    if (extractedText === 'NO_TEXT_FOUND') {
      return {
        success: false,
        extractedText: '',
        error: 'No text was detected in the image. Please ensure the image contains readable text.',
      };
    }

    return {
      success: true,
      extractedText,
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      extractedText: '',
      error: error instanceof Error ? error.message : 'Failed to extract text from image',
    };
  }
}

/**
 * Convert File to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file before OCR processing
 */
export function validateImageForOCR(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, etc.)',
    };
  }

  // Check file size (max 20MB for Groq vision models)
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file is too large. Please upload an image smaller than 20MB',
    };
  }

  return { valid: true };
}