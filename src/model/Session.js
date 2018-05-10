import jwt from 'jsonwebtoken';
import config from '../config.json';
import User from './User'

export default {
    create: data => {
        return User.findOne({
                email: data.email
            })
            .exec()
            .then((err, user) => {
                if (err) throw err;
                if (!user) throw new Error("User not found");
                console.log(err);
                console.log(user);
            })
    },
    verify: (token) => jwt.verify(token, config.sessionkey)

}