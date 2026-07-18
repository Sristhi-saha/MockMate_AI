import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100
  return (
    <div className='w-20 h-20'>
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: '28px',
          pathColor: '#a78bfa',   // violet to match your theme
          textColor: '#ffffff',
          trailColor: 'rgba(255,255,255,0.1)',
        })}
      />
    </div>
  )
}

export default Timer