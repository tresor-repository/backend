import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.send({time : new Date()}));

export default router;