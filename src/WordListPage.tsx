import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReviewDict, ReviewType } from './ReviewDict';
import TestWordList from './TestWordList';

export interface WordList {
  name: string;
  words: string[];
}

const WordListPage: React.FC = () => {
  const { wordlistName } = useParams<{ wordlistName: string }>();

  const [isTesting, setIsTesting] = useState(false); // Add state and default value
  const [reviewWords, setReviewWords] = useState([] as ReviewType[]); // Add state and default value
  const [reviewList, setReviewList] = useState([] as string[]); // Add state and default value
  const [wordList, setWordList] = useState({} as WordList); // Add state and default value

  useEffect(() => {
    setIsTesting(false);
    if (wordlistName==="review-today") {
      const reviewWordDict = window.gReviewWords || {};
      const date = new Date().toISOString().slice(0, 10)
      // const toReview = reviewWordDict.getWordInfoOnDate(date);
      const words = reviewWordDict.getWordsOnDate(date) as Set<string>;
      const reviewWordList = {name: "Review today", words: Array.from(words)};
      setWordList(reviewWordList);
      // setReviewList(Array.from(words));
      // setReviewWords(toReview||[]);
      // setReviewList(words);
    } else {
      const foundList = window.gWordLists.find((list) => list.name === wordlistName);
      if (foundList) {
        setWordList(foundList);
      }
    }
   

  }, []);
  
  const handleStartTest = () => {
    setIsTesting(true);
  };

  const handleEndTest = () => {
    setIsTesting(false);
    window.myDict.saveToLocal();
    window.gReviewWords.save();
  };

  if (!wordList || !wordList.words) {
    return <div>Word list not found.</div>;
  }

  return (
    !isTesting ? (<div className='page-container'>
      
      <h2>{wordList.name}</h2>
      <button className="btn btn-primary btn-lg" onClick={handleStartTest}>Start test</button> 
      
      <ul className='list-group mt-2 mb-2'>
        {wordList.words.map((word) => (
          <li className='list-group-item' key={word}>{word} {window.myDict.getWordScore(word)}</li>
        ))}
      </ul>
      <h2>
        <Link to="/wordlists">&#128281;</Link>
      </h2>
    </div>) :
    <div>
        <TestWordList words={wordList.words} listName={wordlistName} exitHandler = {handleEndTest} />
    </div>);
};

export default WordListPage;
