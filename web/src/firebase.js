import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as signOutFirebase } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcUzcGMeBeZ_pzHElPcGfouxi49QOgtWc",
  authDomain: "webspeak-26b29.firebaseapp.com",
  projectId: "webspeak-26b29",
  storageBucket: "webspeak-26b29.appspot.com",
  messagingSenderId: "305683609073",
  appId: "1:305683609073:web:6e4d686fdc8e730855c050",
  measurementId: "G-253968FNJK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, handle accordingly (e.g., show a message)
        console.log('Popup closed by user');
      } else {
        // Handle other errors
        console.error(error);
      }
    });
};

export const signOut = () => {
  return signOutFirebase(auth);
};