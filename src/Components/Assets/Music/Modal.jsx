import React from 'react'
import ReactDom from 'react-dom'
import Table from 'react-bootstrap/esm/Table'
const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-20%, -50%)',
    backgroundColor: '#FFE',
    padding: '20px',
    zIndex: 1000
}
const OVERLAY_SYTLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}
function DuplicatesList({ duplicates }) {
    return (

        <Table striped border hover size='sm'>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                <>
                    {
                        duplicates.map((song) => {
                            return (
                                <tr>
                                    <td>{song.title}</td>
                                    <td>{song.artist}</td>
                                    <td>{song.year}</td>
                                </tr>
                            )
                        })
                    }
                </>
            </tbody>
        </Table>
    )

}
export default function Modal({ open, onClose, duplicates }) {
    if (!open) return null
    return ReactDom.createPortal(
        <>
            <div style={OVERLAY_SYTLES} />
            <div style={MODAL_STYLES}>
                <p> The following Tracks are already in the database: </p>
                <DuplicatesList duplicates={duplicates} />
                <p> Would you like to remove or overwrite them? </p>
                <button onClick={onClose}>Remove</button>
                <button onClick={onClose}>Overwrite</button>
            </div>
        </>,
        document.getElementById('portal')
    )
}
