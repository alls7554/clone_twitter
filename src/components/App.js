import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'mfBase';
import { onAuthStateChanged } from '@firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    const auth = authService.getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj({
          uid: user.uid,
          displayName: user.displayName
        })
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setUserObj({
      uid: authService.getAuth().currentUser.uid,
      displayName: authService.getAuth().currentUser.displayName
    })
  }

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
      {/* <footer>&copy; {new Date().getFullYear()} Cwitter</footer> */}
    </>
  ) 
}

export default App;
