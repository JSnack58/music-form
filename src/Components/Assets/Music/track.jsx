import React, { Component } from 'react'
import './track.css'
export default class Track extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td>{this.props.artist}</td>
        <td>{this.props.label}</td>
        <td>{this.props.genre}</td>
        <td>{this.props.bpm}</td>
        <td>{this.props.year}</td>
      </tr>
    )
  }
}
