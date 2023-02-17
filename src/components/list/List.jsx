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

  function changeActive(id) {
    const document = doc(db, "Notes", id)
    notes.forEach(async (note) => {
      if (note.id === id) {
        await updateDoc(document, { active: true, currentId: note.id })
      } else {
        const document = doc(db, "Notes", note.id)
        await updateDoc(document, { active: false, currentId: note.id })
      }
    })
  }

  async function addNote() {
    await addDoc(notesCollection, {
      heading: "New note",
      text: "",
      active: false,
    })
  }

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "Notes", id))
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
  }, [notesCollection])

  return (
    <div className="list">
      <div className="listBtn">
        <button onClick={addNote}>Add a Note</button>
      </div>
      <div className="listItems">
        {notes.map((note) => {
          return (
            <p onClick={() => changeActive(note.id)} key={note.id}>
              {note.data.heading}
              <i
                onClick={() => deleteNote(note.id)}
                className="fa-sharp fa-solid fa-trash"
              ></i>
            </p>
          )
        })}
      </div>
    </div>
  )
}
