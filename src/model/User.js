import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import Counter from './Counter';

const userSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: String
});

const counterUserId = 'userId'

Counter.findById(counterUserId).then(data => {
    if (data === null) 
        new Counter({_id : counterUserId}).save();
})

userSchema.pre('save', function (next) {
    const doc = this;
    Counter.findByIdAndUpdate({
        _id: counterUserId
    }, {
        $inc: {
            seq: 1
        }
    }, function (error, counter) {
        if (error) return next(error);
        doc._id = counter.seq;
        next();
    })
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