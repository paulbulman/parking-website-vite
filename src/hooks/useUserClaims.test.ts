import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';
import { useUserClaims, USER_ADMIN, TEAM_LEADER } from './useUserClaims';

const encode = (obj: Record<string, unknown>) =>
  btoa(JSON.stringify(obj)).replace(/=/g, '');

function buildToken(groups: string[], givenName = 'Test'): string {
  return buildTokenFromClaims({
    'cognito:groups': groups,
    given_name: givenName,
  });
}

function buildTokenFromClaims(claims: Record<string, unknown>): string {
  return [
    encode({ alg: 'RS256', typ: 'JWT' }),
    encode({
      sub: 'user-1',
      exp: Math.floor(Date.now() / 1000) + 86400,
      token_use: 'id',
      ...claims,
    }),
    encode({ sig: 'fake' }),
  ].join('.');
}

function createAuthContext(overrides: Partial<AuthContextType> = {}): AuthContextType {
  return {
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin', 'TeamLeader'])),
    refreshAuthStatus: vi.fn(),
    ...overrides,
  };
}

function createWrapper(authContext: AuthContextType) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(AuthContext.Provider, { value: authContext }, children);
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useUserClaims', () => {
  it('extracts permissions from JWT groups', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin', 'TeamLeader'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toContain(USER_ADMIN);
    expect(result.current.permissions).toContain(TEAM_LEADER);
  });

  it('extracts first name from JWT', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin'], 'Alice')),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.firstName).toBe('Alice');
  });

  it('returns empty permissions when no groups in token', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken([])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([]);
  });

  it('returns empty permissions when not authenticated', async () => {
    const auth = createAuthContext({
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([]);
    expect(result.current.firstName).toBe('');
  });

  it('returns empty permissions when token is undefined', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(undefined),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([]);
  });

  it('filters out invalid group names', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin', 'SomeOtherGroup'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([USER_ADMIN]);
  });

  it('hasPermission returns true for matching permission', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasPermission(USER_ADMIN)).toBe(true);
    expect(result.current.hasPermission(TEAM_LEADER)).toBe(false);
  });

  it('isUserAdmin and isTeamLeader helpers work correctly', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['TeamLeader'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isUserAdmin()).toBe(false);
    expect(result.current.isTeamLeader()).toBe(true);
  });

  it('hasAnyPermission returns true when at least one permission matches', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['TeamLeader'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAnyPermission([USER_ADMIN, TEAM_LEADER])).toBe(true);
    expect(result.current.hasAnyPermission([USER_ADMIN])).toBe(false);
  });

  it('hasAllPermissions returns true only when all permissions match', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin', 'TeamLeader'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAllPermissions([USER_ADMIN, TEAM_LEADER])).toBe(true);
    expect(result.current.hasAllPermissions([USER_ADMIN])).toBe(true);
  });

  it('hasAllPermissions returns false when a permission is missing', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildToken(['UserAdmin'])),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAllPermissions([USER_ADMIN, TEAM_LEADER])).toBe(false);
  });

  it('handles token missing cognito:groups and given_name claims', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue(buildTokenFromClaims({})),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([]);
    expect(result.current.firstName).toBe('');
  });

  it('handles malformed token gracefully', async () => {
    const auth = createAuthContext({
      getToken: vi.fn().mockResolvedValue('not-a-valid-jwt'),
    });

    const { result } = renderHook(() => useUserClaims(), {
      wrapper: createWrapper(auth),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions).toEqual([]);
    expect(result.current.firstName).toBe('');
  });
});
