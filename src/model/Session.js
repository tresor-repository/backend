import jwt from 'jsonwebtoken';
import config from '../config.json';

export default {
        create: (req, res, next) => {
                const token = jwt.sign({userId: 5}, config.sessionkey);
                console.log(token);
                res.status(200).send({"session":token});
        },
        verify: (token) => jwt.verify(token, config.sessionkey)
                
}
            
