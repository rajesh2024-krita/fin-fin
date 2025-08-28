export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

export function canAccessSociety(userRole: string, userSocietyId?: string, targetSocietyId?: string): boolean {
  if (userRole === 'SuperAdmin') return true;
  if (userRole === 'SocietyAdmin' && userSocietyId === targetSocietyId) return true;
  return false;
}
