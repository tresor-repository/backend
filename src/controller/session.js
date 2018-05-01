import jwt from 'jsonwebtoken';

export default {
        create: (req, res, next) => {
                res.status(200).send({"result":"ok"});
        }
}
            
