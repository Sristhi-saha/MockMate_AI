import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    }
}, {timestamps: true});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;