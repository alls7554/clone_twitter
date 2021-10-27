import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';
import { dbService, storageService } from 'mfBase';
import React, { useState } from 'react';

const Cweet = ({ cweetObj, isOwner }) => {

  const [editing, setEditing] = useState(false);
  const [editCweet, setEditCweet] = useState(cweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this cweet?');

    if (ok) {
      //리터럴
      const CweetTextRef = doc(dbService, 'cweets', `${cweetObj.id}`);

      // delete 부분
      await deleteDoc(CweetTextRef);

      if (cweetObj.attachmentUrl) {
        await deleteObject(ref(storageService, cweetObj.attachmentUrl));
      }
    }
  }

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }

  const onSubmit = async (e) => {
    const CweetTextRef = doc(dbService, 'cweets', `${cweetObj.id}`);

    await updateDoc(CweetTextRef, {
      text: editCweet,
    });

    setEditing(false);
  }

  const onChange = e => {
    const { target: { value } } = e;
    setEditCweet(value);
  }

  return (
    <div >
      {/* <span>{moment(cweet.createdAt.seconds * 1000).format('YYYY년 MM월 DD일 hh시 mm분')}</span> */}
      {editing ? (
        <>
          { isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type='text'
                  value={editCweet}
                  placeholder='Edit your Cweet'
                  onChange={onChange}
                  required
                />
                <input type='submit' value="Update Cweet" />
              </form>
              <button onClick={toggleEditing}> Cancle </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{cweetObj.text}</h4>
            {cweetObj.attachmentUrl && (
              <img src={cweetObj.attachmentUrl} width='50px' height='50px' alt='images' />
            )}  
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Cweet</button>
              <button onClick={toggleEditing}>Edit Cweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cweet;