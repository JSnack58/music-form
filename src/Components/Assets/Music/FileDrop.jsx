import React, { Component } from 'react'
import { FileUploader } from 'react-drag-drop-files'

export default class FileDrop extends Component {
  render() {
    return (
      <div>
         <FileUploader handleChange={this.props.handleChange} name="file" types={["JPG"]} />
      </div>
    )
  }
}
