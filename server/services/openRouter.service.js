import ApiError from "../utils/ApiError.js";
import axios from "axios";
const askAI = async (messages) => {
    try {

        if(!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new ApiError(400, "Invalid messages format");
        }

        
        const response = await axios.post(
            process.env.OPENROUTER_MODEL_URL,
            {
                model: process.env.OPENROUTER_MODEL_NAME,
                messages: messages
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content || content.trim() === "") {
            throw new ApiError(500, "Invalid response from AI");
        }
        console.log("AI Response:", response.data?.choices?.[0]);
        return content;
    } catch (error) {
        console.error("Error asking AI:", error);
        throw new ApiError(500, "Failed to get response from AI");
    }
};

export default askAI;

