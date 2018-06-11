import mongoose from "mongoose";
import Counter from './Counter';
import {
    NotFoundError,
    UnauthorizedError
} from "../errors";

const counterSpendingId = 'spendingId';

Counter.findById(counterSpendingId).then(data => {
    if (data === null)
        new Counter({
            _id: counterSpendingId
        }).save()
})

const spendingSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    amount: Number,
    tags: [String],
    date: Date,
    info: String,
    category: String
})

spendingSchema.pre('save', function (next) {
    const doc = this;
    Counter.findByIdAndUpdate({
        _id: counterSpendingId
    }, {
        $inc: {
            seq: 1
        }
    }, function (error, counter) {
        if (error) return next(error);
        console.log("ini counter " + counter);
        doc._id = counter.seq;
        next();
    })
})

const Spending = mongoose.model("Spending", spendingSchema);

Spending.findByIdAndUser = function findByIdAndUser(spendingId, userId) {
    return Spending.findById(spendingId).then(spending => {
        if (!spending) throw new NotFoundError();
        if (spending.userId !== userId) throw new UnauthorizedError();
        return spending;
    })
}

export default Spending;