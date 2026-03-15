# AGENTS.md — Electra

## Project Overview

Electra is a Next.js 14 (App Router) social platform for film lovers, integrating with the TMDB API. It uses a custom HTTP server wrapping Next.js with Socket.IO for real-time chat "Spaces". Stack: TypeScript, React 18, Prisma (PostgreSQL), Tailwind CSS, shadcn/ui, React Query, Zustand, Zod, jose (JWT).

## Build / Lint / Test Commands

| Command | Description |
|---|---|
| `yarn dev` | Start dev server (nodemon watches `server.ts`) |
| `yarn build` | Build Next.js app + compile custom server (`tsc --project tsconfig.server.json`) |
| `yarn start` | Start Next.js production server |
| `yarn prod` | Run Prisma migrations then start production |
| `yarn lint` | Run ESLint (`next lint`) |
| `yarn migrate:deployondev` | Start local PostgreSQL (Docker) + apply Prisma migrations |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma migrate dev --name <name>` | Create a new migration |

**No test framework is configured.** There are no test files, test runner, or test configuration. If tests are added, update this section.

## Environment Setup

- **Node.js:** >=16.13.2 (Docker uses node:20)
- **Package manager:** Yarn (do NOT use npm — `yarn.lock` is the lockfile)
- **Environment variables:** Copy `.env.example` to `.env` and fill in `TMDB_API_KEY`, `TMDB_ACCESS_TOKEN`, `NEXT_PUBLIC_BASEURL`, `BASETMDBURL`, `NEXT_PUBLIC_BASETMDBIMAGEURL`, `DATABASE_URL`, `JWT_SECRET_KEY`
- **Local database:** `docker-compose -f devdb.yml up -d` starts PostgreSQL on port 5432 + Adminer on 8080

## Code Style Guidelines

### Formatting (Prettier defaults + Tailwind plugin)

- **Indentation:** 2 spaces
- **Semicolons:** Always (shadcn/ui generated files may omit them — match existing style when editing)
- **Quotes:** Double quotes (`"`)
- **Trailing commas:** ES5-style (arrays, objects, function parameters)
- **Print width:** 80 characters (Prettier default)
- **Prettier plugin:** `prettier-plugin-tailwindcss` auto-sorts Tailwind classes
- **Format on save** is enabled in `.vscode/settings.json`

### Imports

- Use the `@/` path alias for all imports from `src/` (configured as `"@/*": ["./src/*"]` in `tsconfig.json`)
- Use relative imports only for co-located files (siblings in the same `_components/` or `_actions/` folder)
- General ordering: framework/library imports first, then `@/` alias imports, then relative imports
- Prefer named imports; use `import type` when importing only types

```typescript
// Good
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { ITMDBShowResponse } from "@/utils/api/tmdb";
import { Messages } from "./messages";  // co-located sibling

// Bad
import { db } from "../../lib/db";      // don't use deep relative paths
```

### Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Variables, functions | `camelCase` | `getRQShowsFn`, `debouncedFilter` |
| React components | `PascalCase` | `CardDetails`, `UserAccountNav` |
| API/data interfaces | `I` prefix + `PascalCase` | `ITMDBShowResponse`, `IRQErrorResponse` |
| Internal types/aliases | `PascalCase` (no prefix) | `Message`, `SessionStore`, `RatingProps` |
| Query key factories | `camelCase` + `QueryKeys` | `showQueryKeys`, `favoriteShowQueryKeys` |
| Data-fetching functions | `camelCase` + `Fn` suffix | `getRQShowsFn`, `toggleBookmarkShowsFn` |
| Files | Lowercase, kebab-case for multi-word | `user-account-nav.tsx`, `canvas-reveal-effect.tsx` |
| Hooks | `use` prefix | `useSocketConnection`, `useSessionStore` |
| Constants | `camelCase` (not UPPER_SNAKE) | `const hostname = "localhost"` |

`snake_case` appears only for TMDB API field names (`session_id`, `vote_average`, `poster_path`).

### TypeScript

