export const BASE_AUTH_ROUTE = '/auth';
const authRoute = (path: string) => `${BASE_AUTH_ROUTE}${path}`;

const ROUTES = {
  LOGIN: authRoute('/login'),
  SIGNUP: authRoute('/signup'),
  FORGOT_PASSWORD: authRoute('/forget-password'),
  RESET_PASSWORD: authRoute('/reset-password'),
  CHANGE_PASSWORD: authRoute('/change-password'),
  GOOGLE_OAUTH: authRoute('/google/oauth'),
};

export default ROUTES;
