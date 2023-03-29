import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TestWordList from './TestWordList';

export interface WordList {
  name: string;
  words: string[];
}

const WordListPage: React.FC = () => {
  const { wordlistName } = useParams<{ wordlistName: string }>();
  const wordList = window.gWordLists.find((list) => list.name === wordlistName);

  const [isTesting, setIsTesting] = useState(false); // Add state and default value


  useEffect(() => {
    setIsTesting(false);
  }, []);
  
  const handleStartTest = () => {
    setIsTesting(true);
  };

  const handleEndTest = () => {
    setIsTesting(false);
    window.myDict.saveToLocal();
    window.gReviewWords.save();
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
      <button className="btn btn-primary btn-lg" onClick={handleStartTest}>Start test</button> 
      
      <ul className='list-group'>
        {wordList.words.map((word) => (
          <li className='list-group-item' key={word}>{word} {window.myDict.getWordScore(word)}</li>
        ))}
      </ul>
    </div>) :
    <div>
        <TestWordList words={wordList.words} listName={wordlistName} exitHandler = {handleEndTest} />
    </div>);
};

export default WordListPage;
