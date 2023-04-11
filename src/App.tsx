import { useEffect, useState } from 'react';
import './App.css';
import { MyDict } from './MyDict';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import WordLists from './WordLists';
import WordListPage from './WordList/WordListPage';
import { ReviewDict } from './ReviewDict';
import { firebaseSingleton } from './FirebaseAppSingleton';
import ManageSentence from './ManageSentence';
import { User, getAuth} from 'firebase/auth';
import UserControl from './UserControl';
import WordListCRUD from './WordList/WordListCRUD';
import MyWordList from './WordList/MyWordList';
import { getDatabase } from 'firebase/database';

// Initialize Firebase
window.gApp = firebaseSingleton.getInstance();
window.myDict = new MyDict();
window.myDict.restoreFromLocal();
window.gReviewWords =new ReviewDict();
//disable context menu
document.addEventListener('contextmenu', event => event.preventDefault());

function App() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(window.gApp);
  // setPersistence(auth, inMemoryPersistence);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        window.myDict.restoreFromDatabase(user.uid, getDatabase(window.gApp));
        window.gReviewWords.restoreFromDatabase(user.uid, getDatabase(window.gApp));
      }
    });
    return unsubscribe;
  }, [auth]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/wordlists" />}  />
        <Route path="/wordlists" element={<WordLists user={user}/>} />
        <Route path="/wordlist/:wordlistName" element={<WordListPage userId={user?.uid} />} />
        <Route path="/test/:wordlistId" element={<MyWordList userId={user?.uid} />} />
        <Route path="/wordlist/mutate/:wordlistId" element={<WordListCRUD userId={user?.uid}/>} />
        <Route path="/signin" element={<UserControl onUserChanged={()=>{}} />} />
        <Route path="/admin/manage-sentence" element={<ManageSentence user={user} />} />
      </Routes>
    </HashRouter>
  );

}

export default App;
