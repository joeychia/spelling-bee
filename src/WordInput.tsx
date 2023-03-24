import React, { useState } from 'react';

interface InputWordProps {
  word: string;
}

const InputWord: React.FC<InputWordProps> = ({ word }) => {
  const [userInput, setUserInput] = useState('');
  const [matched, setMatched] = useState(false);
  const [correctWord, setCorrectWord] = useState('');
  const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const lastResult = event.results[event.results.length - 1];
    const { transcript } = lastResult[0];
    setUserInput(transcript);
    if (transcript === word) {
      setMatched(true);
      setCorrectWord('');
      recognition.stop();
    } else {
      let matchedIndex = 0;
      while (matchedIndex < transcript.length && matchedIndex < word.length && transcript[matchedIndex] === word[matchedIndex]) {
        matchedIndex++;
      }
      setMatched(false);
      setCorrectWord(word);
      setUserInput(transcript.slice(0, matchedIndex));
    }
  };

  recognition.onerror = (event: any) => {
    console.error(event.error);
    recognition.stop();
  };

  const handleStart = () => {
    setUserInput('');
    setMatched(false);
    setCorrectWord('');
    recognition.start();
  };

  return (
    <div >
      <input
        type="text"
        value={userInput}
        style={{
          background: matched ? 'green' : `linear-gradient(to right, green ${userInput.length}%, white ${userInput.length}%)`,
          color: matched ? 'white' : 'black',
        }}
        autoFocus
      />
      {correctWord && <div>Correct word: {correctWord}</div>}
      <button onClick={handleStart}>Start</button>
    </div>
  );
};

export default InputWord;
