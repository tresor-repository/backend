import express from 'express';
import users from './controller/users';
const router = express.Router();

router.get('/', (req, res) => res.send({serverTime : new Date()}));
router.post('/users/', users.create)

export default router;