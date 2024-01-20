import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOut } from './firebase';
import HomePage from './HomePage';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const { displayName, email, photoURL } = currentUser;
        setUser({ displayName, email, photoURL });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        // No need to do anything here, as the onAuthStateChanged will update the user state
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <>
          <h1>{user.displayName}</h1>
          <h2>{user.email}</h2>
          <img src={user.photoURL} alt="Profile" />
          <button onClick={handleSignOut}>Sign out</button>
          <HomePage displayName={user.displayName} />
        </>
      )}
    </div>
  );
};

export default App;
