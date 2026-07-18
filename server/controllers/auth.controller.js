import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import  ApiResponse  from "../utils/ApiResponse.js";
const googleAuth = async (req, res) => {
    try {
        console.log("google called")
        const { name, email } = req.body;
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            existingUser = await User.create({ name, email, credits: 100 });
        }

        const token = generateToken(existingUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    existingUser,
                    "User authenticated successfully",
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Error during Google authentication: " + error.message,
        );
    }
};

const logOut = async (req, res) => {
    try {
        console.log("logout called ")
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        console.log("User logged out successfully");
        return res
            .status(200)
            .json(new ApiResponse(200, null, "User logged out successfully"));
    } catch (error) {
        throw new ApiError(500, "Error during logout: " + error.message);
    }
};
export { googleAuth, logOut };
