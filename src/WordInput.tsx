import React, { useState } from 'react';

interface InputWordProps {
  word: string;
}

// write a function restructWord, given a string of many words separated by space. Keep single letter word only and concatenate them together them into one word
function restructWord(input: string): string {
  const words = input.split(' ');
  const singleLetters = words.filter(word => word.length === 1);
  return singleLetters.join('');
}

const InputWord: React.FC<InputWordProps> = ({ word }) => {
  const [value, setValue] = useState('');
  const [highlight, setHighlight] = useState(false);

  const handleRecognition = (event: SpeechRecognitionEvent) => {
    const recognition = restructWord(event.results[0][0].transcript.trim());
    setValue(recognition);

    if (recognition.toLowerCase() === word.toLowerCase()) {
      setHighlight(false);
    } else {
      setHighlight(true);
    }
  };

  const recognitionSupported = 'webkitSpeechRecognition' in window;

  const recognition = recognitionSupported ? new window.webkitSpeechRecognition() : null;
  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = handleRecognition;
  }

  const handleClick = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const correct = highlight ? word.substring(0, value.length) : word;

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <button onClick={handleClick}>Speak</button>
        {highlight ? (
          <div style={{ color: 'red', marginLeft: '10px' }}>{word.substring(value.length)}</div>
        ) : (
          <div style={{ color: 'green', marginLeft: '10px' }}>✔</div>
        )}
      </div>
      {highlight && <div style={{ color: 'green' }}>{correct}</div>}
    </div>
  );
};

export default InputWord;
