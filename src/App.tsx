import React, { useCallback, useEffect, useState } from 'react';
//@ts-ignore
import './App.css';
import { Draggable } from 'react-drag-reorder';
import WordInput from './WordInput';
import ReadWord from './ReadWord';
import { MyDict } from './MyDict';
import TestWordList from './TestWordList';
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import WordLists from './WordLists';
import WordListPage from './WordListPage';
import { ReviewDict } from './ReviewDict';

window.myDict = new MyDict();
window.myDict.restoreFromLocal();
window.gReviewWords =new ReviewDict();

const myDict = window.myDict;

// class TestWordList extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div className='d-grid gap-2'>
//         <span>Word: {this.props.qNumber + 1} of {this.props.word..length}</span>
//         {
//           /* <Speech class="btn btn-success" text={word} textAsButton="false" displayText="Play Spelling"  /> */
//         }
//         <ReadWord word={this.props.word} sentence="An apple a day keeps the doctor away" dontKnownHandler={() => {
//           myDict.changeWordScore(this.props.word, -1);
//           this.props.word..push(this.props.word);
//         }} />
//         {this.props.qNumber > 0 && <input className='btn btn-warning' type='button' value="PREVIOUS" onClick={this.props.clickPrevious} />}
//         {this.props.qNumber + 1 < this.props.word..length && <input className='btn btn-success w50' type='button' value="NEXT" onClick={this.props.clickNext} />}
//         {this.props.qNumber + 1 >= this.props.word..length && <input className='btn btn-primary' type='button' value="END TEST" onClick={() => this.props.setPageStatus('viewspellings')} />}
//         <WordInput word={this.props.word} successHandler={() => myDict.changeWordScore(this.props.word, +1)} />
//       </div>
//     );
//   }
// }


