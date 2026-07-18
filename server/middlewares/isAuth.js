import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
const isAuth = (req, res, next) => {
    try {
        console.log("isAuth")

        const token = req.cookies.token || req.body.cookies.token;

        console.log("Token from cookie: ", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decodedValue = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!decodedValue || !decodedValue.userId) {
            throw new ApiError(401, "Unauthorized: Invalid token");
        }

        // console.log("Decoded token value: ", decodedValue);

        req.userId = decodedValue.userId;
        console.log(req.userId);
        const decodedValues = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Decoded value:', decodedValues) // ← add this
        console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET) // ← add this
        console.log(decodedValues.userId)
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized: Token has expired");
        } else {
            throw new ApiError(401, "Error verifying token: " + error.message);
        }
    }
};

export default isAuth;