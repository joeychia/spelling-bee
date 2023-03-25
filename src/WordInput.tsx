/* //create a react component InputWord in TypeScript that renders a text box. 
Given a word, the component will listen to voice input of the spelling. While it is listening, show a recording icon and make it blinking. When it stops listening, hide the icon.  
Then reconstruct the recognized string which is consisted of many tokens separated by space, keep single letter tokens only and concatenate them into one word, then show it in a box.
If the new word matches the word (ignoring case), put a green check mark on the right; If the spelling doesn't match, highlight the matched part in green and the rest in red, and show the correct word below it. 
*/
import React, { useState, useEffect } from 'react';

interface InputWordProps {
  word: string;
}

const InputWord: React.FC<InputWordProps> = ({ word }) => {
  const [listening, setListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [matched, setMatched] = useState(false);

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };

  useEffect(() => {
    recognition.onresult = (event) => {
      const results = event.results;
      const transcript = Array.from(results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setRecognized(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    return () => {
      recognition.abort();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tokens = value.split(' ').filter(token => token.length === 1);
    const newWord = tokens.join('');
    setRecognized(newWord);
    setMatched(newWord.toLowerCase() === word.toLowerCase());
  };

  const renderMatchIndicator = () => {
    if (recognized.toLowerCase() === word.toLowerCase()) {
      return <span style={{ color: 'green' }}>✓</span>;
    } else if (recognized.toLowerCase().startsWith(word.toLowerCase())) {
      const matchedPart = recognized.substring(0, word.length);
      const unmatchedPart = recognized.substring(word.length);
      return (
        <>
          <span style={{ color: 'green' }}>{matchedPart}</span>
          <span style={{ color: 'red' }}>{unmatchedPart}</span>
        </>
      );
    } else {
      return <span style={{ color: 'red' }}>{word}</span>;
    }
  };

  return (
    <div>
      <label htmlFor="input-word">{word}</label>
      {listening && <span style={{ marginLeft: '10px', animation: 'blinking 1s infinite' }}>🎤</span>}
      <br />
      <input
        id="input-word"
        type="text"
        value={recognized}
        onChange={handleInputChange}
        onFocus={startListening}
        onBlur={stopListening}
      />
      {matched && <div style={{ color: 'green' }}>Correct!</div>}
      {!matched && (
        <div>
          {renderMatchIndicator()}
        </div>
      )}
    </div>
  );
};

export default InputWord;
