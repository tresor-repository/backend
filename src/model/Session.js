import jwt from 'jsonwebtoken';
import config from '../config.json';
import User from './User'

export default {
    create: data => {
        console.log(data.email);
        return User.findOne({
                email: data.email
            })
            .then((user, err) => {
                if (err) throw err;
                if (user === undefined) throw new Error("User not found");
                return user;
            })
            .then(user => user.comparePassword(data.password))
            .then(user => jwt.sign({
                email: user.email
            }, config.sessionkey))
    },
    verify: (token) => new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(token, config.sessionkey))
        } catch (err) {
            reject(err)
        }
    }),
};