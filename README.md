# Ripple Platform

**Living data for lasting impact**

A modern, AI-powered donor management and multi-site analytics platform for nonprofits. Designed to reduce manual data entry through automation.

## ✨ Features

### MVP (Version 1.0)
- 🎯 **Donor Management** - Complete profiles with relationship history
- 💰 **Donation Tracking** - Transactions, campaigns, payment methods
- 📊 **Multi-Site Dashboard** - Real-time cross-site comparisons and KPIs
- 📝 **Interaction Logging** - Calls, emails, meetings with AI extraction
- 🤖 **AI Executive Reports** - Weekly automated summaries
- ✉️ **AI Donor Outreach** - Personalized message drafts

### Coming Soon (Version 2.0)
- CSV/Excel import with intelligent field mapping
- Volunteer management
- Program tracking with outcomes
- Advanced forecasting models

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TailwindCSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase Postgres
- **Auth**: Supabase Auth (email/password + magic links)
- **AI**: Hugging Face Inference API
- **Deployment**: Vercel deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase account (free)
- Hugging Face API key (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jimmy2026/ripple-platform.git
cd ripple-platform

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

### Environment Variables

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-only, never exposed to client)

# Hugging Face
HUGGINGFACE_API_KEY=hf_your_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
# 1. Create a new Supabase project at supabase.com
# 2. Run migration
supabase db push

# 3. Seed sample data
supabase db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ripple-platform/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication
│   ├── dashboard/         # Protected routes
│   │   ├── page.tsx       # Main dashboard
│   │   ├── donors/        # Donor management
│   │   ├── donations/     # Donation tracking
│   │   ├── campaigns/     # Campaign management
│   │   ├── interactions/  # Interaction logs
│   │   └── reports/       # AI reports
│   └── api/               # API routes
│       ├── donors/
│       ├── donations/
│       ├── ai/
│       └── analytics/
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   ├── donors/           # Donor components
│   ├── charts/           # Data visualization
│   └── ai/               # AI-powered components
├── lib/                  # Utilities
│   ├── supabase/        # Database client
│   ├── ai/              # AI integration
│   └── analytics/       # Analytics queries
├── types/               # TypeScript definitions
└── supabase/           # Database migrations
    ├── migrations/
    └── seed.sql
```

## 🎨 Design Philosophy

**Aesthetic: Data-Driven Elegance**

Ripple breaks away from generic nonprofit software with:
- **Typography**: Sora (headings) + DM Sans (body)
- **Colors**: Deep ocean blue (#0A2540) + coral accent (#FF6B6B) + mint green (#4ECDC4)
- **Motion**: Smooth number counters, chart transitions, pulse indicators
- **Differentiation**: "Living data" visualizations showing donor engagement recency

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 🚢 Deployment

### Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel
Add all variables from `.env.local` to Vercel project settings.

## 📊 Sample Data

The seed script generates mock nonprofit data for demo purposes.
No real donor information is included.


Perfect for demos and testing!

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## Support

This is an open-source project. For issues, please open a GitHub issue.


## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- AI powered by [Hugging Face](https://huggingface.co/)
- Inspired by real nonprofits making real impact

---

**Built with care for nonprofits everywhere.**  
*Living data for lasting impact.*