function App() {
  const [words, setWords] = useState<string[]>(localStorage.getItem('spellings')?.split(',') ?? [])
  const [qNumber, setQNumber] = useState<number>(0)
  const [word, setWord] = useState<string>(words[qNumber]);
  const [newWord, setNewWord] = useState<string>('');
  const [pageStatus, setPageStatus] = useState<'start' | 'teststarted' | 'viewspellings' | 'editspellings'>('start');

  useEffect(() => {
    // Reset the states when the input prop updates
    setWords(words);
  }, [pageStatus]);

  const clickNext = () => {

    if (qNumber + 2 > words.length) {
      return;
    }

    setWord(words[qNumber + 1]);
    setQNumber(qNumber + 1);

  }

  const clickPrevious = () => {

    if (qNumber === 0) {
      return;
    }

    setWord(words[qNumber - 1]);
    setQNumber(qNumber - 1);

  }

  const clickEnd = () => {
    setPageStatus('start');
    setQNumber(0);
    setWord(words[0]);
  }

  const deleteWord = (index: number) => {
    let savedWords = localStorage.getItem('spellings') ?? '';
    const savedWordsArray = savedWords.split(',');
    savedWordsArray.splice(index, 1);
    localStorage.setItem('spellings', savedWordsArray.join(','));
    setWords(savedWordsArray);

  }

  const listOfWords = words.map((word) =>
    <div className='input-group' key={words.indexOf(word)}>
      <span className='input-group-text w-5 text-right'>{words.indexOf(word) + 1}.</span>
      <input className='form-control' type='text' value={word} disabled />
      <input className='form-control' type='text' value={myDict.getWord(word)?.score} disabled />
      {pageStatus === 'editspellings' &&
        <button className='btn btn-outline-danger' type='submit' onClick={() => deleteWord(words.indexOf(word))} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
        </svg> Delete</button>
      }
    </div>
  );

  const updateWord = useCallback((e: React.ChangeEvent<HTMLInputElement>, word: string) => {
    debugger;
    let currentWords = words;
    const ind = words.indexOf(word);
    currentWords[ind] = e.target.value;
    setWords(currentWords);
  }, [words]);

  const listOfWordsEdit = useCallback(() => {
    let currentWords = words;
    return currentWords.map((word) =>
      <input key={words.indexOf(word)} value={word} onChange={(e) => updateWord(e, word)} />
    )
  }, [updateWord, words]);

  const newList = () => {
    // const savedWords = ''
    // localStorage.setItem('spellings', savedWords);
    const savedWords = localStorage.getItem('spellings') ?? '';
    setWords(savedWords.split(','));
    setNewWord('');
    setPageStatus('editspellings');
  }


  const addWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || newWord.length === 0) {
      return;
    }
    let savedWords = localStorage.getItem('spellings') ?? '';
    if (savedWords?.length > 0) {
      savedWords += ',';
    }
    savedWords += newWord;
    localStorage.setItem('spellings', savedWords);
    setWords(savedWords.split(','));
    setNewWord('');

  }

  const getChangedPos = (currentPos: number, newPos: number) => {
    console.log(currentPos, newPos);
    let savedWords = localStorage.getItem('spellings') ?? '';
    const savedWordsArray = savedWords.split(',');
    savedWordsArray.splice(newPos, 0, savedWordsArray.splice(currentPos, 1)[0]);
    localStorage.setItem('spellings', savedWordsArray.join(','));
    setWords(savedWordsArray);


  };

  useEffect(() => {

    listOfWordsEdit();
  }, [listOfWordsEdit]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/wordlists" />}  />
        <Route path="/wordlists" element={<WordLists />} />
        <Route path="/wordlist/:wordlistName" element={<WordListPage />} />
      </Routes>
    </HashRouter>
  );

  //Fascinate,Commemorate,Irrelevant,Maintenance,Disastrous,Foreign,Occurrence,Grievance,Negotiate,Aggravate
  // return (
  //   <div className="App container">
  //     <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
  //       <div className="lh-1">
  //         <h1>Spelling Bee Made EZ</h1>
  //       </div>
  //     </div>
  //     <WordLists />
  //     {pageStatus === 'start' &&
  //       <>
  //         <div className='d-grid gap-2'>
  //           {(words.length > 0 && !(words.length === 1 && words[0] === '')) &&
  //             <>
  //               <input className='my-3 p-3 bg-body rounded shadow-sm' type='button' value="START TEST" onClick={() => setPageStatus('teststarted')} />
  //               <input className='btn btn-primary' type='button' value="VIEW SPELLINGS" onClick={() => setPageStatus('viewspellings')} />
  //             </>
  //           }
  //           <input className='btn btn-primary' type='button' value="EDIT LIST" onClick={() => newList()} />

  //         </div>
  //       </>
  //     }

  //     {pageStatus === 'teststarted' &&
  //       <TestWordList words={words} exitHandler={() => setPageStatus('viewspellings')}  />
  //     }

  //     {pageStatus === 'viewspellings' &&
  //     <div className='d-grid gap-2'>
  //       <div className='gap-0'>
  //           <ol className='list-group list-group-numbered'>
  //           {listOfWords}
  //           </ol>
  //       </div>
  //       <input className='btn btn-primary' type='button' value="HOME" onClick={clickEnd} />
  //     </div>
  //     }

  //     {pageStatus === 'editspellings' &&
  //       <>
  //         <div className='d-grid gap-2'>
  //           {(words.length > 0 && !(words.length === 1 && words[0] === '')) &&
  //             <div className='d-grid'>
  //               {listOfWords}
  //             </div>
  //           }
  //           <form id='form1' className="input-group" onSubmit={addWord} >
  //             <input type="text" value={newWord} className="form-control" onChange={(e) => { setNewWord(e.target.value) }} />
  //             {/* <input className='btn btn-primary' type='submit' value="ADD" /> */}
  //             <button className='btn btn-primary' form='form1' type='submit' >
  //               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
  //                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
  //                 <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
  //               </svg>&nbsp;
  //               ADD</button>

  //           </form>
  //           <input className='btn btn-primary' type='button' value="BACK" onClick={() => setPageStatus('start')} />
  //         </div>
  //       </>
  //     }

  //   </div>
  // );
}

export default App;

