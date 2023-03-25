import React from 'react';

interface WordDiffProps {
  firstWord: string;
  secondWord: string;
}

const WordDiff: React.FC<WordDiffProps> = ({ firstWord, secondWord }) => {
  const highlightedWord = [];

  let i = 0;
  while (i < firstWord.length && i < secondWord.length) {
    if (firstWord[i] !== secondWord[i]) {
      highlightedWord.push(
        <span key={i} style={{ backgroundColor: 'red' }}>
          {secondWord[i]}
        </span>
      );
    } else {
      highlightedWord.push(<span key={i}>{secondWord[i]}</span>);
    }
    i++;
  }
  if (i < secondWord.length) {
    highlightedWord.push(
      <span key={i} style={{ backgroundColor: 'red' }}>
        {secondWord.slice(i)}
      </span>
    );
  }

  return (
    <span>
      {highlightedWord}
    </span>
  );
};

export default WordDiff;
