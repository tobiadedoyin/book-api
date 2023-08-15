export const BASE_AUTH_ROUTE = '/users';
const authRoute = (path = '') => `${BASE_AUTH_ROUTE}${path}`;

const ROUTES = {
  GET_USER: authRoute(),
};

export default ROUTES;
