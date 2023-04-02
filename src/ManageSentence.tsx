/* Create a React component ManageSentence in TypeScript. The route is /admin/manage-sentence. It can access Firebase realtime database under "/sentences", where the key is a word, value is a sentence. Initially it shows the count of items and a search box. User can search a word and see the sentence if found in the database. User can add a new item, where the sentence length is between 1 and 200. User can also add items in bulk in a text input area, where it accept a JSON blob. The JSON format is {<word1>: <sentence1>, <word2>: <sentence2>,...}. It should show the format below the text input area and validate the input. If the input is valid, write all of them to the database, and override existing items if any.
For each word in the list (in JSON format), find an example sentence for them that contains the word. The sentence should be easy to understand by elementary student. 
Output format to {<word>: <sentence>}
Input: ["get","old","hen","now","fell","barn","step","too","find","cape","eat","take","shed","how","ride","wall","baby","note","hunt","slid","made","show","into","spots","ring","such","most","here","gate","mine","deep","glow","love","coin","stone","them","plane","stay","coal","was","sunny","toes","soon","nice","going","door","clams","kitten","garden","cord","arms","west","team","skim","belly","hire","wink","move","aid","rose","deck","bead","hurt","grins","leaf","spurs","elm","foot","bank","paws","oak","drive","alone","frogs","dew","paste","unkind","person","nearly","lower","walk","obey","winner","pilot","fresh","roof","flying","bitter","south","stack","panda","slumber","gall","wishes","missing","pretend","nodded","change","once"]
Let do the first 30 words.
*/

import React, { useEffect, useState } from 'react';
import 'firebase/database';
import { getDatabase, ref, set } from 'firebase/database';
import { GoogleAuthProvider, User, getAuth, signInWithRedirect } from 'firebase/auth';
import { redirect, useNavigate  } from 'react-router-dom';
import UserControl from './UserControl';

interface Sentence {
  word: string;
  sentence: string;
}

interface BulkSentenceInputProps {
  onSubmit: (bulkJson: Record<string, string>) => void;
}

const BulkSentenceInput: React.FC<BulkSentenceInputProps> = ({ onSubmit }) => {
  const [bulkInput, setBulkInput] = useState<string>('');

  const handleBulkInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkInput(event.target.value);
  };

  const handleBulkSubmit = () => {
    try {
      // Parse the input as JSON
      const parsedJson = JSON.parse(bulkInput);
      onSubmit(parsedJson);
      setBulkInput('');
    } catch {
      alert('Invalid JSON input');
    }
  };

  return (
    <div className="my-4">
      <h2>Add sentences in bulk</h2>
      <p>
        Enter the sentences in JSON format: <code>{"{<word1>: <sentence1>, <word2>: <sentence2>,...}"}</code>
      </p>
      <textarea className="form-control" value={bulkInput} onChange={handleBulkInput} />
      <button className="btn btn-primary mt-2" onClick={handleBulkSubmit}>Add</button>
    </div>
  );
};
interface Props {
  user: User | null;
}
const ManageSentence = ({user}: Props) => {
  const [authed, setAuthed] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>('');
  const [newSentence, setNewSentence] = useState<string>('');
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const app = window.gApp;
  const database = getDatabase(app);
  useEffect(() => {
    if (user && user.uid === '9ui0on1SCARMuOOURcjvOEWwr8k2') {
      // const provider = new GoogleAuthProvider();
      // const auth = getAuth(app);
      // signInWithRedirect(auth, provider);
      setAuthed(true);
    }
  }, [user]);
  const handleAddNewSentence = () => {
    if (newWord && newSentence) {
      // Add a new sentence to the database
      const item = ref(database, `/sentences/${newWord}`)
      set(item, newSentence);

      // Update the local state to reflect the new sentence
      setSentence({ word: newWord, sentence: newSentence });
      setNewWord('');
      setNewSentence('');
    }
  };

  const handleBulkSubmit = (bulkJson: Record<string, string>) => {
    // Write all of the new sentences to the database
    Object.entries(bulkJson).forEach(([word, sentence]) => {
      set(ref(database, `/sentences/${word}`), sentence);
    });

    // // Update the local state to reflect the new sentences
    // const [firstWord, firstSentence] = Object.entries(bulkJson)[0];
    // setSentence({ word: firstWord, sentence: firstSentence });
  };

  return (
    authed ? (
    <div className="container my-4">
      <h1 className="mb-4">Manage Sentences</h1>
      {sentence ? (
        <>
          <p>
            Sentence for "{sentence.word}": {sentence.sentence}
          </p>
          <button className="btn btn-secondary mt-2" onClick={() => setSentence(null)}>Done</button>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label htmlFor="new-word-input" className="form-label">New Word:</label>
            <input
              id="new-word-input"
              type="text"
              className="form-control"
              value={newWord}
              onChange={(event) => setNewWord(event.target.value.toLocaleLowerCase())}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-sentence-input" className="form-label">New Sentence:</label>
            <input
              id="new-sentence-input"
              type="text"
              className="form-control"
              value={newSentence}
              onChange={(event) => setNewSentence(event.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddNewSentence}>Add New Sentence</button>
          <BulkSentenceInput onSubmit={handleBulkSubmit} />

        </>
      )}
    </div>) : <UserControl onUserChanged={(user)=>{}}/>);
}
export default ManageSentence;