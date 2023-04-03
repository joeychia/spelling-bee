import { getDatabase, off, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

  return (
    <div className='page-container'>
      <h2>{wordListName}</h2>
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
    </div>
  );
};

export default MyWordList;
