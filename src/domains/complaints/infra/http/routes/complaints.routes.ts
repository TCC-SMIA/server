import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multerConfig';

import ComplaintsController from '@domains/complaints/infra/http/controllers/ComplaintsController';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';

const complaintsRoutes = Router();
const upload = multer(multerConfig.multer);

complaintsRoutes.use(ensureAuthenticate);

complaintsRoutes.post('/', upload.single('image'), ComplaintsController.create);
complaintsRoutes.put('/update', ComplaintsController.update);
complaintsRoutes.get('/', ComplaintsController.index);
complaintsRoutes.delete('/delete', ComplaintsController.delete);

export default complaintsRoutes;
