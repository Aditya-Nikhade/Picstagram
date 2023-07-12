import { useEffect, useRef, useState } from 'react';
import './App.css';
import Post from './Post';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import db, { auth } from './firebase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import UploadImage from './UploadImage';
import picture from './Images/picstagram-high-resolution-logo-white-on-transparent-background.png' 


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: "80%",
  backgroundColor: 'background.paper',
  border: 'none', // Remove border
  borderRadius: 6, // Set border-radius
  boxShadow: 24,
  p: 4,
};


export default function App() {

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false) 
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [showUpload,setShowUpload] = useState(false)
  const bottomRef = useRef(null);
  
  const handledUpload = () => {
    setShowUpload((prev) => !prev);
  };
  
  useEffect(() => {
    if (showUpload) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showUpload]);
  
  //displays the posts 
  useEffect(() => {
    onSnapshot( query( collection(db, "Posts"), orderBy("timestamp","asc")), (snapshot) => {
      setPosts(snapshot.docs.map((dox) => ({ id: dox.id, post: dox.data() })))
    })
  }, [])

  //all the authentication stuff
  useEffect(() => {
    //helps survive refresh//keeps you logged in when you refresh
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      if (currUser) {
        // User is signed in
        console.log('User is signed in:', currUser);
        setUser(currUser)
      }
      else {
        // User is signed out
        console.log('User is signed out');
        setUser(null)
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [user, username]);
  const signUp = async (e) => {
    e.preventDefault();
    try {
      let a = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(a.user, {
        displayName: username
      }) 
      console.log(a);
      console.log("User created successfully!");
    } catch (err) {
      alert(err.message)
      console.log("There is a error")
    }
    setEmail("");
    setPassword("");
    setUsername("");
    setOpen(false)
  }; 
  const signIn = async(e)=>{
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth,email,password)
        setOpenSignIn(false)
      } catch (error) {
         console.log(error);
         alert("Incorrect information provided");
      }
      setEmail("");
      setPassword("");
  }

  useEffect(() => {
    // Add or remove 'no-scrollbar' class based on isLoggedIn value
    if (user) {
      document.body.classList.remove('no-scrollbar');
    } else {
      document.body.classList.add('no-scrollbar');
    }
  }, [user]);

  return (

    <div className="App">

      {/* SignIn and SignUp options */}
      <div>
        <Modal open={open} onClose={() => setOpen(false)}>

          <Box sx={style}>
            <form className='signup'>
              <img id='header_logo' src={picture} alt='' />
              <input type='text' value={username} placeholder='username' onChange={(e) => { setUsername(e.target.value) }} />
              <input type='text' value={email} placeholder='email' onChange={(e) => { setEmail(e.target.value) }} />
              <input type='text' value={password} placeholder='password' onChange={(e) => { setPassword(e.target.value) }} />
              <button id='signup'onClick={signUp}>Sign Up</button>
            </form>
          </Box>

        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>

          <Box sx={style}>
            <form className='signup'>
              <img id='header_logo' src={picture} alt='' />
              <input type='text' value={email} placeholder='email' onChange={(e) => { setEmail(e.target.value) }} />
              <input type='text' value={password} placeholder='password' onChange={(e) => { setPassword(e.target.value) }} />
              <button id='signin' onClick={signIn}>Sign In</button>
            </form>
          </Box>

        </Modal>
      </div>
      

      <div className='flexi'>
        <div className='left-section'>
        <div className="header">
          <img className='header_logo' src={picture} alt='' />
          <div className='buttons_header'>
            {user && <Button onClick={()=>{setShowUpload((prev)=>(!prev))}}>Upload</Button>}
            {user ? (<Button className='click' onClick={() => (signOut(auth))}>Logout</Button>) : (
              <div className="button_container">
                <Button className="click" onClick={()=>(setOpenSignIn(true))}>Sign In</Button>
                <Button className="click" onClick={()=>(setOpen(true))}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
          {(user) ? (<div className='right'>
            <div className='insta_posts'>
            {
              posts.map(({ id, post }) => {
                return (
                  <Post key={id} postId={id} username={post?.username} caption={post?.caption} imageURL={post?.imageURL} user={user}/>
                )
              })
            }
            </div>
            
            <div className='upload_image_user'>
              {user && showUpload && (<UploadImage username={user.displayName} handledUpload={handledUpload}/>)}
            </div>
            <div ref={bottomRef} />

          </div>):(<div className="login-message">
                  <div className= "display_message ">
                    LOGIN TO ENJOY PICSTAGRAM
                    </div>
                  </div>
          )}

      </div> 
    </div>
  );
}