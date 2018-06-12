import express from 'express';
import common from './common';
import users from './user';
import spending from './spending';
import session from './session';
import tag from './tag';
import datehelper from '../helper/date';

const router = express.Router();

router.get('/', (req, res) => res.send({
    serverTime: new Date()
}));
router.post('/users/', common.validator(users.create.validation), users.create.handle);
router.post('/session/', common.validator(session.create.validation), session.create.handle);
router.get('/me/', session.middleware, users.get)
router.post('/spendings', session.middleware, common.validator(spending.post.validation), common.validator(spending.validation), spending.post.handle)
router.get('/spendings/days', session.middleware, datehelper.validateStartEnd, spending.getPerDays)
router.get('/spendings/:spendingId', session.middleware, spending.get)
router.delete('/spendings/:spendingId', session.middleware, spending.remove)
router.patch('/spendings/:spendingId', session.middleware, common.validator(spending.validation), spending.update)
router.get('/spendings', session.middleware, spending.getList)
router.get('/tags', session.middleware, datehelper.validateStartEnd, tag.get.handle);
export default router;