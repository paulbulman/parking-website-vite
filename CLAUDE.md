# CLAUDE.md

Parking management website with React, TypeScript, Vite. Role-based access via AWS Cognito.

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
npm test         # Playwright tests
npm run test:ui  # Playwright UI
```

## Key Files

- `src/contexts/AuthContext.tsx` - Auth state, provides `getAuthToken()` for API calls
- `src/hooks/usePermissions.ts` - Extracts permissions from JWT `cognito:groups`
- `src/hooks/api/helpers.ts` - API utilities, auto-attaches auth header
- `src/App.tsx` - All routes defined here

## Permissions

Two types: `UserAdmin` (user management), `TeamLeader` (reservations, override requests).

Always use the exported constants, never string literals:
```typescript
import { USER_ADMIN, TEAM_LEADER } from '../hooks/usePermissions';
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

Two test modes via Playwright:

**Mock tests** (`tests/mock/`): Use `page.route()` to intercept API calls with fake data. No env vars needed. Fast and deterministic.
```bash
npx playwright test --project=mock-chromium
```

**Smoke tests** (`tests/smoke/`): Hit real API via Cognito auth. Require env vars:
- `ParkingRota:TestUser`
- `ParkingRota:TestPassword`
```bash
npx playwright test --project=smoke-chromium
```

Mock tests run against a separate dev server (`--mode mock-test` on port 5174) where `aws-amplify` is replaced with mock modules via Vite aliases (see `vite.config.ts`).

Key test infrastructure:
- `tests/mocks/amplify-auth.ts` - Mock `aws-amplify/auth` (fake JWT with configurable claims)
- `tests/mocks/amplify.ts` - Mock `aws-amplify` (no-op `Amplify.configure()`)
- `tests/mocks/handlers.ts` - Mock API response data and `page.route()` helpers per endpoint
