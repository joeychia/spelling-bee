/* //create a react component InputWord in TypeScript that uses speechRecognition api.
The input is a word.
When user clicks "Listen" button, the component will listen to voice input.  
Then reconstruct the recognized string. The string is consisted of many tokens separated by space, keep single letter tokens only and concatenate them into one word. Then show it in a box.
If the new word matches the original word (ignoring case), put a green check mark on its right; If the new word doesn't match, highlight the matched part in green and the rest in red, and show the original word below it. 
When user clicks the "Listen" button again, reset the component state and start over to listen..

*/

import React, { useEffect, useState } from 'react';
import WordDiff from './WordDiff';
import './WordInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

type InputWordProps = {
  word: string;
  successHandler?: () => void;
};

const InputWord: React.FC<InputWordProps> = ({ word, successHandler }) => {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [matching, setMatching] = useState(false);
  useEffect(() => {
    // Reset the states when the input prop updates
    setListening(false);
    setRecognized('');
    setMatching(false);
  }, [word]);
  
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setListening(true);
    setRecognized('');
    setMatching(false);
    recognition.start();
  };

  const toggleListening = () => {
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      startListening();
    }
  }
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
    if (newWord.toLowerCase() === word.toLowerCase()) {
      setMatching(true);
      successHandler?.();
    }
  };

  recognition.onend = () => {
    setListening(false);
  };

  return (
    <div>
      <button className='btn btn-danger btn-lg' onClick={toggleListening} >
        <FontAwesomeIcon icon={faMicrophone} />
        {' '}
        {listening ? 'Listening...' : 'Tap to spell'}
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
