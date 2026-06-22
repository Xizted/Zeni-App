# Iris Agent Instructions

These instructions extend the root [`AGENTS.md`](../AGENTS.md). Apply them to all work under `iris/`.

## Context

Iris is the mobile and web frontend for Zeni. The current stack is Expo 56, React Native, Expo Router, and TypeScript. The target stack also includes NativeWind, React Native Skia, and WatermelonDB; these packages are not installed yet and must not be imported until they are deliberately added and configured.

Read the exact [Expo 56 documentation](https://docs.expo.dev/versions/v56.0.0/) before writing framework-specific code. Do not apply guidance from a different Expo version.

## TypeScript and Components

- Use strict TypeScript. Do not introduce `any`; model component props, hook results, persistence records, and API contracts explicitly.
- Use functional components and Hooks only. Keep side effects inside focused hooks and clean them up correctly.
- Use kebab-case filenames and PascalCase component exports. Prefer the `@/` alias for internal imports.
- Keep route files in `src/app/`, reusable UI in `src/components/`, hooks in `src/hooks/`, and visual tokens in `src/constants/`.
- Separate screen/container orchestration from presentational components when a screen owns data loading or workflow state.

## UI and UX

Use a deliberate **Cyberpunk Otaku** visual direction: dark mode by default, defined borders, and restrained neon cyan, magenta, and lime accents. Preserve readability, accessibility, and platform conventions; neon is emphasis, not a substitute for hierarchy.

Use NativeWind utility classes once NativeWind is installed and configured. Until then, follow the existing `StyleSheet` and theme-token patterns. Use Skia only for rendering that materially benefits from canvas graphics or animation; standard interface elements remain native components.

## Data Architecture

Design new data flows as offline-first. WatermelonDB is the intended local database, but it must be installed and configured before use.

- UI components must never call remote APIs or persistence adapters directly.
- Access data through typed repositories, application services, or custom hooks.
- Keep local persistence, synchronization, conflict resolution, and network transport behind explicit interfaces.
- Model loading, empty, stale, offline, error, and retry states.
- Never place secrets or direct PostgreSQL credentials in the client.

## Verification

Run `pnpm lint` after relevant changes. No test framework is configured yet; introducing one is part of the first meaningful testing change. Never run a build after changes.
