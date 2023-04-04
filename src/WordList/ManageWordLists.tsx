/*
Create a React component ManageWordList in Typescript.
Initially, it fetches the word list of the user from the server and displays it in a table. The Firebase database query is under /users/{userId}/wordlists. The value is a array of string of wordlist names.
There is /users/{userId}/wordlist/{wordlistName} for each word list. The value is a array of words.
Each row of the table has a button to delete the word list, and a button to edit the word list.
Below the table, there is a button to add a new word list.
Use a component placeholder for adding and modifying a word list for now.
*/

import React, { useState, useEffect } from 'react';
import { getDatabase, off, onValue, ref, remove, set } from 'firebase/database';
import { FaTrash, FaEdit, FaPlusSquare, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

type ManageWordListsProps = {
  userId: string;
}

interface WordList {
  id: string;
  name: string;
}

export function wordlistNameToId(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
}

const ManageWordLists: React.FC<ManageWordListsProps> = ({ userId }) => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const app = window.gApp;
  const database = getDatabase(app);
  const navigate = useNavigate();
  useEffect(() => {
    const wordListsRef = ref(database, `users/${userId}/wordlists`);
    onValue(wordListsRef, (snapshot) => {
      const wordListsObj = snapshot.val();
      const wordListsArr = Object.keys(wordListsObj).map((key) => ({
        id: key,
        name: wordListsObj[key],
      }));
      setWordLists(wordListsArr);
    });
    return () => off(wordListsRef);
  }, [userId]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this word list?')) {
      const wordListsRef = ref(database, `users/${userId}/wordlists/${id}`);
      remove(wordListsRef);
      const wordListRef = ref(database, `users/${userId}/wordlist/${id}`);
      remove(wordListRef);

      // Remove the deleted word list from the wordLists state
      const updatedWordLists = wordLists.filter((wordList) => wordList.id !== id);
      setWordLists(updatedWordLists);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing word list "${id}"`);
    navigate(`/wordlist/mutate/${id}`);
  };

  const handleAdd = () => {
    const wordListName = window.prompt('Enter the name of the new word list:');
    if (!wordListName) {
      return;
    }

    const wordListId = wordlistNameToId(wordListName);
    const wordListRef = ref(database, `users/${userId}/wordlists/${wordListId}`);
    set(wordListRef, wordListName).then(()=> {
      // setWordLists([...wordLists, { id: wordListId, name: wordListName }]);
      // Navigate to the new word list page
      navigate(`/wordlist/mutate/${wordListId}`);
    });
  };

  return <div>{wordLists.length > 0 && (
    <div className="mb-3">
      <ul className="list-group">
        <li key="mywordlist" className="list-group-item list-group-item-success d-flex justify-content-between align-items-center">
          My word lists
          <button className="btn btn-success btn-sm mx-1" onClick={handleAdd}>
              <FaPlus />
          </button>
        </li>
        {wordLists.map(({ id, name }) => (
          <li key={name} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/test/${id}`}>{name}</Link>
            <div>
              <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(id)}>
                <FaEdit />
              </button>
              <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(id)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>)}

    </div>
};

export default ManageWordLists;
