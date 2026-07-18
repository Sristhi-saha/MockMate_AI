import ApiError from "../utils/ApiError.js";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import askAI from "../services/openRouter.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import Interview from "../models/interview.model.js";
import User from "../models/user.model.js";

const analyseResume = async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(400, "No resume file uploaded");
        }

        const filePath = req.file.path;
        console.log(filePath);

        const fileBuffer = await fs.promises.readFile(filePath);
        const uint8Array = new Uint8Array(fileBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `
                Extract structured data from resume.
                
                Return strictly JSON:
                {
                    "role":"string",
                    "experience":"string",
                    "projects": ["project1","project2"],
                    "skills": ["skill1","skill2"]
                }
                `,
            },
            {
                role: "user",
                content: resumeText,
            },
        ];

        const aiResponse = await askAI(messages);

        // Extract content safely (remove ```json ... ``` if present)
        let aiText = aiResponse.message?.content || aiResponse;
        aiText = aiText.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(aiText);
        } catch (e) {
            console.error("Failed to parse AI response:", aiText);
            throw new ApiError(500, "AI response is not valid JSON");
        }

        // Delete uploaded resume
        fs.unlinkSync(filePath);

        const data = {
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText,
        };

        return res
            .status(200)
            .json(new ApiResponse(200, data, "Resume analyzed successfully"));
    } catch (error) {
        console.error("Error analyzing resume:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        throw new ApiError(500, "Failed to analyze resume");
    }
};

