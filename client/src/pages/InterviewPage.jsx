import React, { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp';
import Step2Interview from '../components/Step2Interview';
import Step3InteviewREport from '../components/Step3InteviewREport';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Dashboard from './Dashboard';

const InterviewPage = () => {
    const { userData } = useSelector(state => state.user)
    console.log(userData)
    const [step, setStep] = useState(1);
    const [interviewData, setInterViewData] = useState(null);
    console.log(interviewData);

    return (
        <div className='min-h-screen '>
            {
                step === 1 && (
                    <Step1SetUp onStart={(data) => {
                        setInterViewData(data);
                        setStep(2)
                    }} />
                )
            }
            {
                step == 2 && (
                    <Step2Interview onFinish={(report) => {
                        setInterViewData(report);
                        setStep(3)
                    }} interviewData={interviewData} />
                )
            }
            {
                step == 3 && (
                    <>
                    <Step3InteviewREport/>
                   
                    </>
                )
            }
        </div>
    )
}

export default InterviewPage