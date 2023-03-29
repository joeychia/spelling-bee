// create a cute ProgressBar in react typescript, with a bee flying on it to show progress.



import React from 'react';
import './ProgressBar.css';
import bee from './bee.png';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const beePosition = progress > 100 ? 100 : progress < 0 ? 0 : progress;

  return (
    <div className="progress-container">
      <div className="test-progress-bar" style={{ width: `${beePosition}%` }}>
        <img src={bee} alt="Bee" className="bee" />
      </div>
    </div>
  );
};

export default ProgressBar;
