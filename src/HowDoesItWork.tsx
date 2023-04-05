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
      <button onClick={toggleExpand} className="btn btn-link expandable-link" >
        {isExpanded ? 'Hide details' : 'How does it work?'}
      </button>
      {isExpanded && (
        <div className="explanation">
          <p>This webapp is initially built with ChatGPT. That's one of the reasons it's called Spelling Made EZ.</p>
          <p>It currently supports signing in with Google Account. Once signed in, you can create and user your word list.</p>
          <p>And it saves your word list and test progress to cloud privately.</p>
          <p>If you don't sign in, you can use public word lists. And your data is saved in your computer's browser.</p>
          <p>You can pick a list to start practice.</p>

          <p>Once you hear the word, you can either hold the microphone button to slowly speak out the spelling, or enter the word in the text box.</p>

<p>If you spell the word correctly, you earn 1 point on the word. If you don't, you can try it again or use some hint, like tap "Read" to hear it again, or tap "Sentence" button to hear an example sentence.</p>

<p>If you still can't get it. You can long press the "Peak" button to see the word, and you'll lose 1 point on the word.</p>
<p>Once your point is positive, it means you're masted it, so you won't see it again in future tests.</p>

<p>All words you peaked will go to review list. You'll review it on the same day, as well as on the following day, the 3rd day, and the 7th day. The scheduled review will help you memorize them better.</p>

        </div>
      )}
    </div>
  );
};

export default HowDoesItWork;
