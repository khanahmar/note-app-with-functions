import React, { useState, useEffect } from "react"
import "./textarea.css"
import { db } from "../../firebase"
import {
  collection,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore"

export default function Textarea() {
  const notesCollection = collection(db, "Notes")
  const [headingValue, setHeadingValue] = useState("")
  const [textValue, setTextValue] = useState("")
  const [notes, setNotes] = useState("")

  // setHeadingValue(notes.filter((note) => note.data.active === true))

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
    <div className="textareaContainer">
      <input
        onChange={(e) => setHeadingValue(e.target.value)}
        value={headingValue}
        className="textareaHeader"
        type="text"
        placeholder="Title"
      />
      <textarea
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter Your Note"
        className="textarea"
      ></textarea>
    </div>
  )
}
