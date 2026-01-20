# Custom Scenarios & Export Features

Major feature additions to DeepXone Decisions™ simulator.

---

## What's New

### 1. Custom Scenario Builder 🎯

Users can now create their own business scenarios instead of being limited to the 5 pre-built ones.

#### Features:
- **Title Input** (100 char limit)
- **Context Input** (1000 char limit) - Rich text area for detailed scenarios
- **3 Example Scenarios** - One-click templates for inspiration
- **Validation** - Won't let you submit empty scenarios
- **Visual Indicator** - Custom scenario card shows pulsing dot when loaded

#### User Flow:
1. Click "Create Custom Scenario" button (dashed border card)
2. Modal opens with title + context inputs
3. Type scenario OR click example to pre-fill
4. Click "Use This Scenario"
5. Custom scenario loads and you proceed to select mode
6. AI generates decision for YOUR scenario

#### Example Custom Scenarios Included:
- **Vendor Contract Renewal** - Price increase negotiation
- **Team Expansion Request** - Resource allocation decision
- **Customer Feature Request** - Prioritization vs. churn risk

### 2. Export & Share Decisions 📤

After getting an AI decision, users can now export/share the results.

#### Export Options:
1. **Copy to Clipboard** - Formatted text report
2. **Download TXT** - Saves timestamped file
3. **Share** - Native share dialog (mobile) or fallback to copy

#### Export Format:
```
DeepXone Decisions™ - AI Decision Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENARIO
[Full scenario context]

DECISION MODE: [Speed-first/Compliance/etc]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECISION
[AI decision]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METRICS
• Confidence: XX%
• Risk Level: LOW/MEDIUM/HIGH
• Business Impact: [Impact text]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REASONING
[AI reasoning]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METADATA
• AI Provider: OPENAI/ANTHROPIC
• Response Time: 2.3s
• Generated: [timestamp]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DeepXone Decisions™
Control the outcome, not just the output.
```

#### Visual Design:
- Three subtle gray buttons (Copy, Download, Share)
- Icons from Lucide React
- "Copied!" confirmation with green checkmark
- Positioned top-right of outcome section

---

## Sales Impact

### Before:
- Prospects limited to 5 demo scenarios
- No way to test their actual use cases
- No way to save/share results
- Hard to demonstrate on real problems

### After:
- **Prospects can test THEIR scenarios** - Huge for demos
- **Personalized experience** - Feels custom-built
- **Shareable results** - Can forward to colleagues
- **Downloadable reports** - Keep for records

### Demo Script Example:

**Prospect:** "We need AI for pricing approvals"

**You:** "Type in a real pricing scenario right now."

*Prospect enters: "Sales rep wants 30% discount on $200k deal..."*

**You:** "Now watch what happens with Compliance-first vs Customer-first modes"

*AI generates two different decisions in real-time*

**Prospect:** "Wow. Can I save this?"

**You:** "Download it, share it with your team, whatever you need."

This turns a generic demo into a **personalized proof-of-concept**.

---

## Technical Implementation

### New Components:

1. **`CustomScenarioInput.tsx`**
   - Full-screen modal for scenario creation
   - Title + context inputs with character counters
   - 3 pre-loaded example scenarios
   - Submit/cancel actions
   - Animated entrance/exit

2. **`ExportDecision.tsx`**
   - Copy/Download/Share buttons
   - Formats decision as readable text report
   - Handles clipboard API, download blob, native share
   - Success confirmation states

### Updated Components:

**`DecisionSimulatorAI.tsx`**
- Added `customScenario` state
- Added `showCustomInput` modal state
- "Create Custom" button in scenario grid (6th card)
- Custom scenario indicator (pulsing dot)
- Conditional rendering for custom vs pre-built scenarios
- Export buttons in outcome section

### State Management:

```typescript
const [customScenario, setCustomScenario] = useState<Scenario | null>(null)
const [showCustomInput, setShowCustomInput] = useState(false)

// Prioritizes custom over pre-built
const currentScenario = customScenario || scenarios.find(s => s.id === selectedScenario)
```

---

## User Experience Flow

### Creating Custom Scenario:

