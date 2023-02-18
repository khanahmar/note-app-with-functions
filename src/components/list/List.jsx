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

export default function List({ data }) {
  const notesCollection = collection(db, "Notes")
  const [notes, setNotes] = useState([])
  const [arrandedNotes, setArrangedNotes] = useState([])
  const [currentId, setCurrentId] = useState("")

  function changeActive(id) {
    setCurrentId(id)
    data(id)
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

  function arrangeData() {
    setArrangedNotes((prevNote) =>
      prevNote.sort((a, b) => {
        if (a.id === currentId) {
          return -1
        } else if (b.id === currentId) {
          return 1
        } else {
          return 0
        }
      })
    )
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
    arrangeData()

    return () => {
      unsubscribe()
    }
  }, [currentId])

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
