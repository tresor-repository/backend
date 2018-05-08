import express from 'express';
import common from './common';
import users from './user';
import session from '../model/session';

const router = express.Router();

router.get('/', (req, res) => res.send({serverTime : new Date()}));
router.post('/users/', common.validator(users.create.validation), users.create.handle);
router.post('/session/', session.create);
router.get('/me/', common.session)

export default router;
