import express from 'express';

import userRoutes from '@modules/users/infra/http/routes';

const routes = express.Router();

routes.use(userRoutes);

routes.get('/', (request, response) => {
  return response.send('Hello world');
});

export default routes;
