# EARS Pattern Examples

**Purpose**: Comprehensive examples of all six EARS patterns with Armchair Sleuths context

---

## Pattern 1: Ubiquitous (항상 적용)

### Format
`THE [system] SHALL [response]`

### Armchair Sleuths Examples

#### Example 1: Code Quality
```
✅ GOOD:
THE Kiro SHALL use TypeScript strict mode for all files

✅ GOOD:
THE System SHALL follow Fair Play principles in all mystery cases

✅ GOOD:
THE Game SHALL provide all clues necessary to solve the mystery

❌ BAD:
Kiro uses TypeScript  // Not EARS format, no SHALL
The system should follow Fair Play  // "should" instead of "SHALL"
All clues are provided  // Passive voice
```

#### Example 2: Data Persistence
```
✅ GOOD:
THE System SHALL store all game state in Redis

✅ GOOD:
THE Kiro SHALL save task learnings to the compounding folder

❌ BAD:
Game state is stored in Redis  // Passive voice
Kiro saves learnings  // No SHALL
```

#### Example 3: Platform Constraints
```
✅ GOOD:
THE System SHALL complete all API requests within 30 seconds

✅ GOOD:
THE UI SHALL be optimized for mobile devices

❌ BAD:
API requests should complete quickly  // Vague, no SHALL
Mobile optimization is required  // Passive voice
```

---

## Pattern 2: Event-Driven (이벤트 발생 시)

### Format
`WHEN [trigger], THE [system] SHALL [response]`

### Armchair Sleuths Examples

#### Example 1: Task Completion
```
✅ GOOD:
WHEN a task is marked as complete, THE Kiro SHALL extract key learnings

✅ GOOD:
WHEN a user submits an answer, THE System SHALL validate the input format

✅ GOOD:
WHEN a case is generated, THE System SHALL create exactly 3 suspects

❌ BAD:
After task completion, extract learnings  // Not EARS format
The system validates input when submitted  // Wrong order
```

#### Example 2: User Actions
```
✅ GOOD:
WHEN a player discovers evidence, THE System SHALL add it to the evidence log

✅ GOOD:
WHEN a suspect is interviewed, THE System SHALL generate personality-consistent responses

❌ BAD:
Evidence is added when discovered  // Passive voice
The system generates responses after interview  // Not EARS format
```

#### Example 3: Error Conditions
```
✅ GOOD:
WHEN a build error occurs, THE Kiro SHALL provide specific error messages

✅ GOOD:
WHEN an API call times out, THE System SHALL log the failure details

❌ BAD:
Build errors show messages  // No SHALL, vague
The system logs failures on timeout  // Wrong order
```

---

## Pattern 3: State-Driven (상태 유지 중)

### Format
`WHILE [condition], THE [system] SHALL [response]`

### Armchair Sleuths Examples

#### Example 1: Implementation Phase
```
✅ GOOD:
WHILE implementing a task, THE Kiro SHALL reference applicable standards

✅ GOOD:
WHILE a game is in progress, THE System SHALL track all player actions

✅ GOOD:
WHILE generating a case, THE System SHALL ensure Fair Play compliance

❌ BAD:
During implementation, reference standards  // Not EARS format
The system tracks actions while game is active  // Wrong order
```

#### Example 2: Active States
```
✅ GOOD:
WHILE a suspect is being interviewed, THE System SHALL maintain personality consistency

✅ GOOD:
WHILE evidence is being analyzed, THE System SHALL provide relevant hints

❌ BAD:
Personality is maintained during interview  // Passive voice
The system provides hints while analyzing  // Wrong order
```

#### Example 3: Continuous Monitoring
```
✅ GOOD:
WHILE a user is logged in, THE System SHALL monitor session activity

✅ GOOD:
WHILE a case is active, THE System SHALL prevent data corruption

❌ BAD:
Session activity is monitored while logged in  // Passive voice
The system prevents corruption during active case  // Not EARS format
```

---

## Pattern 4: Unwanted Event (원치 않는 이벤트)

### Format
`IF [condition], THEN THE [system] SHALL [response]`

### Armchair Sleuths Examples

