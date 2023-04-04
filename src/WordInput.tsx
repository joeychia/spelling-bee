/* //create a react component InputWord in TypeScript that uses speechRecognition api.
The input is a word.
When user clicks "Listen" button, the component will listen to voice input.
Then reconstruct the recognized string. The string is consisted of many tokens separated by space, keep single letter tokens only and concatenate them into one word. Then show it in a box.
If the new word matches the original word (ignoring case), put a green check mark on its right; If the new word doesn't match, highlight the matched part in green and the rest in red, and show the original word below it.
When user clicks the "Listen" button again, reset the component state and start over to listen..


Create an inputbox in React typescript. It should have a microphone button on the right end inside the box. The placeholder text is "type or tap to speak". It allows typing in the box. When user hit Enter key, it calls "finish" function with the input. User can also tap and hold the microphone button to speak. Once tapped, it listens to user voice and start speech recognizing. Once speech is done or user release the button, it stops listening, the recognized word, and call "finish" function with the word.
*/

import React, { useEffect, useState } from 'react';
import './WordInput.css';

type InputWordProps = {
  word: string;
  successHandler?: () => void;
};

const InputWord: React.FC<InputWordProps> = ({ word, successHandler }) => {
  const [listening, setListening] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [recognized, setRecognized] = useState('');
  useEffect(() => {
    // Reset the states when the input prop updates
    setListening(false);
    setRecognized('');
  }, [word]);

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setListening(true);
    setRecognized('');
    recognition.start();
  };

  const stopListening = () => {
      recognition.stop();
      setListening(false);
  }

  recognition.onresult = (event) => {
    const tokens: string[] = [];
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      tokens.push(...transcript.split(' '));
    }
    const newWord = tokens
      // .filter((token) => token.length === 1)
      .join('')
      .toLowerCase();
    setRecognized(newWord);
    if (newWord.toLowerCase() === word.toLowerCase()) {
      successHandler?.();
    } else {
      shakeInputBox();
    }
  };

  recognition.onend = () => {
    setListening(false);
  };

  const handleClick = () => {
    setRecognized('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (recognized.toLowerCase() === word.toLowerCase()) {
        successHandler?.();
      } else {
        shakeInputBox();
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement; // type casting
    setRecognized(target.value);
  };

  function shakeInputBox() {
    setShaking(true);
    // Remove the "shake" CSS class after 0.5 seconds
    setTimeout(() => {
      setShaking(false);
    }, 500);
  }
  return (
    <div className='input-area mt-1 d-inline-flex'>

      <input type="text" id="spelling-input" className={shaking?"shake":""} placeholder="Type or say the spelling..." value={recognized} onClick={handleClick} onChange={handleInputChange} onKeyUp={handleKeyPress}></input>
      <button id="record-btn" className="microphone-icon"  onPointerDown={startListening} onPointerUp={stopListening} ></button>
    </div>
  );
};

export default InputWord;
