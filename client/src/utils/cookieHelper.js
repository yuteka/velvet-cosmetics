import Cookies from 'js-cookie';

const SESSION_OPTIONS = { expires: 1, secure: true, sameSite: 'Strict' };
const REMEMBER_OPTIONS = { expires: 30, secure: true, sameSite: 'Strict' };

export const setAuthCookies = (session, rememberMe = false) => {
  const options = rememberMe ? REMEMBER_OPTIONS : SESSION_OPTIONS;
  Cookies.set('velvet_access_token', session.access_token, options);
  Cookies.set('velvet_refresh_token', session.refresh_token, options);
  Cookies.set('velvet_user_id', session.user.id, options);
};

export const getAuthCookies = () => ({
  accessToken: Cookies.get('velvet_access_token'),
  refreshToken: Cookies.get('velvet_refresh_token'),
  userId: Cookies.get('velvet_user_id'),
});

export const clearAuthCookies = () => {
  Cookies.remove('velvet_access_token');
  Cookies.remove('velvet_refresh_token');
  Cookies.remove('velvet_user_id');
};