#### Example 1: Error Handling
```
✅ GOOD:
IF a standard file is not found, THEN THE Kiro SHALL log a warning and use defaults

✅ GOOD:
IF an API request fails, THEN THE System SHALL retry up to 3 times

✅ GOOD:
IF a case generation fails, THEN THE System SHALL provide a detailed error message

❌ BAD:
When standard not found, use defaults  // Should use IF...THEN
The system retries on failure  // Not EARS format
```

#### Example 2: Validation Failures
```
✅ GOOD:
IF user input is invalid, THEN THE System SHALL display specific validation errors

✅ GOOD:
IF a suspect response is inconsistent, THEN THE System SHALL regenerate the response

❌ BAD:
Invalid input shows errors  // No IF...THEN, no SHALL
The system regenerates inconsistent responses  // Not EARS format
```

#### Example 3: Resource Limits
```
✅ GOOD:
IF the 30-second timeout is exceeded, THEN THE System SHALL terminate the request

✅ GOOD:
IF Redis is unavailable, THEN THE System SHALL log an error and fail gracefully

❌ BAD:
Timeout terminates request  // No IF...THEN, no SHALL
The system fails gracefully when Redis unavailable  // Not EARS format
```

---

## Pattern 5: Optional Feature (선택적 기능)

### Format
`WHERE [option], THE [system] SHALL [response]`

### Armchair Sleuths Examples

#### Example 1: Profile Configuration
```
✅ GOOD:
WHERE a devvit-game profile is active, THE Kiro SHALL apply 30-second timeout constraints

✅ GOOD:
WHERE dark mode is enabled, THE System SHALL use dark color scheme

✅ GOOD:
WHERE testing mode is active, THE System SHALL use mock data

❌ BAD:
If profile active, apply constraints  // Should use WHERE
The system uses dark mode when enabled  // Not EARS format
```

#### Example 2: Feature Flags
```
✅ GOOD:
WHERE image generation is enabled, THE System SHALL create suspect profile images

✅ GOOD:
WHERE analytics is enabled, THE System SHALL track user interactions

❌ BAD:
Image generation creates profiles when enabled  // Not EARS format
The system tracks interactions if analytics enabled  // Should use WHERE
```

#### Example 3: User Preferences
```
✅ GOOD:
WHERE a user has selected easy difficulty, THE System SHALL provide 70% obvious clues

✅ GOOD:
WHERE a user has enabled hints, THE System SHALL display contextual hints

❌ BAD:
Easy difficulty provides more clues  // Not EARS format
The system shows hints when enabled  // Should use WHERE
```

---

## Pattern 6: Complex (복합 조건)

### Format
`[WHERE] [WHILE] [WHEN/IF] THE [system] SHALL [response]`

**Order**: WHERE → WHILE → WHEN/IF → THE → SHALL

### Armchair Sleuths Examples

#### Example 1: Full Complex Pattern
```
✅ GOOD:
WHERE a devvit-game profile is active, WHILE implementing a task, WHEN a 30-second timeout is detected, THE Kiro SHALL provide a warning with optimization suggestions

✅ GOOD:
WHERE testing is enabled, WHILE a test is running, IF an assertion fails, THEN THE System SHALL log the failure details and continue

❌ BAD:
WHEN timeout detected, WHERE profile active, THE Kiro SHALL warn  // Wrong order
IF assertion fails WHILE testing, THE System SHALL log  // Wrong order
```

#### Example 2: Partial Complex Pattern (WHERE + WHEN)
```
✅ GOOD:
WHERE a case is in hard difficulty, WHEN a player requests a hint, THE System SHALL provide subtle hints only

✅ GOOD:
WHERE mobile optimization is enabled, WHEN a user interacts with UI, THE System SHALL use touch-friendly controls

❌ BAD:
WHEN player requests hint, WHERE hard difficulty, THE System SHALL provide subtle hints  // Wrong order
```

#### Example 3: Partial Complex Pattern (WHILE + IF)
```
✅ GOOD:
WHILE generating a case, IF AI hallucination is detected, THEN THE System SHALL regenerate the content

✅ GOOD:
WHILE a game is in progress, IF a player disconnects, THEN THE System SHALL save the game state

❌ BAD:
IF hallucination detected WHILE generating, THE System SHALL regenerate  // Wrong order
```

---

## INCOSE Violation Examples

