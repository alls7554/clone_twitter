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
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      {/* <footer>&copy; {new Date().getFullYear()} Cwitter</footer> */}
    </>
  ) 
}

export default App;
