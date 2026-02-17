import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch data for the report
    const [donorsResult, donationsResult, campaignsResult] = await Promise.all([
      supabase.from('donors').select('*'),
      supabase.from('donations').select('*').order('donation_date', { ascending: false }),
      supabase.from('campaigns').select('*').order('total_raised', { ascending: false }),
    ])

    const donors = donorsResult.data || []
    const donations = donationsResult.data || []
    const campaigns = campaignsResult.data || []

    // Calculate statistics
    const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0)
    const totalDonors = donors.length
    const avgDonation = donations.length > 0 ? totalRaised / donations.length : 0

    // Get last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentDonations = donations.filter(d => new Date(d.donation_date) >= sevenDaysAgo)
    const weekTotal = recentDonations.reduce((sum, d) => sum + Number(d.amount), 0)

    // Get last 30 days for comparison
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const lastMonthDonations = donations.filter(d => new Date(d.donation_date) >= thirtyDaysAgo)
    const monthTotal = lastMonthDonations.reduce((sum, d) => sum + Number(d.amount), 0)

    // At-risk donors (no donation in 90+ days but have donated before)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const atRiskDonors = donors.filter(d => 
      d.last_donation_date && 
      new Date(d.last_donation_date) < ninetyDaysAgo &&
      d.donation_count > 1
    ).slice(0, 5)

    // Top campaigns
    const topCampaigns = campaigns.slice(0, 3).map(c => ({
      name: c.name,
      raised: c.total_raised,
      goal: c.goal_amount
    }))

    // Build the AI prompt
    const prompt = `You are an executive assistant for a nonprofit organization. Generate a concise weekly executive summary report.

DATA SUMMARY:
- Total Raised (All Time): $${totalRaised.toLocaleString()}
- Total Donors: ${totalDonors}
- Average Donation: $${Math.round(avgDonation)}
- This Week's Donations: $${weekTotal.toLocaleString()} (${recentDonations.length} donations)
- This Month's Total: $${monthTotal.toLocaleString()}
- At-Risk Donors: ${atRiskDonors.length} donors haven't given in 90+ days
- Top Campaign: ${topCampaigns[0]?.name || 'N/A'} - $${topCampaigns[0]?.raised || 0} raised

TOP CAMPAIGNS:
${topCampaigns.map(c => `- ${c.name}: $${c.raised} / $${c.goal} (${Math.round((c.raised / c.goal) * 100)}%)`).join('\n')}

AT-RISK DONORS (Sample):
${atRiskDonors.slice(0, 3).map(d => `- ${d.first_name} ${d.last_name}: Last gift ${new Date(d.last_donation_date).toLocaleDateString()}, Total: $${d.total_donated}`).join('\n')}

Generate a professional 3-paragraph executive summary that includes:
1. Overall Performance - Highlight this week's results and trends
2. Key Insights - Notable patterns or concerns from the data
3. Recommended Actions - Top 3 specific next steps for the team

Keep it concise, mission-focused, and actionable. Use a warm but professional tone.`

    // Call Hugging Face API
    const hfApiKey = process.env.HUGGINGFACE_API_KEY
    if (!hfApiKey) {
      throw new Error('Hugging Face API key not configured')
    }

    const hfResponse = await fetch(
      'https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    )

    if (!hfResponse.ok) {
      const error = await hfResponse.text()
      console.error('HF API Error:', error)
      throw new Error(`AI API error: ${hfResponse.status}`)
    }

    const hfResult = await hfResponse.json()
    const generatedText = hfResult[0]?.generated_text || 'Report generation failed'

    // Save the report to database
    const reportData = {
      organization_id: '11111111-1111-1111-1111-111111111111', // From seed data
      report_type: 'weekly_executive',
      title: `Weekly Executive Report - ${new Date().toLocaleDateString()}`,
      content: generatedText,
      metadata: {
        stats: {
          totalRaised,
          totalDonors,
          weekTotal,
          monthTotal,
          atRiskCount: atRiskDonors.length,
        },
        topCampaigns,
      },
      period_start: sevenDaysAgo.toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0],
      generated_by: session.user.id,
    }

    const { data: savedReport, error: saveError } = await supabase
      .from('ai_reports')
      .insert(reportData)
      .select()
      .single()

    if (saveError) {
      console.error('Error saving report:', saveError)
      // Don't fail the whole request, just return the generated content
    }

    return NextResponse.json({
      success: true,
      report: {
        id: savedReport?.id,
        title: reportData.title,
        content: generatedText,
        stats: reportData.metadata.stats,
        topCampaigns: reportData.metadata.topCampaigns,
        atRiskDonors: atRiskDonors.slice(0, 5),
      }
    })

  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}
