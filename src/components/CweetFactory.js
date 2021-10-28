import React, { useRef, useState } from 'react';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { storageService, dbService } from 'mfBase';

const CweetFactory = ({ userObj }) => {
  
  const [cweet, setCweet] = useState('');
  const [attachment, setAttachment] = useState();

  const fileInput = useRef();

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
  );
};

export default CweetFactory;