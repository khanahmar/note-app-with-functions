import React, { useState, useEffect } from "react"
import "./textarea.css"
import { db } from "../../firebase"
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore"

export default function Textarea() {
  const notesCollection = collection(db, "Notes")
  const [headingValue, setHeadingValue] = useState("")
  const [textValue, setTextValue] = useState("")
  const [notes, setNotes] = useState([])

  function updateHeading(e) {
    setHeadingValue(e.target.value)
    notes.forEach(async (note) => {
      if (note.data.active) {
        await updateDoc(doc(db, "Notes", note.id), { heading: headingValue })
      }
    })
  }


  function updateText(e) {
    setTextValue(e.target.value)
    notes.forEach(async (note) => {
      if (note.data.active) {
        await updateDoc(doc(db, "Notes", note.id), { text: textValue })
      }
    })
  }

  useEffect(() => {
    notes.forEach((note) => {
      if (note.data.active === true) {
        setHeadingValue(note.data.heading)
        setTextValue(note.data.text)
      }
    })
  }, [notes])

  useEffect(() => {
    onSnapshot(notesCollection, (snapshot) => {
      setNotes(
        snapshot.docs.map((doc) => {
          return { data: doc.data(), id: doc.id }
        })
      )
    })
  }, [])

  return (
    <div className="textareaContainer">
      <input
        onChange={(e) => updateHeading(e)}
        value={headingValue}
        className="textareaHeader"
        type="text"
        placeholder="Title"
      />
      <textarea
        onChange={(e) => updateText(e)}
        value={textValue}
        placeholder="Enter Your Note"
        className="textarea"
      ></textarea>
    </div>
  )
}
