import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TestWordList from './TestWordList';
import list1A from "./wordLists/1A.json";
import list1B from "./wordLists/1B.json";

interface WordList {
  name: string;
  words: string[];
}

const defaultWordLists: WordList[] = [
  { name: 'List 1', words: list1A },
  { name: 'List 2', words: list1B },
];

const WordListPage: React.FC = () => {
  const { wordlistName } = useParams<{ wordlistName: string }>();
  const wordList = defaultWordLists.find((list) => list.name === wordlistName);

  const [isTesting, setIsTesting] = useState(false); // Add state and default value

  const handleStateTest = () => {
    setIsTesting(true);
  };

  if (!wordList) {
    return <div>Word list not found.</div>;
  }

  return (
    !isTesting ? (<div>
      <nav>
        <Link to="/wordlists">Back</Link>
      </nav>
      <h1>{wordList.name}</h1>
      <button onClick={handleStateTest}>Start test</button> 
      
      <ul>
        {wordList.words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>) :
    <div>
        <TestWordList words={wordList.words} exitHandler = {() => setIsTesting(false)} />
    </div>);
};

export default WordListPage;
