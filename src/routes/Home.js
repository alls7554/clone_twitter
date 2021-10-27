import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore';
// import moment from 'moment';
import { v4 } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import { dbService, storageService } from 'mfBase';
import Cweet from 'components/Cweet';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';

const Home = ({ userObj }) => {
  const [cweet, setCweet] = useState('');
  const [cweets, setCweets] = useState([]);
  const [attachment, setAttachment] = useState();

  const fileInput = useRef();

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
    let attachmentUrl = '';
    if(attachment) {
      const tempAttachmentName = userObj.uid+'/'+v4();

      const attachtmentRef = ref(storageService, `${tempAttachmentName}`);
      await uploadString(attachtmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(ref(storageService, `${tempAttachmentName}`));
    }
    await addDoc(collection(dbService, "cweets"), {
      creatorId: userObj.uid,
      text: cweet,
      createdAt: serverTimestamp(),
      attachmentUrl,
    });

    setCweet('');
    fileInput.current.value = null;
    setAttachment(null);
  }

  const onChange = e => {
    const { target: { value } } = e;
    setCweet(value);
  }

  const onFileChange = e => {
    const {
      target: { files }
    } = e;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent
      setAttachment(result);
    }

    reader.readAsDataURL(theFile);
  }

  const onClearAttachmentClick = () => {
    fileInput.current.value = null;
    setAttachment(null);
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
        <input type='file' accept='image/*' ref={fileInput} onChange={onFileChange} />
        <input type='submit' value='Cweet' />
        {attachment && (
          <div>
            <img src={attachment} width='50px' height='50px' alt='thumbnail' />
            <button onClick={onClearAttachmentClick}>clear</button>
          </div>
        )}
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