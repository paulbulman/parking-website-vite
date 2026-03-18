const encode = (obj: Record<string, unknown>) =>
  btoa(JSON.stringify(obj)).replace(/=/g, '');

function buildFakeIdToken() {
  const groupsJson = localStorage.getItem('mock-cognito-groups');
  const groups = groupsJson ? JSON.parse(groupsJson) : ['UserAdmin', 'TeamLeader'];

  return [
    encode({ alg: 'RS256', typ: 'JWT' }),
    encode({
      sub: '00000000-0000-0000-0000-000000000001',
      'cognito:groups': groups,
      given_name: 'Test',
      exp: Math.floor(Date.now() / 1000) + 86400,
      token_use: 'id',
    }),
    encode({ sig: 'fake' }),
  ].join('.');
}

export async function getCurrentUser() {
  return { username: 'test-user', userId: '00000000-0000-0000-0000-000000000001' };
}

export async function fetchAuthSession() {
  return { tokens: { idToken: { toString: () => buildFakeIdToken() } } };
}

export async function signIn() {
  return { isSignedIn: true, nextStep: { signInStep: 'DONE' } };
}

export async function signOut() {}
export async function confirmSignIn() {
  return { isSignedIn: true, nextStep: { signInStep: 'DONE' } };
}
export async function resetPassword() {
  return { nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } };
}
export async function confirmResetPassword() {}
