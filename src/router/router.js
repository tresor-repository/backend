import express from 'express';
import common from './common';
import users from '../controller/users';

const router = express.Router();

router.get('/', (req, res) => res.send({serverTime : new Date()}));
router.post('/users/', common.validator(users.create.validation), users.create.handle);

export default router;