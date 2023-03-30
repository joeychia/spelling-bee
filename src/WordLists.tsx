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
import ReviewWords from "./ReviewWords";
import bee from './bee.png';
import HowDoesItWork from "./HowDoesItWork";

window.gWordLists = [
  { name: 'List 1', words: list1A },
  { name: 'List 2', words: list1B },
];

const Header: React.FC = () => {
  return (<div>
    <div className="d-flex align-items-center my-3 text-white bg-purple rounded shadow-sm">
      <div className="lh-1">
        
        <h1><img src={bee} alt="logo bee" className="logo" /> Spelling Made EZ</h1>
      </div>

    </div>
    <h2>Pick a word list to test</h2>
      </div>
  );
}
const WordLists: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>(window.gWordLists);
  const reviewWordDict = window.gReviewWords || {};
  const date = new Date().toISOString().slice(0, 10)
  const toReview = reviewWordDict.getWordInfoOnDate(date);
  return (
    <div className="page-container">
      <Header />
      <ul className="list-group">
        {toReview.length > 0 && <li className="list-group-item" key="review-today">
            <Link to={`/wordlist/review-today`}>Review Today</Link>
        </li>}
       {wordLists.map((wordList) => (
          <li className="list-group-item" key={wordList.name}>
            <Link to={`/wordlist/${wordList.name}`}>{wordList.name}</Link>
          </li>
        ))}

      </ul>
      {/* <ReviewWords /> */}
      <HowDoesItWork />

    </div>
  );
};

/* TODO:
 v 1) Import and Export myDict 
 v 2) import the lists into global variable and use it in the wordlist page 
 3) polish design 
 x 4) test on ipad (speech recognition not working)
 v 5) skip mastered words in test 
 v 6) show word score on wordlist page 
 7) add account support to save myDict and wordLists 
 v 8) schedule words for testing
 v 9) publish to github pages
 */
export default WordLists;
