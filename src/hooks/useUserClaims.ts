import { useState, useEffect } from 'react';
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

export function useUserClaims() {
  const { getToken, isAuthenticated } = useAuthContext();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClaims = async () => {
      if (!isAuthenticated) {
        setPermissions([]);
        setFirstName('');
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (!token) {
          setPermissions([]);
          setFirstName('');
          setIsLoading(false);
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);

        // Extract permissions
        const groups = decoded['cognito:groups'] || [];
        const validPermissions = groups.filter(
          (group): group is Permission =>
            group === USER_ADMIN || group === TEAM_LEADER
        );
        setPermissions(validPermissions);

        // Extract user info
        setFirstName(decoded.given_name || '');
      } catch (error) {
        console.error('Error decoding token:', error);
        setPermissions([]);
        setFirstName('');
      } finally {
        setIsLoading(false);
      }
    };

    loadClaims();
  }, [isAuthenticated, getToken]);

  // Permission helper methods
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

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
    // Permissions
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isUserAdmin,
    isTeamLeader,

    // User info
    firstName,

    // Loading state
    isLoading,
  };
}