### Violation 1: Vague Terms

```
❌ BAD:
THE System SHALL respond quickly
THE System SHALL provide adequate hints
THE System SHALL be user-friendly

✅ GOOD:
THE System SHALL respond within 2 seconds
THE System SHALL provide at least 3 hints per case
THE System SHALL support keyboard navigation and screen readers
```

### Violation 2: Escape Clauses

```
❌ BAD:
THE System SHALL save data where possible
THE System SHALL validate input as appropriate
THE System SHALL optimize performance if feasible

✅ GOOD:
THE System SHALL save data to Redis
IF Redis is unavailable, THEN THE System SHALL log an error
THE System SHALL validate all user input
THE System SHALL load pages within 3 seconds
```

### Violation 3: Negative Statements

```
❌ BAD:
THE System SHALL NOT use HTTP
THE System SHALL NOT allow invalid input
THE System SHALL NOT exceed 30 seconds

✅ GOOD:
THE System SHALL use HTTPS
THE System SHALL validate all input before processing
THE System SHALL complete all requests within 30 seconds
```

### Violation 4: Multiple Thoughts

```
❌ BAD:
THE System SHALL validate email format and password length and username uniqueness

✅ GOOD:
THE System SHALL validate email format
THE System SHALL validate password length
THE System SHALL validate username uniqueness
```

### Violation 5: Pronouns

```
❌ BAD:
WHEN a user submits their answer, THE System SHALL validate it

✅ GOOD:
WHEN a user submits an answer, THE System SHALL validate the answer format
```

### Violation 6: Solution-Specific

```
❌ BAD:
THE System SHALL use Redis to store game state
THE System SHALL use Gemini API to generate cases

✅ GOOD:
THE System SHALL persist game state across sessions
THE System SHALL generate unique mystery cases
```

---

## Complete Example: Mystery Case Generation

### Requirement: Case Generation System

**User Story**: As a game designer, I want the system to generate unique mystery cases so that players have fresh content.

#### Acceptance Criteria

1. THE System SHALL generate mystery cases with exactly 3 suspects _(Ubiquitous)_

2. WHEN a case generation is requested, THE System SHALL create a case within 25 seconds _(Event-Driven)_

3. WHILE generating a case, THE System SHALL ensure all clues follow Fair Play principles _(State-Driven)_

4. IF AI hallucination is detected, THEN THE System SHALL regenerate the affected content _(Unwanted Event)_

5. WHERE easy difficulty is selected, THE System SHALL make 70% of clues obvious _(Optional Feature)_

6. WHERE a devvit-game profile is active, WHILE generating a case, IF the 30-second timeout is approaching, THEN THE System SHALL prioritize essential content generation _(Complex)_

**Priority**: P0 (Highest)  
**Estimated Effort**: 3-5 days  
**Dependencies**: Gemini API integration, Fair Play validation system

---

## Pattern Selection Guide

### When to Use Each Pattern

| Pattern | Use When | Example Scenario |
|---------|----------|------------------|
| **Ubiquitous** | Always applies, no conditions | "System SHALL use TypeScript" |
| **Event-Driven** | Triggered by specific event | "WHEN user clicks, System SHALL..." |
| **State-Driven** | Applies during a state | "WHILE loading, System SHALL..." |
| **Unwanted Event** | Error or exception handling | "IF error occurs, THEN System SHALL..." |
| **Optional Feature** | Feature flag or configuration | "WHERE dark mode, System SHALL..." |
| **Complex** | Multiple conditions | "WHERE X, WHILE Y, WHEN Z, System SHALL..." |

---

## Quality Checklist

For each acceptance criterion, verify:

- [ ] Uses one of the six EARS patterns
- [ ] Pattern is correctly formatted
- [ ] Clause order is correct (for complex patterns)
- [ ] Uses active voice
- [ ] No vague terms
- [ ] No escape clauses
- [ ] No negative statements
- [ ] One thought only
- [ ] Explicit and measurable
- [ ] Consistent terminology
- [ ] No pronouns
- [ ] Solution-free (what, not how)
- [ ] Realistic tolerances

---

**Version**: 1.0  
**Last Updated**: 2025-01-28  
**Project**: Armchair Sleuths - AI Murder Mystery Game
