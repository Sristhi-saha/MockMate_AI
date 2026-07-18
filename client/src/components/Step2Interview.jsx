import React, { useState, useRef, useEffect } from 'react'
import Timer from './Timer';
import { motion } from 'motion/react';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from 'axios';
import AnimatedBackground from './AnimatedBackground';
import Navbar from './Navbar';

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, userName } = interviewData;

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [introAnswered, setIntroAnswered] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAiPlaying, setIsAiPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("male");
  const [subtitle, setSubTitle] = useState("");

  const femaleVideo = "/WhatsApp Video 2026-03-22 at 09.14.36.mp4";
  const maleVideo = "/AI_Presenter_Video_Generation_Request.mp4";

  const currentQuestion = questions[currentIndex];
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  console.log("introl",introAnswered,currentIndex,subtitle)

  // Load voices 
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      // ✅ check female first
      const femaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        console.log(name)
        return (
          name.includes("zira") || name.includes("samantha") ||
          name.includes("aria") || name.includes("jenny") ||
          name.includes("emma") || name.includes("amy") ||
          name.includes("michelle") || name.includes("victoria")
        );
      });
      if (femaleVoice) { setSelectedVoice(femaleVoice); setVoiceGender("female"); return; }

      // fallback male
      const maleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes("david") || name.includes("mark") || name.includes("guy");
      });
      if (maleVoice) { setSelectedVoice(maleVoice); setVoiceGender("male"); return; }

      // last resort
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // speakText 
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) { 
        resolve(); return; }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ",... ")
        .replace(/\./g, "... ")
        .replace(/\?/g, "?... ")
        .replace(/!/g, "!... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      setSubTitle(text);

      utterance.onstart = () => {
        setIsAiPlaying(true);
        if (videoRef.current && videoSource) {
          videoRef.current.loop = true;
          videoRef.current.play().catch(() => { });
        }
      };

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.loop = false;
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setIsAiPlaying(false);
        // setTimeout(() => setSubTitle(""), 300);
        if(!isAiPlaying) setSubTitle("")
        resolve();
      };

      utterance.onerror = () => {
        if (videoRef.current) {
          videoRef.current.loop = false;
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setIsAiPlaying(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Intro + question flow 
  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hello ${userName}, and welcome to your mock interview with MockMate AI. 
          I will be your interviewer today. 
          Please answer clearly and take your time. 
          There is no rush. 
          Let us begin. 
          Can you start by introducing yourself?`
        );
        setIsIntroPhase(false);
        return;

      } else if (introAnswered && currentQuestion) {
         await new Promise(r => setTimeout(r, 1000));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
        setTimeLeft(currentQuestion.timeLimit || 60);
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, introAnswered, currentIndex]);

  //no answer
  useEffect(() => {
    if (timeLeft === 0 && introAnswered && !isSubmitting && !isAiPlaying) {
      handleSubmit();
    }
  }, [timeLeft]);

  //Timer
  useEffect(() => {
    // ✅ all guards correct
    if (!currentQuestion || isAiPlaying || isSubmitting) return;

    setTimeLeft(currentQuestion?.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, introAnswered, currentIndex, isAiPlaying]);


  // Mic ----- for recognize our speech into  words
  const startMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported in this browser."); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = (e) => console.log("Mic error:", e.error);

    recognition.start();
    recognitionRef.current = recognition;
    setIsMicOn(true);
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    setIsMicOn(false);
  };

  const toggleMic = () => {
    if (isAiPlaying) return;
    if (isMicOn) stopMic();
    else startMic();
  };

  const handleSubmit = async () => {
    if (isAiPlaying) return;

    if (!introAnswered) {
      setAnswer("");
      setIsSubmitting(true);
      startMic();
      await speakText("Thank you for the introduction. Let us begin the interview.");
      stopMic();
      setIntroAnswered(true);
      setIsSubmitting(false);
      return;
    }

    if (!answer.trim() || isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + '/api/interview/submit-answer',
        {
          interviewId,
          questionIdx: currentIndex,
          timeTaken: timeLeft,
          answer,
        },
        { withCredentials: true }
      );

      if(answer==null){
        await speakText('It seems you didn’t answer.')
      }

      const comment = res.data.data.feedback;
      setSubTitle(comment)

      setFeedback(comment || null);
      await speakText(`${comment}`);
      setFeedback(null);
      setAnswer("");

      if (currentIndex < questions.length - 1) {
        console.log(currentIndex)
        setCurrentIndex(prev => prev + 1);
      }else if(isIntroPhase){
        setCurrentIndex(0)
      } else {
        await speakText(
          "That was the last question. Great job completing the interview. I will now show you your results."
        );
        try {
          const finalRes = await axios.post(
            import.meta.env.VITE_SERVER_URL + '/api/interview/finalize',
            { interviewId },
            { withCredentials: true }
          );
          console.log(finalRes);
          onFinish(finalRes);
        } catch (e) {
          console.log('Finalize error:', e);
          onFinish(interviewId);
        }
      }

    } catch (e) {        // ✅ outer catch
      console.log(e);
    } finally {          // ✅ always runs
      setIsSubmitting(false);
    }
  };
  // Button helpers 
  const buttonLabel = () => {
    if (isSubmitting) return (
      <span className="flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        Submitting...
      </span>
    );
    if (!introAnswered) return 'Done Introducing →';
    if (currentIndex === questions.length - 1) return 'Finish Interview';
    return 'Submit Answer';
  };

  const isButtonDisabled =
    isAiPlaying ||
    isSubmitting ||
    (introAnswered && !answer.trim());

  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: '"DM Sans", sans-serif', background: '#06050f' }}
    >
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 min-h-screen p-4 sm:p-6 flex justify-center items-center mt-2">
        <AnimatedBackground />
        <div
          className="absolute left-1/4 right-1/4 h-px z-10"
          style={{ marginTop: '-10px', background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)', top: 0 }}
        />
        <div
          className="w-full max-w-6xl min-h-[80vh] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
          style={{ border: '1px solid rgba(167,139,250,0.15)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}
        >

          {/* ── Left: Video + Status ── */}
          <div
            className="w-full lg:w-[35%] flex flex-col items-center p-6 space-y-5 border-r"
            style={{
              background: 'linear-gradient(160deg, rgba(20,10,50,0.98), rgba(10,6,28,0.95))',
              borderColor: 'rgba(167,139,250,0.1)',
            }}
          >
            {/* Video */}
            <div
              className="relative w-full rounded-2xl overflow-hidden aspect-video"
              style={{ background: '#0a0618', border: '1px solid rgba(167,139,250,0.12)' }}
            >
              {videoSource ? (
                <video
                  ref={videoRef}
                  key={videoSource}
                  src={videoSource}
                  playsInline
                  preload="auto"
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
                  >
                    AI
                  </div>
                  <p className="text-white/30 text-xs">AI Interviewer</p>
                  {isAiPlaying && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-4 bg-violet-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Speaking bars */}
              {isAiPlaying && videoSource && (
                <div className="absolute bottom-3 left-3 flex items-end gap-1 px-2.5 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>
                  {[6, 10, 14, 10, 6].map((h, i) => (
                    <div key={i} className="w-1 rounded-full bg-violet-400 animate-bounce"
                      style={{ height: h, animationDelay: `${i * 0.1}s` }} />
                  ))}
                  <span className="text-white/50 text-xs ml-1.5">Speaking</span>
                </div>
              )}

              {/* Name badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <span className="text-white/60 text-xs">AI Interviewer</span>
              </div>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div
                className="w-full px-4 py-3 rounded-xl text-xs leading-relaxed"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(167,139,250,0.15)',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {subtitle}
              </div>
            )}

            {/* Status + Timer */}
            <div
              className="w-full rounded-2xl p-5 space-y-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs">Interview Status</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: isAiPlaying ? 'rgba(124,58,237,0.2)' : isMicOn ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                    color: isAiPlaying ? '#a78bfa' : isMicOn ? '#fca5a5' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${isAiPlaying ? 'rgba(167,139,250,0.3)' : isMicOn ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isAiPlaying ? '🎙 AI Speaking' : isMicOn ? '🔴 Listening' : '⏸ Waiting'}
                </span>
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              <div className="flex justify-center">
                <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{!introAnswered?0:currentIndex +1}</span>
                  <span className="text-xs text-white/30">Current</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{questions.length}</span>
                  <span className="text-xs text-white/30">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Question + Answer ── */}
          <div
            className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8"
            style={{ background: 'rgba(10,7,25,0.97)' }}
          >
            <div className="mb-6">
              <p className="text-white/25 text-xs tracking-[0.2em] uppercase mb-1">Live Session</p>
              <h2
                className="text-xl sm:text-2xl font-semibold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                AI Smart Interview
              </h2>
            </div>

            {/* Intro phase — AI speaking */}
            {isIntroPhase && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <p className="text-white/30 text-sm">AI interviewer is introducing the session…</p>
              </div>
            )}

             {!isIntroPhase && !introAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-white/30 text-xs mb-2">Introduction</p>
                <p className="text-white/85 text-base font-medium leading-relaxed">
                  Can you start by introducing yourself?
                </p>
              </motion.div>
            )}

            {/* Question box */}
            {!isIntroPhase && introAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-white/30 text-xs">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  {currentQuestion?.difficulty && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(167,139,250,0.2)',
                        color: '#c4b5fd',
                      }}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>
                <p className="text-white/85 text-base sm:text-lg font-medium leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </motion.div>
            )}

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl text-sm leading-relaxed"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  color: '#c4b5fd',
                }}
              >
                {typeof feedback === 'object' ? feedback.comment : feedback}
              </motion.div>
            )}

            {/* Textarea — hidden during AI intro */}
            {!isIntroPhase && (
              <textarea
                className="flex-1 resize-none outline-none rounded-2xl p-4 sm:p-5 text-sm leading-relaxed min-h-[160px] transition-all duration-200"
                placeholder={
                  !introAnswered
                    ? "Introduce yourself... click the mic or type here"
                    : "Type your answer here or use the microphone..."
                }
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'white',
                  fontFamily: '"DM Sans", sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(167,139,250,0.4)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />
            )}

            {/* Actions — hidden during AI intro */}
            {!isIntroPhase && (
              <div className="flex items-center gap-3 mt-5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMic}
                  disabled={isAiPlaying}
                  className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{
                    background: isMicOn ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.07)',
                    border: isMicOn ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    boxShadow: isMicOn ? '0 0 16px rgba(239,68,68,0.35)' : 'none',
                  }}
                >
                  {isMicOn ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isButtonDisabled}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background: isButtonDisabled
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: isButtonDisabled ? 'rgba(255,255,255,0.2)' : 'white',
                    boxShadow: isButtonDisabled ? 'none' : '0 0 24px rgba(124,58,237,0.35)',
                  }}
                >
                  {buttonLabel()}
                </motion.button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Step2Interview;