- **Strict mode** is enabled in `tsconfig.json`
- Explicitly annotate function **parameters**; return types are typically **inferred**
- Use `interface` for API response shapes and extensible data contracts
- Use `type` for aliases, unions, intersections, and `Pick`/`typeof` derivations
- Use generics with `fetcher<T>()` for typed API responses
- Avoid `any`; prefer `unknown` for truly unknown types

```typescript
// interface for API shapes
export interface ITMDBShowResponse {
  page: number;
  results: Show[];
  total_pages: number;
}

// type for aliases and unions
type URLProps = { params: { slug: string } };
type CardDetailsProps = MovieDetails;
```

### Function Style

- **`function` declarations** for: Next.js pages, layouts, route handlers, server actions, middleware, and exported page-level components
- **Arrow functions (`const`)** for: utilities, data-fetching functions, hooks, providers, and internal/helper components

```typescript
// function declaration — page component
export default async function SingleMoviePage({ params }: URLProps) { ... }

// function declaration — route handler
export async function POST(request: Request) { ... }

// arrow function — data-fetching utility
export const getRQShowsFn = async ({ type, value }: ICtx) => { ... };

// arrow function — hook
const useSocketConnection = (spaceId: string): UseSocketConnectionReturn => { ... };
```

### Error Handling

- Use `try/catch` with `throw` — no Result types or error monads
- In API route handlers: return `Response.json({ error: error.message }, { status: 400 })` for known errors, `{ status: 502 }` for unknown
- Use `instanceof Error` checks before accessing `.message`
- The single custom error class is `AuthError extends Error` (in `src/lib/misc/auth.ts`)
- In server actions: `catch` + `console.error` for non-critical failures
- In middleware: redirect unauthenticated users to `/`, return 401 JSON for API routes

```typescript
try {
  const data = await fetcher<ITMDBShowResponse>(url);
  return Response.json(data);
} catch (error) {
  if (error instanceof Error)
    return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ error }, { status: 502 });
}
```

### React / Next.js Patterns

- **App Router** with route groups: `(marketing)` (public), `(protected)` (authenticated)
- Private folders: `_components/` for route-specific components, `_actions/` for server actions
- Always add `"use client"` directive at top of client components, hooks, stores, providers
- Always add `"use server"` directive at top of server action files
- Use `@/components/ui/` for shadcn/ui primitives — add new ones via `npx shadcn-ui@latest add <component>`
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Use React Query (`@tanstack/react-query`) for server state; Zustand for client state
- Use Zod schemas for form/input validation (`src/lib/zod/`)

### Comments & Documentation

- Use JSDoc (`/** */`) with `@param` and `@returns` for public utility functions and API endpoints
- Use single-line `//` comments for inline explanations
- Include links to external references when borrowing patterns (e.g., TkDodo's React Query key factories)
- Do not leave commented-out code in new contributions

### Git Conventions

- **Pre-commit hook** (Husky): runs `yarn lint` — all code must pass ESLint
- **Commit messages**: must follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint)
  - Format: `type(scope): description` — e.g., `feat(spaces): add real-time user list`, `fix(auth): handle expired JWT`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Database (Prisma)

- Schema at `prisma/schema.prisma` — PostgreSQL provider
- Prisma client singleton at `src/lib/db.ts` — always import from `@/lib/db`
- After schema changes: `npx prisma migrate dev --name <name>` then `npx prisma generate`
- Models: `User`, `Space`, `Message` with relations

### Key Architecture Notes

- **Custom server** (`server.ts`): wraps Next.js with `http.createServer` to integrate Socket.IO
- **Auth flow**: TMDB OAuth → JWT (jose) stored as `httpOnly` cookie (`user_token`)
- **Middleware** (`src/middleware.ts`): verifies JWT, rewrites API routes to inject `session_id`
- **Data fetching**: universal `fetcher<T>()` in `src/utils/http.ts` handles both TMDB API and internal proxy calls
- **Path alias**: `@/*` → `./src/*` (use this for all imports from src)
