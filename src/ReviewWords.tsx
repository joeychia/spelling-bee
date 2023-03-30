import React, { useEffect, useState } from 'react';
import { ReviewType, ReviewDict } from './ReviewDict';
import TestWordList from './TestWordList';



const ReviewWords: React.FC = () => {
  var reviewWordDict: ReviewDict;

  const [isTesting, setIsTesting] = useState(false); // Add state and default value
  const [reviewWords, setReviewWords] = useState([] as ReviewType[]); // Add state and default value
  const [wordList, setWordList] = useState([] as string[]); // Add state and default value

  useEffect(() => {
    setIsTesting(false);
    reviewWordDict = window.gReviewWords || {};
    const date = new Date().toISOString().slice(0, 10)
    const toReview = reviewWordDict.getWordInfoOnDate(date);
    const words = reviewWordDict.getWordsOnDate(date);
    setWordList(Array.from(words));
    setReviewWords(toReview||[]);
  }, []);
  
  const handleStartTest = () => {
    setIsTesting(true);
  };

  const handleEndTest = () => {
    setIsTesting(false);
    window.myDict.saveToLocal();
    reviewWordDict.save();
  };

  if (!reviewWords) {
    return <div>Word list not found.</div>;
  }

  return (
    !isTesting ? (<div>
      {wordList.length > 0&&<button className="test-btn" onClick={handleStartTest}>Review {wordList.length} words</button> }
      
      <ul className='list-group'>
        {reviewWords.map((word) => (
          <li className='list-group-item' key={word.word}>{word.word}: {window.myDict?.getWordScore(word.word)} from {word.listName}, reviewed on {Array.from(word.reviewedDates)} </li>
        ))}
      </ul>
    </div>) :
    <div>
        <TestWordList words={wordList}  exitHandler = {handleEndTest} />
    </div>);
};

export default ReviewWords;
