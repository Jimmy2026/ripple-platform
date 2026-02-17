/**
 * AI Prompt Templates for Ripple Platform
 * 
 * These prompts are designed for Hugging Face's free tier models
 * Optimized for: mistralai/Mistral-7B-Instruct-v0.2
 */

export const WEEKLY_REPORT_PROMPT = (data: {
  totalRaised: number
  donorCount: number
  avgDonation: number
  sitesData: Array<{ name: string; raised: number }>
  atRiskDonors: Array<{ name: string; lastDonation: string }>
}) => `You are an executive assistant for a nonprofit. Generate a concise 3-paragraph weekly summary.

Data:
- Total Raised: $${data.totalRaised.toLocaleString()}
- Active Donors: ${data.donorCount}
- Avg Donation: $${data.avgDonation}
- Top Site: ${data.sitesData[0]?.name} ($${data.sitesData[0]?.raised})
- At-Risk Donors: ${data.atRiskDonors.length}

Write a professional, mission-focused summary highlighting:
1. Overall performance
2. Notable trends
3. Top 3 recommended actions`

export const DONOR_OUTREACH_PROMPT = (donor: {
  firstName: string
  lastName: string
  totalDonated: number
  lastDonation: string
  tags: string[]
}, tone: 'warm' | 'professional' | 'urgent' = 'warm') => `Draft a ${tone} outreach email to ${donor.firstName} ${donor.lastName}.

Profile:
- Total Donated: $${donor.totalDonated}
- Last Donation: ${donor.lastDonation}
- Tags: ${donor.tags.join(', ')}

Generate:
- Subject line (under 60 chars)
- 3-paragraph email that:
  1. Thanks them specifically
  2. Shares relevant update
  3. Subtle invitation (no hard ask)

Format as JSON:
{"subject": "...", "body": "..."}`

export const INTERACTION_EXTRACTION_PROMPT = (notes: string) => `Extract structured data from these meeting notes:

"${notes}"

Return JSON only:
{
  "summary": "2-3 sentence summary",
  "outcome": "positive|neutral|negative|follow_up_needed",
  "followUpDate": "YYYY-MM-DD or null",
  "suggestedTags": ["tag1", "tag2"],
  "keyPoints": ["point1", "point2"]
}`
