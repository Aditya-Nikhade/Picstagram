import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material'
import './post.css'
import db from './firebase';
import { Firestore, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';



export default function Post({ username, caption, imageURL, postId,user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [liked,setLiked] = useState(false);
    const [likes,setLikes] = useState(0);
    const [isUpdatingLike, setIsUpdatingLike] = useState(false);


    const postComment = (e) => {
        e.preventDefault();
        addDoc(collection(doc(collection(db,"Posts"),postId),"comments"),{
            text: comment,
            username: user.displayName,
            timestamp: serverTimestamp(Firestore.FieldValue)
        })

        setComment("")
        //reset the comment input
    }

    useEffect(() => {
        let unsubscribe;
        let unsubscribe2;
        const documentRef = doc(db, 'Posts', postId);
        if (postId) {
          unsubscribe = onSnapshot(query(collection(doc(collection(db, "Posts"), postId), "comments"),orderBy("timestamp","asc")), (snapshot) => {
            setComments(snapshot.docs.map((doc) => ({dox: (doc.data()),id: doc.id})));
          });
          unsubscribe2 = onSnapshot(documentRef, (snapshot) => {
            const data = snapshot.data();
            setLikes(data?.likes || 0);
          });
        }
        return () => {
          unsubscribe();
          unsubscribe2();
        }
      }, []);

      const handleLike = async () => {
        if (isUpdatingLike) return; // Ignore if like action is already being processed
      
        setIsUpdatingLike(true);
      
        const documentRef = doc(db, 'Posts', postId);
      
        try {
          await updateDoc(documentRef, {
            likes: liked ? likes - 1 : likes + 1
          });
      
          setLiked((prevLiked) => !prevLiked);
        } catch (error) {
          console.error('Error updating likes:', error);
        } finally {
          setIsUpdatingLike(false);
        }
      };
      
      

    return (
        <div className='post'>

            <div className="post_header">
                <Avatar style={{zIndex:"2"}}className='avatar' alt='AdiNikhade' src={user?.photoURL} />
                <h3>{username}</h3>

            </div>

            <img alt='' className='post_image' src={imageURL} />
            <div className='like_button'>
                {liked ? (<FontAwesomeIcon onClick={handleLike}
                icon={solidHeart} style={{color: "pink",padding:"8px", fontSize: "23px",cursor:"pointer"}}/>):(<FontAwesomeIcon
                icon={faHeart} onClick={handleLike} style={{color: "pink",padding:"8px", fontSize: "23px",cursor:"pointer"}}/>)}
                <span>{likes} likes</span>
            </div>
            <div className='text_post'><strong>{username}</strong><span>{caption}</span></div>
            <div className="post_comments">
                {
                    comments.map(({dox,id}) => {
                        return (
                            <p key={id}>
                                <strong>{dox.username}</strong><span>{dox.text}</span>
                            </p>)
                    })
                }
            </div>

            {user && <form className='comments'>
                <input className='postInput' type='text' placeholder='Add Comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button disabled={!comment} className='postButton' onClick={postComment} type='submit'>Post</button>
            </form>}
            
        </div>
    )
}
