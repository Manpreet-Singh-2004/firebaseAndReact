import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import {db, auth} from './config/firebase';
import {getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore'

function App() {
  const [movieList, setMovieList] = useState([]);
  
  // New Movie state
  const [newMovieTitle, setNewMovieTitle] = useState("")
  const [newMovieRelease, setMovieRelease] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)
  const [updatedTitle, setUpdatedTitle] = useState("")

  const [error, SetError] = useState("");

  const movieCollection = collection(db, "movies")

  const getMovieList = async()=>{
    try {
      const data = await getDocs(movieCollection)
      const filteredData = data.docs.map((doc) =>({...doc.data(), id: doc.id}))
      setMovieList(filteredData)
    } 
    catch (error) {
      console.log(error)
  }}

  const deleteMovie = async(id) =>{
    try {
      const movieDoc = doc(db, "movies", id)
      await deleteDoc(movieDoc)
      getMovieList()
    } catch (error) {
      console.log(error)
      SetError(error.message)
    }
  }

  const updateMovieTitle = async(id) =>{
    try {
      const movieDoc = doc(db, "movies", id)
      await updateDoc(movieDoc, {title: updatedTitle})
      getMovieList()
    } catch (error) {
      console.log(error)
      SetError(error.message)
    }
  }

  useEffect(() =>{
    getMovieList()
  }, [])

  const onSubmitMovie = async() =>{
    try {
          await addDoc(movieCollection, {
            title: newMovieTitle, 
            releaseDate: newMovieRelease, 
            recievedAnOscar: isNewMovieOscar,
            userId: auth?.currentUser?.uid
          })
          getMovieList()
    } catch (error) {
      console.log(error)
      SetError(error.message)
    }
  }

  return <div className='App'>
    <Auth />

  {error && <h2 style={{ color: "red" }}>{error}</h2>}

  <div> 
    <input placeholder='Movie Title' onChange={(e) => setNewMovieTitle(e.target.value)} />
    <input placeholder='Release Date' type='number' onChange={(e) => setMovieRelease(Number(e.target.value))} />
    <input type='checkbox' checked = {isNewMovieOscar} onChange={(e) => setIsNewMovieOscar(e.target.checked)}/>
    <label>
      Recieved an Oscar
    </label>

    <button onClick={onSubmitMovie} > Submit </button>

  </div>

  <div>
    {movieList.map((movie)=>(
      <div>
        <h1 style={{color: movie.recievedAnOscar ? "green" : "red"}} > {movie.title} </h1>
        <p>Date: {movie.releaseDate}</p>
        <button onClick={() => deleteMovie(movie.id)}> Delete Movie </button>

      <input placeholder='New Title' onChange={(e) => setUpdatedTitle(e.target.value)} />
      <button onClick={() => updateMovieTitle(movie.id)}> Update Title </button>
      </div>
    ))}
  </div>
  </div>
}

export default App;


