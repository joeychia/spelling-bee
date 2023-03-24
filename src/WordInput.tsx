import React, { useState } from 'react';

interface Props {
  word: string;
}

const WordInput: React.FC<Props> = ({ word }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
  };

  const getHighlightedText = () => {
    if (inputValue === '') {
      return <span>{word}</span>;
    }

    if (inputValue === word) {
      return <span style={{ color: 'green' }}>{word}</span>;
    }

    const isMatch = word.toLowerCase().startsWith(inputValue);
    const matchingPart = word.slice(0, inputValue.length);
    const restPart = word.slice(inputValue.length);

    return (
      <p role="heading" style={{ display: 'inline-block' }}>
        <span style={{ color: isMatch ? 'black' : 'red' }}>{matchingPart}</span>
        <span>{restPart}</span>
      </p>
    );
  };

  return (
    <div>
      <label htmlFor="word-input">Input</label>
      <input
        type="text"
        id="word-input"
        aria-label="Input"
        value={inputValue}
        onChange={handleInputChange}
      />
      {getHighlightedText()}
    </div>
  );
};

export default WordInput;
