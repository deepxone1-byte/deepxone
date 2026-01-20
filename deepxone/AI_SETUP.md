# AI Integration Setup Guide

The DeepXone Decisions simulator is now powered by real AI! Follow these steps to configure it.

## Quick Start

### 1. Get Your API Keys

You'll need an API key from either **Anthropic** (recommended) or **OpenAI** (or both).

#### Option A: Anthropic Claude (Recommended)
1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

#### Option B: OpenAI GPT-4
1. Go to https://platform.openai.com/api-keys
2. Create an account or sign in
3. Click **Create new secret key**
4. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables

1. Open the file `.env.local` in the `deepxone` directory
2. Add your API key(s):

```bash
# For Anthropic Claude (recommended)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# OR for OpenAI
OPENAI_API_KEY=sk-your-key-here

# Set which provider to use (anthropic or openai)
AI_PROVIDER=anthropic
```

**Note**: You only need ONE provider to work, but you can add both if you want to compare them.

### 3. Restart the Development Server

The server will automatically detect the new environment variables:

```bash
# If running, the server will hot-reload
# If not, start it with:
npm run dev
```

## Testing the AI Integration

1. Open http://192.168.2.241:6001 in your browser
2. Choose a business scenario
3. Select a decision mode
4. Click "**Simulate with AI**"
5. Watch as the AI generates a real-time decision!

You should see:
- A "Powered by Anthropic" or "Powered by OpenAI" badge
- Real AI-generated decisions based on the mode you selected
- Dynamic confidence scores
- Risk assessments
- Business impact analysis

## How It Works

### Decision Modes Use Different System Prompts

Each decision mode has a specialized AI personality:

- **Speed-first**: Optimizes for fast resolution, minimal friction
- **Risk-balanced**: Weighs all factors equally
- **Compliance-first**: Strict policy adherence, legal protection
- **Customer-first**: Maximizes satisfaction and retention

The AI sees the same scenario but makes different decisions based on its programming!

### What Gets Sent to the AI

For each simulation:
1. The scenario context (customer message, deal details, etc.)
2. A specialized system prompt for the selected decision mode
3. Instructions to return structured output (decision, confidence, risk, etc.)

### Confidence & Risk Scoring

The AI itself determines:
- **Confidence**: How certain it is about the decision (0-100%)
- **Risk Level**: Low, medium, or high exposure
- **Business Impact**: One-line summary of consequences
- **Reasoning**: Why this decision aligns with the mode

## Switching Providers

To switch between AI providers:

1. Edit `.env.local`
2. Change `AI_PROVIDER=anthropic` to `AI_PROVIDER=openai` (or vice versa)
3. Save the file
4. The server will auto-reload

## Cost Estimates

### Anthropic Claude
- Model: claude-3-5-sonnet-20241022
- Cost per decision: ~$0.002-0.005
- Best for: Complex reasoning, nuanced decisions

### OpenAI GPT-4
- Model: gpt-4-turbo-preview
- Cost per decision: ~$0.01-0.02
- Best for: Broad knowledge, creative responses

Both are very affordable for demos and testing.

## Troubleshooting

### "API_KEY not configured" error
- Check that you've added the key to `.env.local`
- Restart the dev server
- Make sure the key starts with `sk-` (OpenAI) or `sk-ant-` (Anthropic)

### Response is taking too long
- Normal response time is 2-5 seconds
- Check your internet connection
- Anthropic is typically faster than OpenAI

### AI response doesn't match the format
- The parser is robust and will extract what it can
- If you see missing fields, check the API console logs
- File an issue if it persists

## Next Steps

Now that AI is working:

1. ✅ Try all 5 scenarios with all 4 decision modes (20 combinations!)
2. ✅ Compare the same scenario across different modes
3. ✅ Notice how risk/confidence changes
4. 🔜 Add custom scenarios (coming soon)
5. 🔜 Upload company policies for policy-aware decisions
6. 🔜 Export decisions to PDF reports

---

**DeepXone Decisions™** - Now powered by real AI decision intelligence.
