import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
})

userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return new Promise((fullfill, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) reject(err);
            if (isMatch) {
                fullfill(this);
            } else {
                reject(new Error("Wrong Password"));
            }
        })
    })
}

const User = mongoose.model("User", userSchema);

export default User;