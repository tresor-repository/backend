import express from 'express';
import common from './common';
import users from './user';
import spending from './spending';
import session from './session';

const router = express.Router();

router.get('/', (req, res) => res.send({serverTime : new Date()}));
router.post('/users/', common.validator(users.create.validation), users.create.handle);
router.post('/session/', common.validator(session.create.validation), session.create.handle);
router.get('/me/', session.middleware, users.get)
router.post('/spendings', session.middleware, common.validator(spending.post.validation), spending.post.handle)
router.get('/spendings/:spendingId', session.middleware, spending.get)
router.delete('/spendings/:spendingId', session.middleware, spending.remove)
router.patch('/spendings/:spendingId', session.middleware, spending.update)

export default router;
