import React, { Component } from 'react';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props)
    this.postComment = this.postComment.bind(this)
    this.dateConverter = this.dateConverter.bind(this)

    this.state = {
      placeValidation: '',
      memoryValidation: '',
      fileValidation: false
    }
  }

  componentWillReceiveProps(newProps){
    console.log(newProps.pin)
    this.setState({
      place: newProps.pin.place,
      memory: newProps.pin.memory,
      _id: newProps.pin._id,
      imageurl: newProps.pin.imageurl,
      date: this.dateConverter(this.props.pin.date)
    })
  }

  componentWillMount() {
    console.log(this.props.pin)
    console.log(this.props.pin.date)
    this.setState({
      place: this.props.pin.place,
      memory: this.props.pin.memory,
      _id: this.props.pin._id,
      imageurl: this.props.pin.imageurl,
      date: this.dateConverter(this.props.pin.date)
    })
  }

  dateConverter(date){
    var dateone = date.split("T")[0]
    return dateone.split("-").reverse().join("-")
  }

  postComment(evt) {
    evt.preventDefault();
    var formData = new FormData()
    var image = document.getElementById('image')
    console.log(image.files[0])
    var imageurl = image.files[0].name
    var placeInput = document.getElementById('place').value
    var memoryInput = document.getElementById('memory').value
    console.log(imageurl)
    formData.append('image', image.files[0])
    formData.append('place', placeInput)
    formData.append('memory', memoryInput)
    formData.append('_id', this.state._id)
    formData.append('imageurl', imageurl)

    axios.post('pins/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    });
    this.setState({
      place: placeInput,
    })
    console.log("HERE", this.state)
  }

  handlePlaceChange = (evt) => {
    this.setState ({ placeValidation: evt.target.value })
  }

  handleMemoryChange = (evt) => {
    this.setState ({memoryValidation: evt.target.value})
  }

  handleFileUpload = (evt) => {
    console.log(evt.target.files[0])
    if(evt.target.files.length === 1) {
      this.setState ({fileValidation: true})
    }
    console.log(this.state.fileValidation)
  }

  handleSubmit = (evt) => {
    console.log(this.state.placeValidation.length)
    console.log(this.state.memoryValidation.length)
    if((this.state.placeValidation.length < 1) || (this.state.memoryValidation.length < 1) || (!this.state.fileValidation)){
      return true
    } else {
      return false
    }
  }

  render() {
    const Placeresult = this.handleSubmit();

    var placeMessage = null

    if(this.state.placeValidation.length < 1) {
      placeMessage = (
        <h1>Please enter a Place</h1>
      )
    }

    var memoryMessage = null
    if (this.state.memoryValidation.length < 1) {
      memoryMessage = (
        <h1>Please enter a Memory</h1>
      )
    }

    let content;
    if (this.state.place) {
      content = (
        <div>
          <img src={this.state.imageurl} alt="Image Uploaded" style={{"width": "150px"}}/>
          <h1>Place: {this.state.place}</h1>
          <h2>Title: {this.state.memory}</h2>
          <h5>Day: {this.state.date}</h5>
        </div>
      )
    } else {
      content = (
        <form id="form" encType="multipart/form-data">
          <input id="place" type="text" name="place" placeholder="Place" onChange={this.handlePlaceChange}></input>
          {placeMessage}
          <input id="memory" type="text" name="memory" placeholder="Memory" onChange={this.handleMemoryChange}></input>
          {memoryMessage}
          <input id="image" type="file" name="image" onChange={this.handleFileUpload}></input>
          <button disabled={Placeresult} onClick={this.postComment} type="submit">"Click Me"</button>
        </form>
      )
    }

    return (
      <div>
        {content}
        <button onClick={this.props.deletePin}>Delete Pin</button>
      </div>
    )
  }

}
export default Form;
