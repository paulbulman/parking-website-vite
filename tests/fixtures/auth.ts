import type { Page } from '@playwright/test';

export type Role = 'userAdmin' | 'teamLeader' | 'both' | 'none';

const roleToCognitoGroups: Record<Role, string[]> = {
  userAdmin: ['UserAdmin'],
  teamLeader: ['TeamLeader'],
  both: ['UserAdmin', 'TeamLeader'],
  none: [],
};

export async function authenticateAs(page: Page, role: Role) {
  const groups = roleToCognitoGroups[role];
  await page.addInitScript((groups) => {
    localStorage.setItem('mock-cognito-groups', JSON.stringify(groups));
  }, groups);
}
