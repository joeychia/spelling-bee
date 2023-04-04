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
import list1 from "./wordLists/1.json";
import list2 from "./wordLists/2.json";
import list3 from "./wordLists/3.json";
import example from "./wordLists/1A.json";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WordList } from "./WordList/WordListPage";
import ReviewWords from "./ReviewWords";
import bee from "./bee.png";
import HowDoesItWork from "./HowDoesItWork";
import UserControl from "./UserControl";
import { User } from "firebase/auth";
import ManageWordLists from "./WordList/ManageWordLists";
import WordListCRUD from "./WordList/WordListCRUD";

window.gWordLists = [
  { name: "1st Grade", words: list1 },
  { name: "2nd Grade", words: list2 },
  { name: "3rd Grade", words: list3 },
  { name: "Example", words: example },
];

const Header: React.FC = () => {
  return (
    <div>
      <UserControl onUserChanged={(_?) => {}} />
      <div className="d-flex align-items-center my-3 text-white bg-purple rounded shadow-sm">
        <div className="lh-1">
          <h1 className="m-0">
            <img src={bee} alt="logo bee" className="logo" /> Spelling Made EZ
          </h1>
        </div>
      </div>
      {/* <h2>Pick a word list to test</h2> */}
    </div>
  );
};
interface Props {
  user: User | null;
}
const WordLists = ({user}:Props) => {
  const [wordLists, setWordLists] = useState<WordList[]>(window.gWordLists);
  const reviewWordDict = window.gReviewWords || {};
  const date = new Date().toISOString().slice(0, 10);
  const toReview = reviewWordDict.getWordInfoOnDate(date);
  return (
    <div className="page-container">
      <Header />
      {user && <ManageWordLists userId={user.uid} />}
      <ul className="list-group">
        <li key="mywordlist" className="list-group-item list-group-item-success">
          Public word lists
        </li>
        {toReview.length > 0 && (
          <li className="list-group-item" key="review-today">
            <Link to={`/wordlist/review-today`}>Review Today</Link>{" "}
            {toReview.length}
          </li>
        )}
        {wordLists.map((wordList) => (
          <li className="list-group-item" key={wordList.name}>
            <Link to={`/wordlist/${wordList.name}`}>{wordList.name}</Link>{" "}
            {wordList.words.length}
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
 v 3) polish design
 v 4) test on ipad (speech recognition not working)
 v 5) skip mastered words in test
 v 6) show word score on wordlist page
 7) add account support to save myDict and wordLists
 v 8) schedule words for testing
 v 9) publish to github pages
 v 10) add auth
 v 11) manage word lists
 v 12) manage sentences list
 */
export default WordLists;
