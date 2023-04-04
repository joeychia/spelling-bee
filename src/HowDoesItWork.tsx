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
          <p>This webapp is initially built with ChatGPT. That's one of the reasons it's called Spelling Made EZ.</p>
          <p>It currently supports signing in with Google Account. Once signed in, you can create and user your word list. And it saves your word list and test progress to cloud privately.</p>
          <p>If you don't sign in, you can use public word lists. And your data is saved in your computer's browser.</p>
          <p>Each word begins with 100 points. When you spell a word correctly, you earn 1 point. If you need help and press the "Peak" button to see the word, you'll lose 1 point. Once you have 100 or more points on a word, it means you're really good at it, so you won't see it in future tests.</p>
          <p>If a word's score goes below 100, you'll review it on the same day, as well as days 1, 3, and 7. This helps you remember better. </p>

        </div>
      )}
    </div>
  );
};

export default HowDoesItWork;
