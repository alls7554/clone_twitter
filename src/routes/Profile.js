import React, { useState } from 'react';
import { authService } from 'mfBase';
import { useHistory } from 'react-router';
// import { collection, getDocs, orderBy, query, where } from '@firebase/firestore';
import { updateProfile } from '@firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
  
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    const auth = authService.getAuth();
    authService.signOut(auth);
    history.push('/');

  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.getAuth().currentUser, { displayName: newDisplayName });
    }

    refreshUser();
  }

  const onChange = e => {
    const { target: { value } } = e;
    setNewDisplayName(value);
  }

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input
          type='text'
          placeholder='Display Name'
          onChange={onChange}
          autoFocus
          value={newDisplayName}
        />
        <input
          type="submit"
          value='Update Profile'
          className='formBtn'
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <input className='formBtn cancelBtn logOut' onClick={onLogOutClick} value='Sign Out'/>
    </div>
  );

}


export default Profile;


  // const getMyCweets = async () => {

  //   const q = query(
  //     collection(dbService, "cweets"),
  //     where("creatorId", "==", userObj.uid),
  //     orderBy('createdAt', 'desc')
  //   );

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //   });
  // }

  // useEffect(() => {
  //   getMyCweets();
  // }, []);