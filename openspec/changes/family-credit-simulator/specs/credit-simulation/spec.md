## Purpose

Defines the amortization math engine that turns loan parameters (amount, term, rate, persons, split percentages, extra payments) into a Price-system payment schedule with per-person shares, the equilibrium point, and the real payoff month.

## ADDED Requirements

### Requirement: Price amortization schedule generation
The engine SHALL generate a full monthly amortization schedule using the Price (French) system: fixed installment computed from principal, monthly rate, and term; each month's interest SHALL accrue on the remaining balance; the principal portion SHALL be the remainder of the installment.

#### Scenario: Standard schedule
- **WHEN** the engine is given amount 100,000, term 12 months, and monthly rate 1%
- **THEN** the schedule has 12 rows, each installment is equal (to the cent), the final balance is 0, and each month's interest plus principal equals the installment

#### Scenario: Zero interest rate
- **WHEN** the monthly rate is 0
- **THEN** every installment equals amount / term with no interest portion, and the schedule still completes at term

### Requirement: Linked monthly and annual rates
The engine SHALL accept a monthly interest rate and derive the annual rate with the effective convention `(1 + i)^12 - 1`, and vice versa. Both directions SHALL be exact inverses of each other.

#### Scenario: Monthly to annual
- **WHEN** the monthly rate is 1%
- **THEN** the annual rate is (1.01)^12 - 1 ≈ 12.68%

#### Scenario: Annual to monthly round-trip
- **WHEN** an annual rate is converted to monthly and back to annual
- **THEN** the result equals the original annual rate within floating-point tolerance

### Requirement: Per-person split of the payment
The engine SHALL split each month's installment among persons by their configured percentages. Percentages SHALL sum to 100%; a configuration whose sum deviates from 100% SHALL be rejected with a validation error identifying the offending group.

#### Scenario: Valid split
- **WHEN** 3 persons are configured with 50%, 30%, 20% and the installment is 1,000
- **THEN** each month's per-person amounts are 500, 300, and 200 respectively

#### Scenario: Invalid split
- **WHEN** percentages sum to 110%
- **THEN** the engine returns a validation error and produces no schedule

### Requirement: Extra payments shorten the term
The engine SHALL support an optional extra monthly amount per person. Extra amounts SHALL be applied to principal after the scheduled installment, and the schedule SHALL be recomputed month by month until the balance reaches zero, producing a real payoff month that can be earlier than the nominal term.

#### Scenario: Over-contribution pays off early
- **WHEN** a 100,000 loan at 1% monthly over 60 months receives a combined extra payment of 1,000 per month
- **THEN** the real payoff month is earlier than 60 and the final month's payment is prorated to the remaining balance

#### Scenario: Final month proration
- **WHEN** the balance remaining is less than the installment plus extras in the last month
- **THEN** the final payment equals exactly the remaining balance plus that month's interest and no negative balance is produced

### Requirement: Under-capacity warning
When the combined monthly contribution (installment shares plus extras) is insufficient for the installment to amortize the loan — only possible via misconfigured inputs — the engine SHALL report a validation error rather than looping.

#### Scenario: Degenerate inputs
- **WHEN** the term is set such that the computed installment cannot reduce the balance (e.g. term exceeds a platform maximum)
- **THEN** the engine returns a validation error and produces no schedule

### Requirement: Equilibrium point computation
The engine SHALL compute the equilibrium month: the first month where cumulative total paid (installments plus extras) is greater than or equal to the remaining balance after that month. When no month satisfies the condition, the engine SHALL report that the equilibrium point does not exist.

#### Scenario: Equilibrium exists
- **WHEN** a standard schedule is generated for a mid-range loan
- **THEN** the equilibrium month is reported with its cumulative-paid and remaining-balance values, and cumulative paid before that month is less than the balance

#### Scenario: Equilibrium never reached
- **WHEN** cumulative paid never catches up with the declining balance within the schedule
- **THEN** the engine reports the absence of an equilibrium point rather than an approximate month

### Requirement: Summary metrics
The engine SHALL expose summary metrics: monthly installment, total paid, total interest, real payoff month, nominal term, and months saved (nominal minus real payoff, zero when none).

#### Scenario: Summary with extras
- **WHEN** extras shorten a 60-month loan to 47 months
- **THEN** the summary reports real payoff month 47, nominal term 60, and months saved 13

### Requirement: Input validation
The engine SHALL validate inputs before computing: amount greater than zero, term between 1 and 360 months inclusive, monthly rate between 0% and 10% inclusive, at least 1 and at most 6 persons, each extra payment non-negative, and percentages summing to 100%. Invalid input SHALL produce a descriptive validation error naming the offending field.

#### Scenario: Amount out of range
- **WHEN** the amount is 0 or negative
- **THEN** a validation error names the amount field and no schedule is produced

#### Scenario: Term at maximum boundary
- **WHEN** the term is exactly 360 months
- **THEN** the input is accepted and a schedule is produced
