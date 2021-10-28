import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
// import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { dbService } from 'mfBase';
import Cweet from 'components/Cweet';
import CweetFactory from 'components/CweetFactory';

const Home = ({ userObj }) => {
  
  const [cweets, setCweets] = useState([]);
  
  useEffect(() => {
    const q = query(
      collection(dbService, 'cweets'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const newArray = querySnapshot.docs.map(doc => {
        // moment(doc.data().).format('YYYY년 MM월 DD일')
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCweets(newArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  return (
    <div className='container'>
      <CweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {
          cweets.map(cweet =>
            <Cweet key={cweet.id} cweetObj={cweet} isOwner={cweet.creatorId === userObj.uid ? true : false} />
          )
        }
      </div>
    </div>
  )
}
export default Home;