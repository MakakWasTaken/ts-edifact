# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
yarn install

# Build (both CJS and ESM outputs)
yarn build

# Type-check without emitting
yarn check

# Lint and format (Biome)
yarn lint

# Run all tests
yarn test

# Run a single test file
yarn test spec/parser.spec.ts

# Run tests with coverage
yarn coverage

# Clean build artifacts
yarn clean
```

## Architecture

This is a dual-format (ESM + CJS) TypeScript library for parsing UN/EDIFACT interchange documents, published as `@makakwastaken/ts-edifact`. The build outputs to `build/esm/` and `build/cjs/` respectively.

### Parsing pipeline

1. **`Tokenizer`** (`src/tokenizer.ts`) — low-level character stream scanner; tracks separator characters and enforces charset rules (default: UNOA).
2. **`Parser`** (`src/parser.ts`) — extends `EventEmitter`; drives the tokenizer and emits `onOpenSegment`, `onCloseSegment`, `onElement`, `onComponent` hooks. Accepts a `Configuration` at construction time.
3. **`Reader`** (`src/reader.ts`) — convenience wrapper around `Parser`; wires default callbacks and returns a `ResultType[]` array (flat `{ name, elements }` segments). Also auto-updates the charset from the `UNB` segment.
4. **`InterchangeBuilder`** (`src/interchangeBuilder.ts`) — takes the flat `ResultType[]` from `Reader`/`Parser` and builds a typed object tree (`Edifact → Message → Group → Segment`) using `*.struct.json` message structure files.

### Validation

- **`ValidatorImpl`** (`src/validator.ts`) — validates segment/element/component counts and formats against `*.segments.json` definitions loaded via `SegmentTableBuilder` or `ComponentValueTableBuilder`. Defaults to tolerant mode (unknown segments pass); pass `throwOnMissingDefinitions: true` for strict mode.
- **`Tracker`** (`src/tracker.ts`) — validates segment ordering against a `MessageType[]` structure table. Used internally by `InterchangeBuilder`.
- **`NullValidator`** — no-op validator used when no configuration is provided.

### Spec definitions

`src/messageSpec/` contains bundled D:01B specification files in three JSON flavours per message type:
- `*.struct.json` — message structure (segment groups, cardinality); consumed by `InterchangeBuilder`
- `*.segments.json` — admissible segments and element definitions; consumed by `ValidatorImpl`
- `*.components.json` — component value tables

`src/edi/` contains parsers that can scrape the UNECE website to generate these definition files on demand (`UNECEMessageStructureParser`). The generated `EdifactMessageSpecification` object can be persisted via `persist()` in `src/util.ts`.

### Key types

- `ResultType` — `{ name: string; elements: ElementEntry[] }` — flat parsed segment from `Reader`
- `Dictionary<T>` — generic map type used throughout for segment/element lookup tables
- `Separators` — the six EDIFACT separator characters; built with `EdifactSeparatorsBuilder`

## Tooling

- **Linter/formatter**: Biome (not ESLint/Prettier). Config in `biome.json`. Single quotes, no semicolons, 2-space indent.
- **Tests**: Jest with `@swc/jest` transformer (not `ts-jest`). Specs live in `spec/`.
- **Commits**: Conventional Commits enforced by commitlint + husky.
- **Package manager**: Yarn 4 (Berry). Use `yarn` not `npm`.
