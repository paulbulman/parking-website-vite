import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

interface DecodedToken {
  'cognito:groups'?: string[];
  [key: string]: unknown;
}

export type Permission = 'UserAdmin' | 'TeamLeader';

export function usePermissions() {
  const { getAuthToken, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!isAuthenticated) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        const token = await getAuthToken();
        if (!token) {
          setPermissions([]);
          setIsLoading(false);
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const groups = decoded['cognito:groups'] || [];

        // Filter to only valid permission types
        const validPermissions = groups.filter(
          (group): group is Permission =>
            group === 'UserAdmin' || group === 'TeamLeader'
        );

        setPermissions(validPermissions);
      } catch (error) {
        console.error('Error decoding token:', error);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [isAuthenticated, getAuthToken]);

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
    return permissions.includes('UserAdmin');
  };

  const isTeamLeader = (): boolean => {
    return permissions.includes('TeamLeader');
  };

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isUserAdmin,
    isTeamLeader,
  };
}
