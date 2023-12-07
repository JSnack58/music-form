import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './music_form.css'
import React, { useReducer, useState } from 'react'
import Tracks from './tracks'
import TextInputs from './TextInputs'
import Modal from './Modal'

export default function MusicForm() {
  // States representing the form variables to be saved.
  const [title, setTitle] = useState(null)
  const [artist, setArtist] = useState(null)
  const [label, setLabel] = useState(null)
  const [genre, setGenre] = useState(null)
  const [bpm, setBpm] = useState(null)
  const [year, setYear] = useState(null)
  // Holds all the songs to be displayed on the table, and to be submitted.
  const [tracks, setTracks] = useState([])
  // The state to open/close the duplicates pop-up window.
  const [isOpenDuplicate, setisOpenDuplcate] = useState(false)

  // Holds the text input name and function for TextInput function in rendering.
  let text_inputs = [
    { name: "title", func: (e) => { setTitle(e.target.value) } },
    { name: "artist", func: (e) => { setArtist(e.target.value) } },
    { name: "bpm", func: (e) => { setBpm(e.target.value) } },
    { name: "year", func: (e) => { setYear(e.target.value) } },
  ]
  // Resets all values in the form.
  function reset() {
    setTitle(null)
    setArtist(null)
    setLabel(null)
    setGenre(null)
    setBpm(null)
    setYear(null)
  }

  // Sned a POST  request contiaining song files to the server to read ID3 tags and return the songs.
  // Once songs are retured the're added into the 'tracks' state.
  function readFiles(e) {
    var formData = new FormData()
    Array.prototype.forEach.call(e.target.files, file => {
      formData.append(`${file.name}`, file, `${file.name}`)
    })
    fetch('http://localhost:5000/read_file', {
      method: 'POST',
      body: formData
    }
    ).then(res => res.json()
    ).then((data) => {
      const new_tracks = data["tracks"]
      setTracks([...tracks, ...new_tracks])

    })

  }
  // Creates a Song object and places into 'tracks'.
  function save() {
    let song = {
      "title": title,
      "artist": artist,
      "label": label,
      "genre": genre,
      "bpm": bpm,
      "year": year
    }
    setTracks([...tracks, song])
    reset()
  }

  // Send a POST request containing form-data to the database for storage given its unique, 
  // else it will be skipped returned in the response for the client to remove or overwrite.
  function publish() {
    let json = { "music": [...tracks] }
    console.log(json)
    fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    }
    ).then(res => res.json()
    .then((data) => {
      const duplicates = data["duplicates"]
      console.log("found duplicates: ", duplicates)
      if(duplicates.length > 0){
        setisOpenDuplcate(true)
        setTracks([...duplicates])
      }
      else{
        setTracks([])
      }
    })
    )
  }
  return (
    <div>
      <div className='Tracks_container'>
        <Tracks songs={tracks} />
      </div>
      <Form encType='multipart/form-data'>
        <div className='text_inputs'>
          <TextInputs NameSettersMap={text_inputs} />
        </div>

        <div className='Label'>
          <Form.Group className="mb-3" controlId="formPreviewCheckbox">
            <Form.Check type="checkbox" id="default-checkbox" label="Preview" />
          </Form.Group>
        </div>

        <div className='Selects'>

          <div className='Label'>
            <Form.Label>Label</Form.Label>
            <div className='Genre_drop'>
              <Form.Select required aria-label="Default select example" onChange={(event) => { setLabel(event.target.value) }}>
                <option></option>
                <option value="Alantic Records1">Atlantic Records</option>
                <option value="Alantic Records2">Atlantic Records2</option>
                <option value="Alantic Records3">Atlantic Records3</option>
              </Form.Select>
            </div>
          </div>

          <div className='Genres'>

            <Form.Label>Genre</Form.Label>
            <div className='Genre_drop' id='genre_1'>
              <Form.Select aria-label="Default select example" onChange={(e) => { setGenre(e.target.value) }}>
                <option></option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Rap">Rap</option>
                <option value="Electro">Electro</option>
              </Form.Select>
            </div>
          </div>

        </div>
        <div className='Buttons'>
          <div className='child-button' id='Save'>
            <Button variant="primary" type="reset" onClick={() => { save() }}>
              Save File
            </Button>

          </div>
          <div className='child-button' id='Load'>
            <Button variant="primary" type="button">
              Load
            </Button>

          </div>
          <div className='child-button' id='Prepare'>
            <Button variant="primary" type="button">
              Prepare
            </Button>

          </div>
          <div className='child-button' id='Mail'>
            <Form.Group className="mb-3" controlId="formMailCheckbox">
              <Form.Check type="checkbox" id="default-checkbox2" label="Mail" />
            </Form.Group>

          </div>
          <div className='child-button' id='Publish'>
            <Button variant="primary" type="button" onClick={() => { publish() }}>
              Publish
            </Button>
          </div>
        </div>
        <div>
          <Form.Label>MP3 file input</Form.Label>
          <Form.Control type="file" name="songs" accept='.MP3' formEncType='multipart/form-data' multiple onChange={(e) => { readFiles(e) }}></Form.Control>
        </div>
      </Form>
      <button onClick={()=>setisOpenDuplcate(true)}>popup</button>
      <Modal open={isOpenDuplicate} onClose={()=>{setisOpenDuplcate(false)
      setTracks([])}} duplicates={tracks}></Modal>

    </div>
  )
}
