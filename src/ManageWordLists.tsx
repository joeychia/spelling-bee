/*
Create a React component ManageWordList in Typescript. 
Initially, it fetches the word list of the user from the server and displays it in a table. The Firebase database query is under /users/{userId}/wordlists. The value is a array of string of wordlist names.
There is /users/{userId}/wordlist/{wordlistName} for each word list. The value is a array of words.
Each row of the table has a button to delete the word list, and a button to edit the word list.
Below the table, there is a button to add a new word list.
Use a component placeholder for adding and modifying a word list for now.
*/

import React, { useState, useEffect } from 'react';
import { getDatabase, off, onValue, ref, remove } from 'firebase/database';

type ManageWordListsProps = {
  userId: string;
}

interface WordList {
    id: string;
    name: string;
  }
  
const ManageWordLists: React.FC<ManageWordListsProps> = ({ userId }) => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const app = window.gApp;
  const database = getDatabase(app);
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
    const wordListRef = ref(database, `users/${userId}/wordlists/${id}`);
    remove(wordListRef);
  };

  const handleEdit = (name: string) => {
    // Placeholder for editing a word list
    console.log(`Editing word list "${name}"`);
  };

  const handleAdd = () => {
    // Placeholder for adding a new word list
    console.log('Adding a new word list');
  };

  return (
    <div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {wordLists.map(({id, name}) => (
            <tr key={name}>
              <td>{name}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(id)}>Delete</button>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-success" onClick={handleAdd}>Add a new word list</button>
    </div>
  );
};

export default ManageWordLists;
