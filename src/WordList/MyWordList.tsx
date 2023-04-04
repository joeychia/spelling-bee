import { getDatabase, off, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TestWordList from '../TestWordList';
import { getWordList } from './WordListCRUD';

export interface WordList {
  name: string;
  words: string[];
}
interface Props {
  userId: string|undefined;
}
const MyWordList = ({userId}: Props) => {
  const { wordlistId } = useParams<{ wordlistId: string }>();
  const [isTesting, setIsTesting] = useState(false); // Add state and default value

  const [wordListName, setWordListName] = useState("");
  const [wordList, setWordList] = useState([] as string[]); // Add state and default value
  const app = window.gApp;
  const database = getDatabase(app);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      return;
    }
    const wordListsRef = ref(database, `users/${userId}/wordlists/${wordlistId}`);

    // Fetch word lists data from Firebase database
    onValue(wordListsRef, (snapshot) => {
      const data = snapshot.val() as string;
      if (data) {
        setWordListName(data);
      }
    });

    const wordListRef = getWordList(database, userId, wordlistId, setWordList);

    // Detach listener when component unmounts
    return () => {
      off(wordListsRef);
      off(wordListRef);
    };
  }, [userId, wordlistId]);


  if (!userId) {
    return <div>You must login to use this word list.</div>;
  }

  if (!wordList || wordList.length < 1) {
    return <div>Word list not found.</div>;
  }
  const handleStartTest = () => {
    setIsTesting(true);
  };
  const handleEndTest = () => {
    setIsTesting(false);
    window.myDict.saveToLocal();
    window.gReviewWords.save();
  };

  return (
    !isTesting ? (<div className='page-container'>
      <h2 className='d-flex align-items-center'><Link to="/wordlists"><FaArrowLeft /></Link>{wordListName}</h2>

      <button className="btn btn-primary btn-lg" onClick={handleStartTest}>Start test</button>
      <ul className='grid-list list-group mt-2 mb-2'>
        {wordList.map((word) => (
          window.myDict.getWordScore(word) > 100 ?
          <li className='list-group-item' key={word}><del>{word} {window.myDict.getWordScore(word)}</del></li> :
          <li className='list-group-item' key={word}>{word} {window.myDict.getWordScore(word)}</li>
        ))}
      </ul>
      <h2>
        <Link to="/wordlists">&#128281;</Link>
      </h2>
    </div>):
    <div>
        <TestWordList words={wordList} listName={wordListName} exitHandler = {handleEndTest} />
    </div>
  );
};

export default MyWordList;
