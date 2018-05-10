import express from 'express';
import common from './common';
import users from './user';
import session from './session';

const router = express.Router();

router.get('/', (req, res) => res.send({serverTime : new Date()}));
router.post('/users/', common.validator(users.create.validation), users.create.handle);
router.post('/session/', common.validator(session.create.validation), session.create.handle);
router.get('/me/', session.middleware, users.get)

export default router;
