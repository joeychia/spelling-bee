import React, { useState } from 'react';
import './HowDoesItWork.css';

interface HowDoesItWorkProps {}

const HowDoesItWork: React.FC<HowDoesItWorkProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-1 how-does-it-work">
      <a onClick={toggleExpand} className="expandable-link">
        {isExpanded ? 'Hide details' : 'How does it work?'}
      </a>
      {isExpanded && (
        <div className="explanation">
          <p>Each word begins with 100 points. When you spell a word correctly, you earn 1 point. If you need help and press the "Peak" button to see the word, you'll lose 1 point. Once you have 100 or more points on a word, it means you're really good at it, so you won't see it in future tests.</p>
          <p>If a word's score goes below 100, you'll review it on the same day, as well as days 1, 3, and 7. This helps you remember better. </p>
          <p>Your test scores and review schedule are saved in your computer's browser, so you can take a break and continue later if you want.</p>
        </div>
      )}
    </div>
  );
};

export default HowDoesItWork;
