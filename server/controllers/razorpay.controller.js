import Payment from "../models/razorpay.model.js";
import rezorpay from "../services/rezorpay.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from 'crypto';
import User from "../models/user.model.js"
const createOrder = async (req, res) => {
    try {
        console.log("call the create order")
        const { planId, amount, credits } = req.body;
        const userId = req.userId;
        if (!planId || !amount || !credits ) {
            return res.status(400).json(new ApiError("Missing required fields", 400));
        }

        if(!userId) {
            return res.status(400).json(new ApiError("user id needed for payment", 400));
        }

        const option = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        const order = await rezorpay.orders.create(option);
        // console.log("order -> ",order)


        await Payment.create({
            userId: userId,
            planId, 
            amount, 
            credits, 
            razorpayOrderId: order.id,
            status: "created"

        });
        await User.findByIdAndUpdate(userId,{
         $inc: {credits: credits}
     }, {new:true});

        return res.status(200).json(new ApiResponse(200,order,"order created successfully "))
    } catch (error) {
        throw new ApiError(500,"Failed to create order -> "+error);
    }
}


const verifyPayment = async(req, res) => {

   try {
     const {
         razorpay_order_id,
         razorpay_payment_id,
         razorpay_signature
     } = req.body;

     console.log("verify payment")
     console.log( razorpay_order_id,
         razorpay_payment_id,
         razorpay_signature)
 
     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
 
     const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        console.log("expectedSignature", expectedSignature)
     
     if(expectedSignature !== razorpay_signature) {
        console.log("signature not same ")
         return res.status(400).json(new ApiError(400,"Invalid payment signature"));
     }
 
 
     const payment = await Payment.findOne({
         razorpayOrderId: razorpay_order_id
     });
 
     if(!payment) {
        return res.status(404).json(new ApiError(404,"Pyament not found"));
     }
 
     if(payment.status === "paid") {
         return res.status(200).json(new ApiResponse(200,"Pyament verification already done"));
     }
 
     // update payment record
     payment.status = "paid";
     payment.razorpayPaymentId = razorpay_payment_id;
     await payment.save();
 
     // add credits
     const updatedUser = await User.findByIdAndUpdate(payment.userId,{
         $inc: {credits: payment.credits}
     }, {new:true});
 
     return res
         .status(200)
         .json(new ApiResponse(
             200,
             updatedUser,
             "Payment verified and credits added"
         ));
   } catch (error) {
        console.error("verify payment error :",error);
        throw new ApiError(500,"Failed to verify payment Error: "+error);
   }
}

export {
    verifyPayment,
    createOrder
}