## Purpose

Provides English and Spanish documentation for the Family Credit Simulator: installation, usage, loan concepts, and chart interpretation.

## ADDED Requirements

### Requirement: English README
The project SHALL include a `README.md` in English covering: project description, installation steps, usage guide (loan parameters, person cards, currency switcher, chart), key financial concepts (amortization, equilibrium point, EA rate, extra payments), and chart interpretation.

#### Scenario: New user can install and run
- **WHEN** a developer reads README.md
- **THEN** they can clone the repo, install dependencies, and open the app

#### Scenario: User understands loan concepts
- **WHEN** a user reads the "Key Concepts" section
- **THEN** they understand what amortization, equilibrium point, and EA rate mean

### Requirement: Spanish README
The project SHALL include a `README.es.md` in Spanish with the same content as README.md, translated naturally (not machine-translated).

#### Scenario: Spanish speaker can use the app
- **WHEN** a Spanish-speaking user reads README.es.md
- **THEN** they can install, configure, and understand the simulator