const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } =
            req.body || {};

        console.log(mode, resumeText);

        if (!role || !experience || !mode) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        role = role.trim();
        experience = experience.trim();
        mode = mode.trim();

        const userId = req.userId;
        if (!userId) {
            throw new ApiError(401, "Unauthorized at generate questions");
        }

        const userData = await User.findById(userId);

        if (!userData) {
            throw new ApiError(404, "User not found at generate questions");
        }

        if (userData.credits <= 0) {
            throw new ApiError(
                403,
                "Insufficient credits at generate questions",
            );
        }

        const porjectText =
            Array.isArray(projects) && projects.length
                ? projects.join(", ")
                : "None";
        const skillText =
            Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
       Role: ${role}
       Experience: ${experience}
       Interview Mode: ${mode}
       Projects: ${porjectText}
       Skills: ${skillText}
       Resume: ${safeResume}
       `;

        const messages = [
            {
                role: "system",
                content: `You are a real human interviewer conducting a professional interview.
                        Speak in simple, natural English as if you are directly talking to the candidate.

                        Generate exactly 5 interview questions.

                        Strict Rules:
                        - Each question must contain between 15 and 25 words.
                        - Each question must be a single complete sentence.
                        - Do NOT number them.
                        - Do NOT add explanations.
                        - Do NOT add extra text before or after.
                        - One question per line only.
                        - Keep language simple and conversational.
                        - Questions must feel practical and realistic.

                        Difficulty progression:
                        Question 1 → easy  
                        Question 2 → easy  
                        Question 3 → medium  
                        Question 4 → medium  
                        Question 5 → hard  

                        Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.`,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ];

        const aiResponse = await askAI(messages);

        if (!aiResponse || aiResponse.trim().length === 0) {
            console.error("AI returned empty response for questions");
            throw new ApiError(500, "AI failed to generate questions");
        }

        const questions = aiResponse
            .split("\n")
            .map((q) => q.trim())
            .filter((q) => q.length > 0)
            .slice(0, 5);

        if (questions.length < 5) {
            console.error(
                `AI generated insufficient questions. Expected 5 but got ${questions.length}. Response: ${aiResponse}`,
            );
            throw new ApiError(
                500,
                "AI generated insufficient questions, expected 5",
            );
        }

        userData.credits -= 50;
        await userData.save();

        const interviewData = await Interview.create({
            userId,
            role,
            experience,
            mode,
            resumeText,
            questions: questions.map((q, index) => {
                let difficulty = "easy";
                let timeLimit = 60;
                if (index >= 2 && index < 4) {
                    timeLimit = 90;
                    difficulty = "medium";
                } else if (index === 4) {
                    timeLimit = 120;
                    difficulty = "hard";
                }
                return {
                    question: q,
                    difficulty,
                    timeLimit,
                };
            }),
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    interviewId: interviewData._id,
                    questions: interviewData.questions,
                    userName: userData.name,
                    creditsLeft: userData.credits,
                },
                "Questions generated successfully",
            ),
        );
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new ApiError(500, "Failed to generate questions"); // 5:53:00
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIdx, answer, timeTaken } = req.body;

        if (!interviewId || questionIdx === undefined) {
            throw new ApiError(400, "Missing required fields to submit answer");
        }

        const interviewData = await Interview.findById(interviewId);

        if (!interviewData) {
            throw new ApiError(404, "Interview not found at submit answer");
        }

        const questionData = interviewData.questions[questionIdx];

        if (!questionData) {
            throw new ApiError(404, "Question not found at submit answer");
        }

        // answer not submit
        if (!answer || answer.trim().length === 0) {
            questionData.score = 0;
            questionData.answer = "";
            questionData.feedback = "You did not submit an answer.";
            await interviewData.save();
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        feedback: questionData.feedback,
                    },
                    "Answer submitted successfully with no answer",
                ),
            );
        }

        // time limit exceed
        if (timeTaken > questionData.timeLimit) {
            questionData.score = 0;
            questionData.answer = answer;
            questionData.feedback = `Time limit exceeded. You took ${timeTaken} seconds but the limit was ${questionData.timeLimit} seconds.`;
            await interviewData.save();
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        feedback: questionData.feedback,
                    },
                    "Answer submitted successfully with time limit exceeded",
                ),
            );
        }

        const messages = [
            {
                role: "system",
                content: `
                You are a professional human interviewer evaluating a candidate's answer in a real interview.

                Evaluate naturally and fairly, like a real person would.

                Score the answer in these areas (0 to 10):

                1. Confidence – Does the answer sound clear, confident, and well-presented?
                2. Communication – Is the language simple, clear, and easy to understand?
                3. Correctness – Is the answer accurate, relevant, and complete?

                Rules:
                - Be realistic and unbiased.
                - Do not give random high scores.
                - If the answer is weak, score low.
                - If the answer is strong and detailed, score high.
                - Consider clarity, structure, and relevance.

                Calculate:
                finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                Feedback Rules:
                - Write natural human feedback.
                - 10 to 15 words only.
                - Sound like real interview feedback.
                - Can suggest improvement if needed.
                - Do NOT repeat the question.
                - Do NOT explain scoring.
                - Keep tone professional and honest.

                Return ONLY valid JSON in this format:

                {
                "confidence": number,
                "communication": number,
                "correctness": number,
                "finalScore": number,
                "feedback": "short human feedback"
                }
                `,
            },
            {
                role: "user",
                content: `
                Question: ${questionData.question}
                Answer: ${answer}`,
            },
        ];

        const aiResponse = await askAI(messages);

        const parsed = JSON.parse(aiResponse);

        questionData.answer = answer;
        questionData.confidence = parsed.confidence;
        questionData.communication = parsed.communication;
        questionData.correctness = parsed.correctness;
        questionData.score = parsed.finalScore;
        questionData.feedback = parsed.feedback;

        await interviewData.save();
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    feedback: questionData.feedback,
                },
                "Answer submitted and evaluated successfully",
            ),
        );
    } catch (error) {
        throw new ApiError(500, "Failed to submit answer");
    }
};

const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        if (!interviewId) {
            throw new ApiError(400, "Missing interviewId to finish interview");
        }
        const interviewData = await Interview.findById(interviewId);
        if (!interviewData) {
            throw new ApiError(404, "Interview not found at finish interview");
        }

        const totalQuestion = interviewData.questions.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interviewData.questions.forEach((q) => {
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        });

        const averageScore =
            totalQuestion > 0 ? Math.round(totalScore / totalQuestion) : 0;
        const averageConfidence =
            totalQuestion > 0 ? Math.round(totalConfidence / totalQuestion) : 0;
        const averageCommunication =
            totalQuestion > 0
                ? Math.round(totalCommunication / totalQuestion)
                : 0;
        const averageCorrectness =
            totalQuestion > 0
                ? Math.round(totalCorrectness / totalQuestion)
                : 0;

        interviewData.finalScore = averageScore;
        interviewData.status = "completed";
        await interviewData.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    finalScore: Number(averageScore.toFixed(1)),
                    confidence: Number(averageConfidence.toFixed(1)),
                    communication: Number(averageCommunication.toFixed(1)),
                    correctness: Number(averageCorrectness.toFixed(1)),
                    questionWiseData: interviewData.questions.map((q) => ({
                        question: q.question,
                        answer: q.answer,
                        score: q.score,
                        confidence: q.confidence,
                        communication: q.communication,
                        correctness: q.correctness,
                        feedback: q.feedback,
                    })),
                },
                "Interview finished successfully",
            ),
        );
    } catch (error) {
        throw new ApiError(500, "Failed to finish interview");
    }
};
const getMyInterviews = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(400, "Missing userId to get my interviews");
        }

        const interviews = await Interview.find({ userId })
            .sort({ createdAt: -1 })
            .select("role experience mode finalScore status createdAt");

        if (!interviews) {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { interviews: [] },
                        "No interviews found",
                    ),
                );
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    interviews,
                },
                "My interviews fetched successfully",
            ),
        );
    } catch (error) {
        console.error("Error fetching my interviews:", error);
        throw new ApiError(500, "Failed to fetch my interviews");
    }
};

const getInterviewReport = async (req, res) => {
    console.log('clicked getInterviewReport');
    try {
        const interviewId = req.params.id;
        const userId = req.userId;
        console.log(interviewId,userId)

        let interviewData;

        if (!interviewId) {
            interviewData = await Interview.findOne({ userId }).sort({ createdAt: -1 });
            if (!interviewData) {
                return res.status(404).json(new ApiResponse(404, null, "No interviews found"));
            }
        } else {
            interviewData = await Interview.findOne({ _id: interviewId, userId });
            if (!interviewData) {
                return res.status(404).json(new ApiResponse(404, null, "Interview not found"));
            }
        }
        console.log("interview - ",interviewData)

        const totalQuestion = interviewData.questions.length;
        let totalConfidence = 0, totalCommunication = 0, totalCorrectness = 0;

        interviewData.questions.forEach(q => {
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        });

        const averageConfidence = totalQuestion ? Math.round(totalConfidence / totalQuestion) : 0;
        const averageCommunication = totalQuestion ? Math.round(totalCommunication / totalQuestion) : 0;
        const averageCorrectness = totalQuestion ? Math.round(totalCorrectness / totalQuestion) : 0;

        return res.status(200).json(
            new ApiResponse(200, {
                mode: interviewData.mode,
                finalScore: Number(interviewData.finalScore.toFixed(1)),
                confidence: averageConfidence,
                communication: averageCommunication,
                correctness: averageCorrectness,
                questionWiseData: interviewData.questions,
            }, "Interview report fetched successfully")
        );

    } catch (error) {
        console.error("Error fetching interview report:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch interview report"));
    }
};

export {
    analyseResume,
    generateQuestions,
    finishInterview,
    submitAnswer,
    getMyInterviews,
    getInterviewReport,
};