/*
Create a React component WordLists in TypeScript.
The route is "/wordlists".
The page manages a list of word lists.
It can display a list of word lists
Each word list has a name, and a list of words. 
The word list page /wordlist/:wordlistName has a top bar with a "Back" button. 
*/


/*

For each word in the list, find an example sentence for them, the sentence should be easy to understand by elementary student.
[{word: "digest", sentence:""}, {word: "develop", sentence:""}, {word: "sore", sentence:""}]
Put the sentence in the given json format.

[  {"word": "digest", "sentence": "After I ate breakfast, my body started to digest the food and turn it into energy."},  {"word": "develop", "sentence": "If I practice playing the piano every day, I can develop my skills and become a better piano player."},  {"word": "sore", "sentence": "After playing soccer for a long time, my legs were sore and I needed to rest."}]


*/
import list1A from "./wordLists/1A.json";
import list1B from "./wordLists/1B.json";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WordList } from "./WordListPage";

window.gWordLists = [
  { name: 'List 1', words: list1A },
  { name: 'List 2', words: list1B },
];

const WordLists: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>(window.gWordLists);

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

/* TODO:
 1) Import and Export myDict 
 v 2) import the lists into global variable and use it in the wordlist page 
 3) polish design 
 x 4) test on ipad (speech recognition not working)
 x 5) skip mastered words in test 
 6) show word score on wordlist page 
 7) add account support to save myDict and wordLists 
 8) schedule words for testing
 v 9) publish to github pages
 */
export default WordLists;
