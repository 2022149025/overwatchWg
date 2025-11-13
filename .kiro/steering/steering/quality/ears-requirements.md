# EARS Requirements Writing Standard - Full Documentation

**Referenced By**: `.kiro/steering/ears-requirements.md`  
**Last Updated**: 2025-01-28  
**Status**: Reference Document

---

## Table of Contents

1. [Critical: EARS Pattern Compliance](#-critical-ears-pattern-compliance)
2. [What is EARS?](#-what-is-ears)
3. [Six EARS Patterns](#-six-ears-patterns)
4. [INCOSE Quality Rules](#-incose-quality-rules)
5. [Requirements Document Structure](#-requirements-document-structure)
6. [Validation Process](#-validation-process)
7. [EARS Compliance Banner](#-mandatory-ears-compliance-banner)
8. [Common Violations](#-common-violations)
9. [Quality Metrics](#-quality-metrics)
10. [Examples from This Project](#-examples-from-this-project)
11. [Related Documentation](#-related-documentation)

---

This document defines the EARS (Easy Approach to Requirements Syntax) standard for writing clear, unambiguous requirements.

---

## 🚨 CRITICAL: EARS Pattern Compliance

**ALL requirements MUST follow EARS (Easy Approach to Requirements Syntax) patterns.**

**This applies to:**
- 📋 Creating requirements.md files
- 🎨 Writing acceptance criteria
- 📝 Defining user stories
- 💻 Specifying system behavior

**NO EXCEPTIONS. NO SHORTCUTS.**

---

## 📖 What is EARS?

EARS (Easy Approach to Requirements Syntax) is a structured approach to writing clear, unambiguous requirements using six specific patterns.

**Benefits**:
- ✅ Eliminates ambiguity
- ✅ Improves testability
- ✅ Enhances clarity
- ✅ Reduces misunderstandings
- ✅ Facilitates automation

---

## 🎯 Six EARS Patterns

### Pattern 1: Ubiquitous (항상 적용)

**Format**: `THE [system] SHALL [response]`

**When to Use**: For requirements that always apply, with no conditions

**Example**:
```
✅ GOOD:
THE Kiro SHALL save all task learnings to the compounding folder

✅ GOOD:
THE System SHALL use TypeScript strict mode for all files

❌ BAD:
The system should save learnings  // Vague, no "SHALL"
Kiro saves learnings  // Not EARS format
```

---

### Pattern 2: Event-Driven (이벤트 발생 시)

**Format**: `WHEN [trigger], THE [system] SHALL [response]`

**When to Use**: For requirements triggered by a specific event

**Example**:
```
✅ GOOD:
WHEN a task is marked as complete, THE Kiro SHALL extract key learnings

✅ GOOD:
WHEN a user submits an answer, THE System SHALL validate the input

❌ BAD:
After task completion, extract learnings  // Not EARS format
The system validates input when submitted  // Wrong order
```

---

### Pattern 3: State-Driven (상태 유지 중)

**Format**: `WHILE [condition], THE [system] SHALL [response]`

**When to Use**: For requirements that apply during a specific state

**Example**:
```
✅ GOOD:
WHILE implementing a task, THE Kiro SHALL reference applicable standards

✅ GOOD:
WHILE a game is in progress, THE System SHALL track player actions

❌ BAD:
During implementation, reference standards  // Not EARS format
The system tracks actions while game is active  // Wrong order
```

---

### Pattern 4: Unwanted Event (원치 않는 이벤트)

**Format**: `IF [condition], THEN THE [system] SHALL [response]`

**When to Use**: For error handling and unwanted situations

**Example**:
```
✅ GOOD:
IF a standard file is not found, THEN THE Kiro SHALL log a warning and use defaults

✅ GOOD:
IF an API request fails, THEN THE System SHALL retry up to 3 times

❌ BAD:
When standard not found, use defaults  // Should use IF...THEN
The system retries on failure  // Not EARS format
```

---

### Pattern 5: Optional Feature (선택적 기능)

**Format**: `WHERE [option], THE [system] SHALL [response]`

**When to Use**: For optional features or configurations

**Example**:
```
✅ GOOD:
WHERE a profile is specified, THE Kiro SHALL apply profile-specific constraints

✅ GOOD:
WHERE dark mode is enabled, THE System SHALL use dark color scheme

❌ BAD:
If profile specified, apply constraints  // Should use WHERE
The system uses dark mode when enabled  // Not EARS format
```

---

### Pattern 6: Complex (복합 조건)

**Format**: `[WHERE] [WHILE] [WHEN/IF] THE [system] SHALL [response]`

**Order**: WHERE → WHILE → WHEN/IF → THE → SHALL (in this exact order)

**When to Use**: For requirements with multiple conditions

**Example**:
```
✅ GOOD:
WHERE a devvit-game profile is active, WHILE implementing a task, WHEN a 30-second timeout is detected, THE Kiro SHALL provide a warning

✅ GOOD:
WHERE testing is enabled, WHILE a test is running, IF an assertion fails, THEN THE System SHALL log the failure details

❌ BAD:
WHEN timeout detected, WHERE profile active, THE Kiro SHALL warn  // Wrong order
IF assertion fails WHILE testing, THE System SHALL log  // Wrong order
```

---

## 📐 INCOSE Quality Rules

All requirements MUST also comply with INCOSE (International Council on Systems Engineering) quality rules:

### Rule 1: Active Voice
✅ **DO**: "THE System SHALL validate input"  
❌ **DON'T**: "Input SHALL be validated"

### Rule 2: No Vague Terms
✅ **DO**: "THE System SHALL respond within 2 seconds"  
❌ **DON'T**: "THE System SHALL respond quickly"

**Vague terms to avoid**:
- quickly, slowly, fast
- adequate, sufficient, appropriate
- user-friendly, easy, simple
- robust, flexible, scalable (without metrics)

### Rule 3: No Escape Clauses
✅ **DO**: "THE System SHALL save all data"  
❌ **DON'T**: "THE System SHALL save data where possible"

**Escape clauses to avoid**:
- where possible
- as appropriate
- if feasible
- to the extent possible

### Rule 4: No Negative Statements
✅ **DO**: "THE System SHALL use HTTPS"  
❌ **DON'T**: "THE System SHALL NOT use HTTP"

### Rule 5: One Thought Per Requirement
✅ **DO**:
- "THE System SHALL validate email format"
- "THE System SHALL validate password length"

❌ **DON'T**:
- "THE System SHALL validate email format and password length"

### Rule 6: Explicit and Measurable
✅ **DO**: "THE System SHALL load within 3 seconds"  
❌ **DON'T**: "THE System SHALL load fast"

### Rule 7: Consistent Terminology
✅ **DO**: Always use "user" or always use "player"  
❌ **DON'T**: Mix "user", "player", "person"

### Rule 8: No Pronouns
✅ **DO**: "THE System SHALL save the user's data"  
❌ **DON'T**: "THE System SHALL save their data"

### Rule 9: No Absolutes (unless truly absolute)
✅ **DO**: "THE System SHALL retry up to 3 times"  
❌ **DON'T**: "THE System SHALL never fail"

### Rule 10: Solution-Free (focus on what, not how)
✅ **DO**: "THE System SHALL store user preferences"  
❌ **DON'T**: "THE System SHALL use Redis to store user preferences"

### Rule 11: Realistic Tolerances
✅ **DO**: "THE System SHALL respond within 2 seconds ± 0.5 seconds"  
❌ **DON'T**: "THE System SHALL respond in exactly 2 seconds"

---

## 📋 Requirements Document Structure

### MANDATORY Sections

Every `requirements.md` file MUST include:

1. **Introduction**: Purpose and context
2. **Glossary**: All system names and technical terms defined
3. **Requirements**: Numbered requirements with user stories and EARS-compliant acceptance criteria
4. **Standards Compliance**: Applicable standards (from Phase 1)

### Template

```markdown
# Requirements Document: [Feature Name]

## Introduction

[Summary of the feature or system]

## Glossary

- **System/Term 1**: [Definition]
- **System/Term 2**: [Definition]
- **System/Term 3**: [Definition]

## Requirements

### Requirement 1: [Name]

**User Story**: As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria

1. [EARS pattern] THE [System_Name] SHALL [response]
2. [EARS pattern] THE [System_Name] SHALL [response]
3. [EARS pattern] THE [System_Name] SHALL [response]
4. [EARS pattern] THE [System_Name] SHALL [response]
5. [EARS pattern] THE [System_Name] SHALL [response]

**Priority**: [P0/P1/P2]  
**Estimated Effort**: [time]  
**Dependencies**: [list]

### Requirement 2: [Name]

[Repeat structure]

## Standards Compliance

[List applicable standards from .kiro/standards/]
```

---

## 🔍 Validation Process

### Step 1: EARS Pattern Check

For each acceptance criterion:
1. Identify which EARS pattern it uses
2. Verify the pattern is correctly formatted
3. Check clause order (for complex patterns)

### Step 2: INCOSE Quality Check

For each acceptance criterion:
1. ✅ Active voice?
2. ✅ No vague terms?
3. ✅ No escape clauses?
4. ✅ No negative statements?
5. ✅ One thought only?
6. ✅ Explicit and measurable?
7. ✅ Consistent terminology?
8. ✅ No pronouns?
9. ✅ No absolutes (unless truly absolute)?
10. ✅ Solution-free?
11. ✅ Realistic tolerances?

### Step 3: Auto-Correction

If a requirement violates EARS or INCOSE rules:
1. Identify the violation
2. Suggest correction
3. Explain why the correction is needed
4. Show before/after comparison

---

## 📢 MANDATORY: EARS Compliance Banner

**EVERY requirements.md file MUST start with this banner:**

```
╔══════════════════════════════════════════════════════════════╗
║  📋 EARS REQUIREMENTS COMPLIANCE                             ║
╠══════════════════════════════════════════════════════════════╣
║  Pattern Usage:                                              ║
║    • Ubiquitous: [count]                                     ║
║    • Event-Driven: [count]                                   ║
║    • State-Driven: [count]                                   ║
║    • Unwanted Event: [count]                                 ║
║    • Optional Feature: [count]                               ║
║    • Complex: [count]                                        ║
║  INCOSE Compliance: ✅ 100%                                  ║
║  Total Criteria: [count]                                     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🚫 Common Violations

### Violation 1: Not Using EARS Pattern
```
❌ BAD:
"The system should validate input"

✅ GOOD:
"WHEN a user submits input, THE System SHALL validate the format"
```

### Violation 2: Vague Terms
```
❌ BAD:
"THE System SHALL respond quickly"

✅ GOOD:
"THE System SHALL respond within 2 seconds"
```

### Violation 3: Escape Clauses
```
❌ BAD:
"THE System SHALL save data where possible"

✅ GOOD:
"THE System SHALL save data to Redis"
"IF Redis is unavailable, THEN THE System SHALL log an error"
```

### Violation 4: Multiple Thoughts
```
❌ BAD:
"THE System SHALL validate email and password"

✅ GOOD:
"THE System SHALL validate email format"
"THE System SHALL validate password length"
```

### Violation 5: Wrong Clause Order (Complex)
```
❌ BAD:
"WHEN timeout occurs, WHERE profile active, THE System SHALL warn"

✅ GOOD:
"WHERE profile is active, WHEN timeout occurs, THE System SHALL warn"
```

---

## 📊 Quality Metrics

### Requirement Quality Score

**Excellent (90-100%)**:
- All criteria use EARS patterns
- Zero INCOSE violations
- Clear, measurable, testable

**Good (80-89%)**:
- Most criteria use EARS patterns
- Minor INCOSE violations
- Generally clear and testable

**Fair (70-79%)**:
- Some criteria use EARS patterns
- Several INCOSE violations
- Some ambiguity

**Poor (< 70%)**:
- Few or no EARS patterns
- Many INCOSE violations
- Significant ambiguity

---

## 🎓 Examples from This Project

### Example 1: Standards System

```markdown
### Requirement 1: Standards System Implementation

**User Story**: As a developer, I want project-specific coding rules to be automatically referenced so that I can maintain consistent code quality.

#### Acceptance Criteria

1. WHEN creating a new spec document, THE Kiro SHALL automatically identify and read relevant standards from `.kiro/standards/` directory
2. THE Kiro SHALL organize standards in domain-specific folders: `global/`, `backend/`, `frontend/`, `testing/`
3. WHILE implementing tasks, THE Kiro SHALL reference applicable standards and cite specific sections in responses
4. THE Kiro SHALL include at least 5 core standard files: `coding-style.md`, `error-handling.md`, `tech-stack.md`, `api.md`, `components.md`
5. IF standards are violated during implementation, THEN THE Kiro SHALL provide specific guidance with before/after code examples
6. WHERE a spec references standards, THE Kiro SHALL include a `standards_compliance` section in requirements.md listing applicable standards

**Priority**: P0 (Highest)  
**Estimated Effort**: 1-2 days  
**Dependencies**: None
```

**Analysis**:
- ✅ Criterion 1: Event-Driven pattern
- ✅ Criterion 2: Ubiquitous pattern
- ✅ Criterion 3: State-Driven pattern
- ✅ Criterion 4: Ubiquitous pattern
- ✅ Criterion 5: Unwanted Event pattern
- ✅ Criterion 6: Optional Feature pattern
- ✅ All INCOSE rules followed
- ✅ Quality Score: 100% (Excellent)

---

## 🔗 Related Documentation

- `.kiro/standards/` - Standards to reference in requirements
- `.kiro/steering/standards-enforcement.md` - How standards are enforced
- `.kiro/steering/compounding-reference.md` - Learning from past requirements

---

## 🚨 Final Warning

**EARS patterns are not suggestions. They are MANDATORY requirements.**

- Every acceptance criterion MUST use an EARS pattern
- Every requirement MUST comply with INCOSE rules
- Every violation MUST be corrected
- Every requirements.md MUST include EARS compliance banner

**ALWAYS use EARS patterns. ALWAYS follow INCOSE rules. ALWAYS validate compliance.**

---

**Status**: Reference Document  
**Last Updated**: 2025-01-28  
**Enforcement**: MANDATORY - NO EXCEPTIONS  
**Project**: Armchair Sleuths - AI Murder Mystery Game
