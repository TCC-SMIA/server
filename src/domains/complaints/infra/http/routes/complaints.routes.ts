import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multerConfig';

import ComplaintsController from '@domains/complaints/infra/http/controllers/ComplaintsController';
import ImageComplaintController from '@domains/complaints/infra/http/controllers/ImageComplaintController';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import ComplaintStatusController from '../controllers/ComplaintStatusController';
import resolveComplaintValidator from '../validators/ResolveComplaintValidator';

const complaintsRoutes = Router();
const upload = multer(multerConfig.multer);

complaintsRoutes.use(ensureAuthenticate);

complaintsRoutes.post('/', upload.single('image'), ComplaintsController.create);

complaintsRoutes.put('/update', ComplaintsController.update);

complaintsRoutes.patch(
  '/resolve',
  resolveComplaintValidator,
  ComplaintStatusController.update,
);

complaintsRoutes.get('/', ComplaintsController.index);

complaintsRoutes.delete('/delete', ComplaintsController.delete);

complaintsRoutes.patch(
  '/image',
  upload.single('image'),
  ImageComplaintController.update,
);

export default complaintsRoutes;
