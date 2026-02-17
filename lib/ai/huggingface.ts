/**
 * Hugging Face API Integration
 * Free tier: 30 requests/hour per model
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models'
const DEFAULT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'

export async function generateText(
  prompt: string,
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  }
): Promise<string> {
  const model = options?.model || DEFAULT_MODEL
  const apiKey = process.env.HUGGINGFACE_API_KEY
  
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY not configured')
  }

  const response = await fetch(`${HF_API_URL}/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: options?.maxTokens || 500,
        temperature: options?.temperature || 0.7,
        return_full_text: false,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HF API error: ${error}`)
  }

  const result = await response.json()
  return result[0]?.generated_text || ''
}

export async function extractJSON(text: string): Promise<any> {
  // Try to extract JSON from markdown code blocks or raw text
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                   text.match(/\{[\s\S]*\}/)
  
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1] || jsonMatch[0])
    } catch (e) {
      throw new Error('Failed to parse JSON from AI response')
    }
  }
  
  throw new Error('No JSON found in response')
}
