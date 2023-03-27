/* 
Create a React component WordList in TypeScript.
The input is a list of words, and exitHandler function.
When mounted, shuffle the list of words.
On top, show the current cursor of the list, and the total number of words.
Show one word at a time. Followed by previous and next button to navigate through the list.
Show a "Unfarmiliar" button. When clicked, add the word to the end of the list.
At the bottom, show a "I'm done" button, that calls "exitHandler" when clicked.
*/

import React, { useState, useEffect } from "react";
import ReadWord from "./ReadWord";
import WordInput from "./WordInput";


type Props = {
  words: string[];
  exitHandler: () => void;
};

const TestWordList: React.FC<Props> = ({ words, exitHandler }) => {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  useEffect(() => {
    // filter the words that has a score less than 100 in myDict
    const filteredWords = words.filter((word) => window.myDict.getWordScore(word) <= 100);
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousWord = () => {
    setCurrentWordIndex((prevIndex) => prevIndex - 1);
  };

  const handleUnfamiliar = () => {
    const currentWord = shuffledWords[currentWordIndex];
    const newWords = [...shuffledWords, currentWord];
    setShuffledWords(newWords);
    window.myDict.changeWordScore(currentWord, -1);
  };

  const handlePassed = () => {
    const currentWord = shuffledWords[currentWordIndex];
    window.myDict.changeWordScore(currentWord, +1);
    handleNextWord();
  };

  const handleDone = () => {
    exitHandler();
  };

  const currentWord = shuffledWords[currentWordIndex];
  const progress = ((currentWordIndex) / shuffledWords.length) * 100;

  return (
    <div>
      <div
        style={{
          background: `linear-gradient(to right, green ${progress}%, #f3f4f6 ${progress}% 100%)`,
          padding: "0.5rem",
          textAlign: "right"
        }}
      >
        {shuffledWords.length - currentWordIndex} words left
      </div>
      <div><ReadWord word={currentWord} dontKnownHandler={handleUnfamiliar} /></div>
      <WordInput word={currentWord} successHandler={handlePassed} />
      <div className='text-center'>
        <button onClick={handlePreviousWord} disabled={currentWordIndex === 0}>
          Previous
        </button>
        <button onClick={handleNextWord} disabled={currentWordIndex === shuffledWords.length - 1}>
          Next
        </button>
        <button onClick={handleDone}>I'm done</button>
      </div>
    </div>
  );
};

export default TestWordList;
