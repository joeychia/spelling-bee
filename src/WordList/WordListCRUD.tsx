import { useState, useEffect, SetStateAction } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'firebase/database';
import { Database, getDatabase, off, onValue, ref, set } from 'firebase/database';
import Typo from "typo-js";
const dictionary = new Typo("en_US", undefined, undefined, {dictionaryPath: "dictionaries/"});

type RouteParams = {
  wordlistId: string;
};
interface Props {
  userId: string|undefined;
}
const WordListCRUD = ({userId}: Props) => {
  const { wordlistId } = useParams<RouteParams>();

  const [list, setList] = useState<string[]>([]);
  const [newWords, setNewWords] = useState<string>("");
  const app = window.gApp;
  const database = getDatabase(app);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      return;
    }
    // Create reference to Firebase database
    const wordListRef = getWordList(database, userId, wordlistId, setList);

    // Detach listener when component unmounts
    return () => {
      off(wordListRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, wordlistId]);

  const handleSave = () => {
    // Save updated words to Firebase database
    set(ref(database, `users/${userId}/wordlist/${wordlistId}`), list).then(()=> {
      navigate("/");
    });
  };

  const handleQuit = () => {
      navigate(-1);
  };

  const handleAdd = () => {
    const splitted = newWords.split(/[,\s]+/).map((word) => word.trim());

    const words = splitted.map((word) => word.trim());
    setList(list.concat(words).filter((item, index, arr) => arr.indexOf(item) === index));
    setNewWords("");
  };

  const handleDelete = (i: number) => setList(list.filter((_, index) => index !== i));

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNewWords(value)
  };

  // Function to format words
  const formatWords = (rawString: string): string => {
    // Split the string into words
    const words = rawString.split(/\s+/);

    // Correct typos and spelling for each word
    const correctedWords = words.map(word => {
        if (!dictionary.check(word)) {
            const suggestions = dictionary.suggest(word);
            return suggestions.length > 0 ? suggestions[0] : word;
        }
        return word;
    });

    // Sort the words
    correctedWords.sort();

    // Join the words into a single string
    return correctedWords.join(' ');
  }
  const handleFormat = () => {
    const formatted = formatWords(newWords);
    setNewWords(formatted);
  };


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h3>Word List</h3>
          <ul className="list-group">
            {list.map((word, index) => (
              <li className="list-group-item" key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  {word}
                  <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </li>
            ))}

          </ul>
          <button className="btn btn-primary mt-3" type="button" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary mt-3" type="button" onClick={handleQuit}>Quit without saving</button>
        </div>
        <div className="col-md-6">
          <h3>Add Words</h3>
          <h5><small>(single word or multiple words separated by whitespace)</small></h5>
          <div className="input-group mb-3">
            <textarea className="form-control" value={newWords} onChange={handleInputChange} />
            <button className="btn btn-primary" type="button" onClick={handleAdd}>Add</button>
            <button className="btn btn-primary" type="button" onClick={handleFormat}>Format</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function getWordList(database: Database, userId: string, wordlistId: string | undefined, setList: { (value: SetStateAction<string[]>): void; (arg0: string[]): void; }) {
  const wordListRef = ref(database, `users/${userId}/wordlist/${wordlistId}`);

  // Fetch word list data from Firebase database
  onValue(wordListRef, (snapshot) => {
    const data = snapshot.val() as string[];
    if (data) {
      setList(data);
    }
  });
  return wordListRef;
}

export default WordListCRUD;
