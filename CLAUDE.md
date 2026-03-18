# CLAUDE.md

Parking management website with React, TypeScript, Vite. Role-based access via AWS Cognito.

## Commands

```bash
npm run dev              # Dev server
npm run build            # Production build
npm run lint             # ESLint
npm test                 # Playwright tests
npm run test:ui          # Playwright UI
npm run test:unit        # Vitest unit tests
npm run test:unit:watch  # Vitest watch mode
npm run test:unit:coverage # Vitest with coverage
```

## Key Files

- `src/contexts/AuthContext.ts` - Auth context type, provides `getToken()` for API calls
- `src/hooks/useUserClaims.ts` - Extracts permissions from JWT `cognito:groups`
- `src/hooks/api/helpers.ts` - API utilities, auto-attaches auth header
- `src/App.tsx` - All routes defined here

## Permissions

Two types: `UserAdmin` (user management), `TeamLeader` (reservations, override requests).

Always use the exported constants, never string literals:
```typescript
import { USER_ADMIN, TEAM_LEADER } from '../hooks/useUserClaims';
```

## Calendar Data Pattern

Many pages use this structure:
```typescript
{
  weeks: [{
    days: [{
      localDate: "2024-01-15",  // ISO date
      hidden: false,             // true for empty cells
      data: { /* day-specific */ }
    }]
  }]
}
```

Editable calendars maintain local state initialized from query data, then submit via PATCH.

## Testing

### Unit tests (Vitest)

Unit tests in `src/**/*.test.ts` using Vitest + Testing Library. Config in `vite.config.ts`.

```bash
npm run test:unit
```

### E2E mock tests (Playwright)

Mock tests in `tests/mock/` use Playwright fixtures and data factories:

- `tests/fixtures/index.ts` - Extended `test` with `mockApi`, `applyMockApi`, `authenticateAs` fixtures
- `tests/fixtures/mock-api.ts` - Centralized `MockApiState` and `setupMockApi()` for all API routes
- `tests/fixtures/auth.ts` - `authenticateAs(page, role)` to configure mock JWT role per test
- `tests/factories/*.ts` - Data factories for each API domain (summary, requests, users, etc.)

```bash
npx playwright test --project=mock-chromium
```

### E2E smoke tests (Playwright)

Hit real API via Cognito auth. Require env vars:
- `ParkingRota:TestUser`
- `ParkingRota:TestPassword`

```bash
npx playwright test --project=smoke-chromium
```

### Vite mock mode

Mock tests run against a separate dev server (`--mode mock-test` on port 5174) where `aws-amplify` is replaced with mock modules via Vite aliases (see `vite.config.ts`).

- `tests/mocks/amplify-auth.ts` - Mock `aws-amplify/auth` (fake JWT, reads role from `localStorage`)
- `tests/mocks/amplify.ts` - Mock `aws-amplify` (no-op `Amplify.configure()`)
