# Iris

Iris is Zeni's cross-platform client. It uses Expo 56, React Native, TypeScript, Expo Router, and NativeWind to run on Android, iOS, and the web.

## Current Status

The application retains the initial Expo experience while its architectural foundation is in place.
It includes typed HTTP transport, query and client-state providers, secure token storage, offline
database factories, synchronization contracts, and shared motion and Skia primitives. It does not
yet implement personal finance workflows.

## Requirements

- Node.js
- pnpm
- Android Studio or Xcode for native emulators

Before modifying the application, read [`AGENTS.md`](./AGENTS.md), which requires consulting the documentation for Expo 56.

## Design System

[`DESIGN.md`](./DESIGN.md) is the source of truth for Iris's visual language and interaction
criteria across authentication, onboarding, and the authenticated application. Read it before
designing or changing any screen, component, layout, theme, motion, iconography, data visualization,
or user-visible state.

New UI must use its semantic colors, typography, spacing, shape, depth, accessibility, responsive,
and state guidelines. Do not introduce isolated visual values or patterns. When a legitimate design
need is not covered, update `DESIGN.md` deliberately before implementing the new pattern.

## Local Development

```bash
pnpm install
pnpm start
```

Open an emulator from the Expo development server or use these commands directly:

| Command | Target |
| --- | --- |
| `pnpm android` | Android |
| `pnpm ios` | iOS |
| `pnpm web` | Web browser |
| `pnpm lint` | Static analysis with Expo ESLint |
| `pnpm test` | Unit tests with Jest Expo |
| `pnpm typecheck` | Strict TypeScript validation |

## Structure

```text
src/app/          Expo Router routes and layouts
src/features/     Feature-first domain, application, infrastructure, and presentation modules
src/components/   Reusable components
src/hooks/        Platform and theme hooks
src/constants/    Visual tokens and constants
src/platform/     Database, network, query, security, state, and synchronization adapters
src/shared/       Cross-feature motion, graphics, UI, theme, and error primitives
assets/           Static icons and images
```

Use kebab-case filenames, PascalCase component exports, and the `@/` alias for internal imports.
Tests use Jest Expo and React Native Testing Library.
NativeWind 4 and Tailwind CSS 3 provide utility styling; `src/global.css` is their shared entrypoint.

## Architecture

Iris is a feature-first modular monolith with lightweight hexagonal boundaries. Routes compose
features, presentation invokes application use cases, and domain code remains plain TypeScript.
Infrastructure implements domain ports and is wired at composition boundaries.

Dependencies flow from `presentation` to `application` to `domain`. Domain modules must never
import React, Expo, Axios, Zustand, TanStack Query, WatermelonDB, or platform adapters.

### State ownership

| Concern | Owner |
| --- | --- |
| Financial records and offline queries | WatermelonDB |
| Remote request lifecycle and mutations | TanStack Query |
| Session projection, preferences, and sync UI state | Zustand |
| Access token | Memory-only token vault |
| Refresh token | Expo SecureStore on native platforms |

Financial records must never be copied into a persisted TanStack Query cache or Zustand store.
WatermelonDB models, Axios responses, and API DTOs must not cross into domain code.

### Network and synchronization

Axios is hidden behind the typed `HttpClient` boundary. TanStack Query owns retries and
cancellation; Axios owns transport, authentication headers, and error normalization. Concurrent
`401` responses share one token-refresh operation.

Every synchronized feature must add its WatermelonDB model, schema migration, repository adapter,
and sync mapping together. Records use client-generated IDs, server versions, tombstones, and
idempotent mutation IDs. Atenea owns conflict resolution and sync cursors.

### Motion and graphics

Reanimated and Gesture Handler own native interactions and transitions. Shared motion tokens define
timing, springs, and reduced-motion behavior. Skia is reserved for charts and canvas effects;
semantic controls and text remain native components.

WatermelonDB and Skia contain native modules. Code paths using them require an Expo development
client that includes those modules; Expo Go is not a supported runtime for those paths.
WatermelonDB 0.28 is currently reported by React Native Directory as untested on the New
Architecture. Keep the warning visible and validate its native adapter on iOS and Android before
shipping the first persistence-backed feature.
