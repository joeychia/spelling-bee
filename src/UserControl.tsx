/* Create a React component User in Typescript. It contains a sign in button that redirects to Google sign in page. Once signed in, the button becomes sign out, and show user name and profile icon. It has a callback function to pass the user data to parent component. The component should be both mobile and desktop friendly.
*/

import React, { useEffect, useState } from 'react';
import './UserControl.css';
import {GoogleAuthProvider, getAuth, signInWithRedirect, User } from 'firebase/auth';
interface UserData {
  displayName?: string | null;
  photoURL?: string | null;
}

interface UserProps {
  onUserChanged: (user: User | null) => void;
}

const UserControl: React.FC<UserProps> = ({ onUserChanged }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const app = window.gApp;
  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((user) => {
      const uData: UserData = {displayName: user?.displayName, photoURL: user?.photoURL};
      if (user) {
        setUserData(uData);
        onUserChanged(user);
      } else {
        onUserChanged(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [onUserChanged]);

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    signInWithRedirect(auth, provider);
  };

  const signOut = () => {
    getAuth(app).signOut();
    setUserData(null);
  };

  return (
    <div className="user">
      {userData ? (
        <>
          <img src={userData.photoURL || ''} alt="Profile" className="profile-icon" />
          <span className="user-name">{userData.displayName}</span>
          <button onClick={signOut} className="sign-out-btn">
            Sign out
          </button>
        </>
      ) : (
        <button onClick={signIn} className="sign-in-btn">
          Sign in
        </button>
      )}
    </div>
  );
};

export default UserControl
;
