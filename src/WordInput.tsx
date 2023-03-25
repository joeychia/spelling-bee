/* //create a react component InputWord in TypeScript that uses speechRecognition api.
The input is a word.
When user clicks "Listen" button, the component will listen to voice input.  
Then reconstruct the recognized string. The string is consisted of many tokens separated by space, keep single letter tokens only and concatenate them into one word. Then show it in a box.
If the new word matches the original word (ignoring case), put a green check mark on its right; If the new word doesn't match, highlight the matched part in green and the rest in red, and show the original word below it. 
When user clicks the "Listen" button again, reset the component state and start over to listen..

*/

import React, { useState } from 'react';
import WordDiff from './WordDiff';

type InputWordProps = {
  word: string;
};

const InputWord: React.FC<InputWordProps> = ({ word }) => {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [matching, setMatching] = useState(false);

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setListening(true);
    setRecognized('');
    setMatching(false);
    recognition.start();
  };

  recognition.onresult = (event) => {
    const tokens: string[] = [];
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      tokens.push(...transcript.split(' '));
    }
    const newWord = tokens
      .filter((token) => token.length === 1)
      .join('')
      .toLowerCase();
    setRecognized(newWord);
    setMatching(newWord.toLowerCase() === word.toLowerCase());
  };

  recognition.onend = () => {
    setListening(false);
  };

  return (
    <div>
      <button className='btn btn-primary btn-lg' onClick={startListening} disabled={listening}>
        {listening ? 'Listening...' : 'Listen'}
      </button>
      {recognized && (
        <div style={{ marginTop: '1rem' }}>
          {matching ? (
            <span style={{ color: 'green', marginRight: '0.5rem' }}>&#10004;</span>
          ) : (
            <span>Your incorrect spelling: <WordDiff firstWord={word} secondWord={recognized} /></span>
            
          )}
          {/* <div>{word}</div> */}
        </div>
      )}
    </div>
  );
};

export default InputWord;
