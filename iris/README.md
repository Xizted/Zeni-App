# Iris

Iris is Zeni's cross-platform client. It uses Expo 56, React Native, TypeScript, and Expo Router to run on Android, iOS, and the web.

## Current Status

The application retains the initial Expo experience with navigation, themes, and example components. It does not yet consume the Atenea API or implement personal finance workflows.

## Requirements

- Node.js
- pnpm
- Android Studio or Xcode for native emulators

Before modifying the application, read [`AGENTS.md`](./AGENTS.md), which requires consulting the documentation for Expo 56.

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

## Structure

```text
src/app/          Expo Router routes and layouts
src/components/   Reusable components
src/hooks/        Platform and theme hooks
src/constants/    Visual tokens and constants
assets/           Static icons and images
```

Use kebab-case filenames, PascalCase component exports, and the `@/` alias for internal imports. No testing framework is currently configured; introduce one alongside the first meaningful tests.
