import React from 'react'
import Table from 'react-bootstrap/Table'
import Track from './track';


export default function Tracks(props) {
    return (
      <Table striped border hover size='sm'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Label</th>
            <th>Genre</th>
            <th>BPM</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <>
            {
              props.songs.map((song) => {
                return (
                  <Track title={song.title}
                    artist={song.artist}
                    label={song.label}
                    genre={song.genre}
                    bpm={song.bpm} 
                    year={song.year}/>
                )
              })
            }
          </>
        </tbody>
      </Table>
    )
  }
