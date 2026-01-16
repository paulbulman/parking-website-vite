import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserClaims, type Permission } from '../hooks/useUserClaims';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: Permission[];
  requireAll?: boolean;
}

export function PermissionGuard({
  children,
  requiredPermissions,
  requireAll = false,
}: PermissionGuardProps) {
  const { isLoading, hasAnyPermission, hasAllPermissions } = useUserClaims();

  if (isLoading) {
    return null;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
