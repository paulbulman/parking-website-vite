import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../contexts/useAuthContext';

interface DecodedToken {
  'cognito:groups'?: string[];
  given_name?: string;
  [key: string]: unknown;
}

// Permission constants - single source of truth for permission strings
export const USER_ADMIN = 'UserAdmin' as const;
export const TEAM_LEADER = 'TeamLeader' as const;

export type Permission = typeof USER_ADMIN | typeof TEAM_LEADER;

interface UserClaims {
  permissions: Permission[];
  firstName: string;
}

function decodeToken(token: string): UserClaims {
  const decoded = jwtDecode<DecodedToken>(token);

  const groups = decoded['cognito:groups'] || [];
  const permissions = groups.filter(
    (group): group is Permission =>
      group === USER_ADMIN || group === TEAM_LEADER
  );

  return {
    permissions,
    firstName: decoded.given_name || '',
  };
}

const emptyClaims: UserClaims = { permissions: [], firstName: '' };

export function useUserClaims() {
  const { getToken, isAuthenticated } = useAuthContext();

  const { data = emptyClaims, isLoading } = useQuery({
    queryKey: ['userClaims', isAuthenticated],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return emptyClaims;
      return decodeToken(token);
    },
    enabled: isAuthenticated,
  });

  const { permissions, firstName } = data;

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  const isUserAdmin = (): boolean => {
    return permissions.includes(USER_ADMIN);
  };

  const isTeamLeader = (): boolean => {
    return permissions.includes(TEAM_LEADER);
  };

  return {
    hasAnyPermission,
    hasAllPermissions,
    isUserAdmin,
    isTeamLeader,
    firstName,
    isLoading,
  };
}
