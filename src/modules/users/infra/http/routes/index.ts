import express from 'express';
import UsersController from '../controllers/UsersController';

const userRoutes = express.Router();

userRoutes.post('/users', UsersController.create);

export default userRoutes;
