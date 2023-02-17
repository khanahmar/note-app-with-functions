import React, { useEffect, useState } from "react"
import "./list.css"
import { db } from "../../firebase"
import {
  collection,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore"

export default function List() {
  const notesCollection = collection(db, "Notes")
  const [notes, setNotes] = useState([])

  async function changeActive(id) {
    const document = doc(db, "Note", id)
    await updateDoc(document, { ...note, active: true })
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      setNotes(
        snapshot.docs.map((doc) => {
          return { data: doc.data(), id: doc.id }
        })
      )
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="list">
      <div className="listBtn">
        <button>Add a Note</button>
      </div>
      <div className="listItems">
        {notes.map((note) => {
          return (
            <p onClick={() => changeActive(note.id)} key={note.id}>
              {note.data.heading}
              <i className="fa-sharp fa-solid fa-trash"></i>
            </p>
          )
        })}
      </div>
    </div>
  )
}
