import { useState } from 'react';
import {auth, googleProvider} from '../config/firebase';
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';

export const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, SetError] = useState("");

    // console.log(auth?.currentUser?.email) // Used to console log the current user
    // console.log(auth?.currentUser?.photoURL) // Used to console log the current user

    const signIn = async() =>{
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            SetError("")

        } catch(e){
            console.log(e)
            SetError(e.message)
        }
    };

    const signInWithGoogle = async() =>{
        try{
            await signInWithPopup(auth, googleProvider);
            SetError("")
        }catch(e){
            console.log(e)
            SetError(e.message)
                console.log(auth?.currentUser?.email) // Used to console log the current user
                console.log(auth?.currentUser?.photoURL) // Used to console log the current user
        }
    }

    const logout = async() =>{
        try{
            const signedOutUser = auth?.currentUser?.email
            await signOut(auth)
            console.log(`${signedOutUser} User Logged out Successfully`)
        }catch(e){
            console.log(e)
            SetError(e.message)
        }
    }

    return (
    <div>
        <input placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)}
         />

        <input placeholder="Password" 
        type='password'
        onChange={(e) => setPassword(e.target.value)} 
        />

        <button onClick={signIn}>Sign in</button>

        <button onClick={signInWithGoogle}>Sign in with google</button>

        <button onClick={logout}>Logout</button>

        {error && <h2 style={{ color: "red" }}>{error}</h2>}

        <h1>Welcome {auth?.currentUser?.email}</h1>

    </div>
)}


// Rules for firestore database | Anyone can delete anything
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      
      allow read: if true;

      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null;
    }
  }
}
*/