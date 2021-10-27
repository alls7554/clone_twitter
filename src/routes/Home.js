import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { dbService } from 'mfBase';
import Cweet from 'components/Cweet';

const Home = ({ userObj }) => {
  const [cweet, setCweet] = useState('');
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

  const onSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(dbService, "cweets"), {
      creatorId: userObj.uid,
      text: cweet,
      createdAt: serverTimestamp(),
    });

    setCweet('');
  }

  const onChange = e => {
    const { target: { value } } = e;
    setCweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          value={cweet}
          onChange={onChange}
          placeholder='Whats on your mind?'
          maxLength={120} />
        <input type='submit' value='Cweet' />
      </form>
      <div>
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