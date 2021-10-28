import React, { useRef, useState } from 'react';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { storageService, dbService } from 'mfBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const CweetFactory = ({ userObj }) => {
  
  const [cweet, setCweet] = useState('');
  const [attachment, setAttachment] = useState('');

  const fileInput = useRef();

  const onSubmit = async (e) => {
    if (cweet === '') {
      return;
    }
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
    setAttachment('');
  }

  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <input
          type='text'
          value={cweet}
          onChange={onChange}
          placeholder='Whats on your mind?'
          maxLength={120}
          className='factoryInput__input'
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label for='attach-file' className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id='attach-file'
        type='file'
        accept='image/*'
        ref={fileInput}
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className='factoryForm__attachment'>
          <img src={attachment} alt='thumbnail' style={{ backgroundImage: attachment }} />
          <div className='factoryForm__clear' onClick={onClearAttachmentClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default CweetFactory;