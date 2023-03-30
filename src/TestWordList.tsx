/* 
Create a React component WordList in TypeScript.
The input is a list of words, and exitHandler function.
When mounted, shuffle the list of words.
On top, show the current cursor of the list, and the total number of words.
Show one word at a time. Followed by previous and next button to navigate through the list.
Show a "Unfarmiliar" button. When clicked, add the word to the end of the list.
At the bottom, show a "I'm done" button, that calls "exitHandler" when clicked.
*/

/*
Design a webpage to test a word spelling.
It has big box as placeholder for the word, a button to read the word, a button to read example sentence, and a button to show the answer.
Below the box, there is a recording button to record the user's spelling. The button should have a microphone icon when not recording, and a stop icon when recording.
Below the recording button, there is an text input box to show the recognized spelling. User can type the spelling in the box as well.
There is a button to submit the answer. When clicked, it will show the correct answer in the big placeholder box. If the answer is correct, it will show a green checkmark. If the answer is incorrect, it will show a red cross, and highlight the unmatch part of the text in the input box.
The webpage should be adaptive for both mobile and desktop.
The webpage style should be attractive for elementary school students.
Create it in React typescript.
*/

import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import ReadWord from "./ReadWord";
import WordInput from "./WordInput";


type Props = {
  words: string[];
  exitHandler: () => void;
  listName?: string;
};

const TestWordList: React.FC<Props> = ({ words, exitHandler, listName }) => {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const reviewWordDict = window.gReviewWords || {};

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
    window.gReviewWords.addWord(currentWord, listName);
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
      <h1>Spelling Test</h1>

      {/* <div
        style={{
          background: `linear-gradient(to right, green ${progress}%, #f3f4f6 ${progress}% 100%)`,
          padding: "0.5rem",
          textAlign: "right"
        }}
      >
        
      </div> */}
     
      <div className="container">
        <ReadWord word={currentWord} dontKnownHandler={handleUnfamiliar} />
        <WordInput word={currentWord} successHandler={handlePassed} />
      </div>
      <ProgressBar progress={progress} />
      {shuffledWords.length - currentWordIndex} words left
      <div className='text-center'>
        <button className="test-btn" onClick={handlePreviousWord} disabled={currentWordIndex === 0}>
          Previous
        </button>
        <button className="test-btn" onClick={handleNextWord} disabled={currentWordIndex === shuffledWords.length - 1}>
          Next
        </button>
        <button className="test-btn" onClick={handleDone}>I'm done</button>
      </div>
    </div>
  );
};

export default TestWordList;
