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

Playwright tests in `tests/` use real Cognito auth.

**Required env vars:**
- `ParkingRota:TestUser`
- `ParkingRota:TestPassword`

Auth setup saves session to `playwright/.auth/user.json`, reused by all browser projects.
