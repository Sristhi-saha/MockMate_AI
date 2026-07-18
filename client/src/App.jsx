import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./App.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/USerSlice";
import InterviewPage from "./pages/InterviewPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Step3InteviewREport from "./components/Step3InteviewREport";

export const ServerUrl = "http://localhost:8000/";

function App() {
    const dispatch = useDispatch();
    const [authLoading, setAuthLoading] = useState(true); // ✅ add this

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/user/current-user`,
                    { withCredentials: true }
                );
                console.log("Current user data:", res.data); // ✅ log the response
                dispatch(setUserData(res.data));
            } catch (error) {
                dispatch(setUserData(null));
            } finally {
                setAuthLoading(false); // ✅ done checking
            }
        };
        getUser();
    }, [dispatch]);

    // ✅ show loading while auth check runs
    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ background: '#06050f' }}>
            <span className="text-violet-400/50 font-semibold text-2xl mr-2"> Loading </span><br />
            <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400/50 animate-bounce mt-4"
                        style={{ animationDelay: `${i * 0.2}s` }} ></div>
                ))}
            </div>
        </div>
    );

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/interview" element={<InterviewPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path='/history' element={<History />} />
                <Route path='/feedback' element={<Step3InteviewREport />}/>
                <Route path='/feedback/:id' element={<Step3InteviewREport />}/>
            </Route>
        </Routes>
    );
}

export default App;