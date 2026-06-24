# Iris Agent Instructions

These instructions extend the root [`AGENTS.md`](../AGENTS.md). Apply them to all work under `iris/`.

## Context

Iris is the mobile and web frontend for Zeni. The current stack is Expo 56, React Native, Expo Router, TypeScript, NativeWind 4, Tailwind CSS 3, Axios, TanStack Query, Zustand, WatermelonDB, React Native Reanimated, Gesture Handler, and React Native Skia.

Read the exact [Expo 56 documentation](https://docs.expo.dev/versions/v56.0.0/) before writing framework-specific code. Do not apply guidance from a different Expo version.

## TypeScript and Components

- Use strict TypeScript. Do not introduce `any`; model component props, hook results, persistence records, and API contracts explicitly.
- Use functional components and Hooks only. Keep side effects inside focused hooks and clean them up correctly.
- Use kebab-case filenames and PascalCase component exports. Prefer the `@/` alias for internal imports.
- Keep route files in `src/app/`, reusable UI in `src/components/`, hooks in `src/hooks/`, and visual tokens in `src/constants/`.
- Separate screen/container orchestration from presentational components when a screen owns data loading or workflow state.

## Architecture

Use a feature-first modular monolith with lightweight hexagonal boundaries.

- Place feature code under `src/features/<feature>/` and organize only the layers it needs: `domain/`, `application/`, `infrastructure/`, and `presentation/`. Do not create empty architecture folders.
- Dependencies flow from `presentation` to `application` to `domain`. Infrastructure implements ports owned by inner layers and is wired at composition boundaries.
- Keep domain code as plain TypeScript. It must not import React, Expo, Axios, TanStack Query, Zustand, WatermelonDB, or modules from `src/platform/`.
- Keep routes in `src/app/` thin. Routes compose feature screens and providers; they do not contain business rules, persistence, or network requests.
- A feature must not import another feature's internals. Promote genuinely shared primitives deliberately; do not turn `src/shared/` into a miscellaneous dumping ground.
- Place cross-cutting adapters for database, networking, queries, security, global state, and synchronization under `src/platform/`.

## UI and UX

[`DESIGN.md`](./DESIGN.md) is the source of truth for all visual and interaction work across authentication, onboarding, and the authenticated application. Read it before designing, creating, or modifying any user-visible screen, component, layout, theme, motion, iconography, data visualization, or application state.

- Follow its semantic color, typography, spacing, shape, depth, responsive, motion, accessibility, and component-state criteria.
- Reuse centralized design tokens and shared primitives. Never introduce feature-local colors, spacing, radii, typography, shadows, glow, or motion values when an existing token or pattern applies.
- Design and verify loading, empty, stale, offline, error, retry, disabled, pressed, focused, and selected states whenever they are relevant.
- Validate visual changes in dark and light themes and at the compact and expanded layouts affected by the change.
- If a necessary pattern is missing or the product intentionally departs from the documented system, update `DESIGN.md` in the same focused change and explain the tradeoff. Do not silently diverge.

Use a deliberate **Cyberpunk Otaku** visual direction: dark mode by default, defined borders, and restrained neon cyan, magenta, and lime accents. Preserve readability, accessibility, and platform conventions; neon is emphasis, not a substitute for hierarchy.

Use NativeWind utility classes for new static component styling. Keep visual tokens deliberate and centralized; do not scatter arbitrary neon values through feature code.

- Use `StyleSheet` when styles are highly dynamic, computed for third-party native components, or consumed by Reanimated or Skia.
- Keep `src/global.css` as the single NativeWind input and import it only from the root layout.
- Use Reanimated for native microinteractions, layout transitions, and motion; use Gesture Handler for touch-driven interactions.
- Reuse timing, easing, and spring tokens from `src/shared/motion/`. Respect the operating-system reduced-motion preference.
- Use Skia only for rendering that materially benefits from canvas graphics or animation, such as financial charts. Standard interface elements, semantic controls, and text remain native components.
- Do not add Moti. Add Lottie only when a concrete authored animation requires its format.

## Data Architecture

Design new data flows as offline-first. WatermelonDB is the source of truth for persisted financial data and reactive offline queries.

- UI components must never call remote APIs or persistence adapters directly.
- Access data through typed repositories, application services, or custom hooks.
- Keep local persistence, synchronization, conflict resolution, and network transport behind explicit interfaces.
- Do not copy financial entities into Zustand or a persisted TanStack Query cache.
- Use Zustand only for client-owned global state such as session projection, preferences, onboarding, and sync UI state. Never store access or refresh tokens in Zustand.
- Use TanStack Query for remote request lifecycle, authentication operations, commands, cancellation, and sync orchestration. Query retry policies belong to the shared query client.
- Keep Axios behind the typed `HttpClient` interface. Components and domain code must never receive `AxiosResponse` or `AxiosError`.
- Let TanStack Query own request retries; do not add an independent Axios retry layer.
- Keep access tokens in memory and refresh tokens in Expo SecureStore on native platforms. Concurrent `401` responses must share one refresh operation.
- Every synchronized feature must introduce its WatermelonDB model, schema migration, repository adapter, and sync mapping in the same focused change.
- Use client-generated IDs, server versions, tombstones, idempotent mutation IDs, and server-owned conflict resolution. Never resolve conflicts using the device clock as authority.
- Model loading, empty, stale, offline, error, and retry states.
- Never place secrets or direct PostgreSQL credentials in the client.

## Verification

Run `pnpm lint`, `pnpm typecheck`, and focused Jest tests after relevant changes. Never run a build after changes.

- Tests use Jest Expo and React Native Testing Library.
- Test project-owned behavior: domain rules, use cases, adapters, configuration policies, state invariants, synchronization behavior, and user-visible outcomes.
- Do not test implementation details already owned by third-party libraries. Mock their boundaries and verify only the configuration or behavior Iris adds.
- WatermelonDB and Skia use native modules. Their runtime paths require an Expo development client and are not supported in Expo Go.
- React Native Directory currently reports WatermelonDB 0.28 as untested on the New Architecture. Do not suppress this Expo Doctor warning; validate its native adapter on both iOS and Android before implementing the first persistence-backed feature.
