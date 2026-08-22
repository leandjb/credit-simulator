# Family Credit Simulator

A tool for families to simulate loan payments together. See how each person's contribution shapes the payoff timeline — one slider at a time.

![License](https://img.shields.io/badge/license-GPLv3-blue)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/credit-simulator.git
cd credit-simulator

# Install dependencies (requires pnpm)
pnpm install

# Open the app
# Simply open index.html in your browser, or use a local server:
npx serve .
```

## Usage

### Loan Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Loan Amount** | Total money borrowed | $300,000,000 COP |
| **Term** | Number of months to pay back | 60 months (5 years) |
| **Monthly Rate** | Interest rate per month | 1.87% |
| **Annual Rate (EA)** | Effective annual rate (auto-calculated) | 25% EA |

The monthly and annual rates are linked — editing one updates the other automatically using the effective interest convention: `EA = (1 + monthly)^12 - 1`.

### Persons

Add family members who will contribute to the loan payment:

- **Name**: Identifies each person
- **Percentage**: How much of the monthly payment each person pays (must sum to 100%)
- **Extra/month**: Additional voluntary contribution that shortens the loan

Click **+ Add Person** to add up to 6 persons. Click **Distribute Equally** to split percentages evenly.

### Currency

Switch between **USD** and **COP** using the currency toggle. Amounts format automatically:
- USD: $100,000.00 (2 decimals)
- COP: $100.000 (no decimals, Colombian peso convention)

### Chart

The chart shows three visual elements:

1. **Blue line** — Remaining balance over time (declining curve)
2. **Green dashed line** — Cumulative amount paid (rising curve)
3. **Colored bands** — Per-person contribution areas (stacked)

The **yellow marker** shows the **equilibrium point** — the month where you've paid more than you still owe.

### KPI Summary

Below the chart, four key metrics update in real-time:

| KPI | Meaning |
|-----|---------|
| **Monthly Payment** | Fixed installment amount per month |
| **Payoff** | Real payoff month (and months saved vs. nominal term) |
| **Equilibrium** | Month where cumulative paid ≥ remaining balance |
| **Total Interest** | Total interest paid over the life of the loan |

## Key Concepts

### Amortization

Amortization is the process of paying off a loan with regular fixed payments. Each payment covers two parts:

1. **Interest** — Calculated on the remaining balance (higher at the start)
2. **Principal** — The remainder of the payment (reduces the balance)

This is called the **Price system** (or French amortization). Early payments are mostly interest; later payments are mostly principal.

### Equilibrium Point

The equilibrium point is the month where your **cumulative payments exceed your remaining balance**. Before this point, you owe more than you've paid. After it, you've paid more than you owe.

This is a psychological milestone — it means the loan is "mostly paid" even though monthly payments continue.

### EA (Effective Annual Rate)

The **Effective Annual Rate (EA)** is the real yearly interest rate, accounting for monthly compounding. In Colombia, consumer loans typically range from 20–35% EA.

Formula: `EA = (1 + monthly_rate)^12 - 1`

Example: A 1.87% monthly rate equals approximately 25% EA.

### Extra Payments

Extra payments are voluntary additional contributions that go directly toward the principal. They:

- **Shorten the loan term** — You pay off faster
- **Reduce total interest** — Less balance means less interest accrues
- **Shift the equilibrium point** — It happens earlier

Each person can set their own extra monthly amount.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no framework)
- SVG chart (no chart library)
- Glassmorphism design system
- Jest for testing

## License

GPLv3 — See [LICENSE](LICENSE) for details.
