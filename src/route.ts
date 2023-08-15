import { Router } from 'express';

// const { WILD_CARD, HOME } = ROUTES;
// const testRouter = Router();
// testRouter.all(HOME, testRoute);

// // handle unknown routes in the api domain
// const invalidRoutes = Router();
// invalidRoutes.all(WILD_CARD, invalidRoute);

import authenticationRouter from './authentication/routes';
import userRouter from './users/routes';

const versionOneRouter: Router[] = [authenticationRouter, userRouter];

export default versionOneRouter;
