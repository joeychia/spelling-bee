import { getDatabase } from 'firebase/database';
import { useEffect, useState } from 'react';
import { FaArrowLeft} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import TestWordList from '../TestWordList';

export interface WordList {
  name: string;
  words: string[];
}
interface Props {
  userId: string|undefined;
}
const WordListPage = ({userId}: Props) => {
  const { wordlistName } = useParams<{ wordlistName: string }>();

  const [isTesting, setIsTesting] = useState(false); // Add state and default value
  const [wordList, setWordList] = useState({} as WordList); // Add state and default value
  const database = getDatabase(window.gApp);
  useEffect(() => {
    setIsTesting(false);
    if (wordlistName==="review-today") {
      const reviewWordDict = window.gReviewWords || {};
      const date = new Date().toISOString().slice(0, 10)
      const words = reviewWordDict.getWordsOnDate(date) as Set<string>;
      const reviewWordList = {name: "Review today", words: Array.from(words)};
      setWordList(reviewWordList);
    } else {
      const foundList = window.gWordLists.find((list) => list.name === wordlistName);
      if (foundList) {
        setWordList(foundList);
      }
    }


  }, [wordlistName]);

  const handleStartTest = () => {
    setIsTesting(true);
  };

  const handleEndTest = () => {
    setIsTesting(false);
    window.myDict.saveToLocal();
    window.gReviewWords.save();
    if (userId && database) {
      window.myDict.saveToDatabase(userId, database);
      window.gReviewWords.saveToDatabase(userId, database);
    }
  };

  if (!wordList || !wordList.words) {
    return <div>Word list not found.</div>;
  }

  return (
    !isTesting ? (<div className='page-container'>

      <h2 className='d-flex align-items-center'><Link to="/wordlists"><FaArrowLeft /></Link>{wordList.name}</h2>
      <button className="btn btn-primary btn-lg" onClick={handleStartTest}>Start test</button>

      <ul className='grid-list list-group mt-2 mb-2'>
        {wordList.words.map((word) => (window.myDict.getWordScore(word) > 100 ?
          <li className='list-group-item' key={word}><del>{word} {window.myDict.getWordScore(word)}</del></li> :
          <li className='list-group-item' key={word}>{word} {window.myDict.getWordScore(word)}</li>
        ))}
      </ul>
      <h2>

      </h2>
    </div>) :
    <div>
        <TestWordList words={wordList.words} listName={wordlistName} exitHandler = {handleEndTest} />
    </div>);
};

export default WordListPage;
