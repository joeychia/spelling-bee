/*
Create a React component WordLists in TypeScript.
The route is "/wordlists".
The page manages a list of word lists.
It can display a list of word lists
Each word list has a name, and a list of words. 
The word list page /wordlist/:wordlistName has a top bar with a "Back" button. 
*/

import list1A from "./wordLists/1A.json";
import list1B from "./wordLists/1B.json";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface WordList {
  name: string;
  words: string[];
}

const defaultWordLists: WordList[] = [
  { name: 'List 1', words: list1A },
  { name: 'List 2', words: list1B },
];

const WordLists: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>(defaultWordLists);

  return (
    <div>
      <h1>Word Lists</h1>
      <ul>
        {wordLists.map((wordList) => (
          <li key={wordList.name}>
            <Link to={`/wordlist/${wordList.name}`}>{wordList.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordLists;
