import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export interface FirebaseSingleton {
  getInstance: () => FirebaseApp;
}

export const firebaseSingleton = (() => {
  let instance: FirebaseApp;

  function initializeFirebase(): FirebaseApp {
    const firebaseConfig: FirebaseOptions = {
        apiKey: "AIzaSyCNqxpkRjwFJ2HaBKPI_PIQigtR16OC1g4",
        authDomain: "spelling-made-ez.firebaseapp.com",
        databaseURL: "https://spelling-made-ez-default-rtdb.firebaseio.com",
        projectId: "spelling-made-ez",
        storageBucket: "spelling-made-ez.appspot.com",
        messagingSenderId: "670292969135",
        appId: "1:670292969135:web:11fc909bfaefa6c5e5365a",
        measurementId: "G-QZHSM76RM9"
      };
    return initializeApp(firebaseConfig);
  }

  function getInstance(): FirebaseApp {
    if (!instance) {
      instance = initializeFirebase();
    }
    return instance;
  }

  return {
    getInstance
  };
})();