1. User clicks **"Create Custom Scenario"** card (has plus icon, dashed border)
2. Modal slides in with animated entrance
3. User sees:
   - Title input field
   - Large context textarea
   - 3 clickable example scenarios
   - Character counters
4. User types OR clicks example
5. Submit button activates when both fields filled
6. Click "Use This Scenario"
7. Modal closes, custom scenario card now shows:
   - User's title
   - "Custom scenario loaded" message
   - Pulsing blue dot indicator
   - Selected border (primary color)
8. User proceeds to Step 2 (select mode)

### Exporting Results:

1. User gets AI decision (Step 3 outcome)
2. Three export buttons appear top-right:
   - **Copy** - Instant clipboard copy with confirmation
   - **Download** - Saves TXT file named `deepxone-decision-[timestamp].txt`
   - **Share** - Native share on mobile, copy fallback on desktop
3. User can share with team, forward to manager, etc.

---

## Business Value

### For Prospects:
- ✅ Test product with their real scenarios
- ✅ See immediate value on their problems
- ✅ Share results with decision-makers
- ✅ Keep records for comparison

### For Sales:
- ✅ Personalized demos without custom engineering
- ✅ Higher engagement (prospects type their own scenarios)
- ✅ Viral sharing (exported reports get forwarded)
- ✅ Proof-of-concept in 5 minutes

### For Product:
- ✅ Learn what scenarios prospects care about
- ✅ Build library of real-world use cases
- ✅ Understand industry-specific needs
- ✅ Feature request validation

---

## Edge Cases Handled

1. **Empty Input** - Submit button disabled until both fields have content
2. **Character Limits** - Title 100 chars, context 1000 chars with counters
3. **Switching Scenarios** - Selecting pre-built clears custom, vice versa
4. **Modal State** - Can cancel custom input, returns to original state
5. **Copy Failure** - Falls back gracefully if clipboard API fails
6. **Share Unsupported** - Desktop browsers fall back to copy
7. **Long Scenarios** - Textarea auto-expands with scroll

---

## Future Enhancements (Not Yet Built)

### Lead Capture (Recommended Next):
- Email gate before custom scenarios
- "Enter email to test custom scenario"
- Saves to database for follow-up
- Sends email with decision results

### Scenario Library:
- Save custom scenarios to account
- Browse community scenarios
- Industry-specific scenario packs
- Import/export scenario bundles

### Advanced Export:
- PDF export with branding
- Excel/CSV for bulk analysis
- Email results directly
- Slack/Teams integration

### Comparison Mode:
- Run same scenario through all 4 modes
- Side-by-side comparison table
- Diff highlighting
- Export comparison report

---

## Files Modified/Created

### New Files:
- `src/components/CustomScenarioInput.tsx` (150 lines)
- `src/components/ExportDecision.tsx` (160 lines)

### Modified Files:
- `src/components/DecisionSimulatorAI.tsx`
  - Added custom scenario state and handlers
  - Added 6th scenario card (Create Custom)
  - Integrated CustomScenarioInput modal
  - Integrated ExportDecision buttons

---

## Testing Checklist

- [x] Create custom scenario
- [x] Use example scenario templates
- [x] Submit custom scenario
- [x] Custom scenario indicator shows
- [x] AI generates decision for custom scenario
- [x] Copy to clipboard works
- [x] Download TXT file works
- [x] Share button works (or falls back to copy)
- [x] Switch between custom and pre-built scenarios
- [x] Cancel custom scenario creation
- [x] Character counters accurate
- [x] Empty submission blocked
- [x] Animations smooth

---

## Demo Ready! 🎉

The simulator now supports:
1. ✅ 5 pre-built scenarios
2. ✅ Unlimited custom scenarios
3. ✅ 4 decision modes with visual identities
4. ✅ Real AI integration (OpenAI/Anthropic)
5. ✅ Export/share/download results
6. ✅ Animated UI with professional polish
7. ✅ Response time tracking
8. ✅ Visual risk gauges
9. ✅ Count-up animations
10. ✅ Mode-colored theming

This is now a **full MVP** ready for customer demos.

Next high-value additions:
1. **Email capture** before custom scenarios
2. **Deploy to production** (Vercel)
3. **Custom domain** (deepxone.com)
4. **Analytics** (track usage)
