import React from 'react';
import { authService } from 'mfBase';
import { useHistory } from 'react-router';

const Profile = () => {
  
  const history = useHistory();

  const onLogOutClick = () => {

    const auth = authService.getAuth();
    authService.signOut(auth);
    history.push('/');
  }

  return (
    <>
      <button onClick={onLogOutClick}>Sign Out</button>
    </>
  );

}


export default Profile;