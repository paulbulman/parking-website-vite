# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a parking management website built with React, TypeScript, and Vite. The application handles parking space allocation, reservations, and requests with role-based access control.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build locally
npm run preview
```

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7.12
- **Authentication**: AWS Cognito via AWS Amplify
- **API Integration**: TanStack Query (React Query) for data fetching
- **Styling**: Tailwind CSS
- **JWT Handling**: jwt-decode for token parsing
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, and React Refresh plugins
- **TypeScript**: v5.9.3 with strict mode enabled

## TypeScript Configuration

The project uses TypeScript project references with two separate configurations:
- `tsconfig.app.json` - For application code in `src/`
- `tsconfig.node.json` - For Vite config and Node.js code

Strict mode is enabled with additional checks:
- `noUnusedLocals`, `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`
- `erasableSyntaxOnly`

## Application Architecture

### Authentication & Authorization

**Authentication** is handled via AWS Cognito:
- Configuration: `src/amplifyconfiguration.ts` (uses `VITE_USER_POOL_ID` and `VITE_USER_POOL_CLIENT_ID`)
- Auth Context: `src/contexts/AuthContext.tsx` provides:
  - `isAuthenticated` - boolean flag
  - `login(username, password)` - sign in method
  - `logout()` - sign out method
  - `getAuthToken()` - retrieves JWT ID token for API calls

**Authorization** uses JWT claims from Cognito:
- Permissions Hook: `src/hooks/usePermissions.ts` decodes JWT and extracts `cognito:groups`
- Two permission types:
  - `UserAdmin` - Can access user management
  - `TeamLeader` - Can access reservations and override requests
- Permission Guard: `src/components/PermissionGuard.tsx` protects routes
- Users without permission see: `src/pages/AccessDenied.tsx`

### Routing Structure

All routes defined in `src/App.tsx`:

**Public Routes:**
- `/login` - Login page

**Protected Routes** (require authentication):
- `/` - Home/Summary page (calendar view of parking allocations)
- `/edit-requests` - Edit parking requests
- `/registration-numbers` - Manage vehicle registration numbers
- `/profile` - User profile
- `/faq` - FAQ page

**Permission-Protected Routes:**
- `/edit-reservations` - Requires `TeamLeader` permission
- `/override-requests` - Requires `TeamLeader` permission
- `/users` - Requires `UserAdmin` permission
- `/access-denied` - Shown when user lacks required permissions

### API Integration

API calls use TanStack Query with helpers in `src/hooks/api/helpers.ts`:
- All requests include `Authorization: Bearer <token>` header
- Token automatically fetched from Cognito session
- Query hooks located in `src/hooks/api/queries/`
- Example: `src/hooks/api/queries/summary.ts` - fetches parking summary data

### Code Structure

```
src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Router and provider configuration
├── amplifyconfiguration.ts     # AWS Cognito configuration
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── hooks/
│   ├── usePermissions.ts       # JWT permission extraction
│   └── api/
│       ├── helpers.ts          # API request utilities
│       └── queries/            # React Query hooks
├── components/
│   ├── Layout.tsx              # Main layout with navbar (permission-aware)
│   ├── PublicLayout.tsx        # Layout for public pages
│   ├── ProtectedRoute.tsx      # Authentication guard
│   └── PermissionGuard.tsx     # Authorization guard
└── pages/
    ├── Login.tsx
    ├── Home.tsx                # Summary/calendar view
    ├── EditRequests.tsx
    ├── EditReservations.tsx    # TeamLeader only
    ├── OverrideRequests.tsx    # TeamLeader only
    ├── Users.tsx               # UserAdmin only
    ├── AccessDenied.tsx        # Permission denied page
    ├── Profile.tsx
    ├── FAQ.tsx
    └── RegistrationNumbers.tsx
```

### Navigation

The navbar (`src/components/Layout.tsx`) conditionally displays items based on user permissions:
- "Edit Reservations" - only shown to TeamLeaders
- "Override Requests" - only shown to TeamLeaders
- "Users" - only shown to UserAdmins
- Works on both desktop and mobile layouts

## Common Patterns

### Calendar-Based Pages

Many pages display data in a calendar format with a consistent structure:

**Data Structure:**
```typescript
{
  weeks: [
    {
      days: [
        {
          localDate: "2024-01-15",  // ISO date string
          hidden: false,             // true for empty calendar cells
          data: { /* day-specific data */ }
        }
      ]
    }
  ]
}
```

**Read-Only Calendar** (e.g., `Home.tsx`):
- Directly renders data from the query
- Uses color coding and status labels
- No local state needed

**Editable Calendar** (e.g., `EditReservations.tsx`):
- Maintains local state initialized from query data
- Pattern:
  ```typescript
  const [selections, setSelections] = useState<Record<string, DataType>>({});

  useEffect(() => {
    // Initialize from API data when it loads
    const initial = {};
    data.weeks.forEach(week => {
      week.days.forEach(day => {
        if (!day.hidden && day.data) {
          initial[day.localDate] = day.data.value;
        }
      });
    });
    setSelections(initial);
  }, [data]);
  ```
- User interactions update local state
- State is later submitted via PATCH request

### Permission Constants

Permission strings are defined once in `src/hooks/usePermissions.ts`:
```typescript
export const USER_ADMIN = 'UserAdmin' as const;
export const TEAM_LEADER = 'TeamLeader' as const;
```

Always import and use these constants instead of string literals:
```typescript
import { USER_ADMIN, TEAM_LEADER } from '../hooks/usePermissions';

<PermissionGuard requiredPermissions={[TEAM_LEADER]}>
```

This ensures all references update together if permission strings change.

## ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- Recommended rules from @eslint/js, typescript-eslint
- React Hooks rules (flat config)
- React Refresh rules for Vite HMR
- Global ignores for `dist/` directory
