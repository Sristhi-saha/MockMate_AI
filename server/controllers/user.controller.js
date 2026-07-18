import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";

const getCurrentUser = async (req, res) => {
   try {
     const userId = req.userId; // Assuming the user ID is stored in req.user by the authentication middleware
     if(!userId) {
         throw new ApiError(401, "Unauthorized: No user ID found");
     }
 
     const exsistingUser = await User.findById(userId);
     if(!exsistingUser) {
         throw new ApiError(404, "User not found");
     }
 
     return res.status(200).json(new ApiResponse(200, exsistingUser.toObject(), "User fetched successfully"));
   } catch (error) {
        throw new ApiError(500, "Error fetching user: " + error.message);
   }
};

export {getCurrentUser};