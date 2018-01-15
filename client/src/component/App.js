import React, { Component } from 'react';
import { Popup } from "react-mapbox-gl";
import { Marker } from "react-mapbox-gl";
import axios from 'axios';

import Form from './form';
import Sidebar from './Sidebar'
import Hamburger from './Hamburger'

class App extends Component {
  constructor(props) {
    super(props)
    this.sendGetRequest = this.sendGetRequest.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.postComment = this.postComment.bind(this)
    this.toggleDropPin = this.toggleDropPin.bind(this)
    this.clickHamburger = this.clickHamburger.bind(this)

    this.state = {
      pins: [],
      comments: [],
      clickedMarker: { isClicked: false },
      isDropPin: { on: false },
      sidebar: false,
      hamburger: true
    }
  }

  componentWillMount() {
    this.sendGetRequest();
  }

  sendGetRequest() {
    let pinsArray = this.state.pins.slice()
    axios.get('/pins')
    .then((response) => {
      response.data.map((pin) => pinsArray.push(
        {lng: pin.longitude, lat: pin.latitude , _id: pin._id, comment: pin.comment, imageurl: pin.imageurl}
      ))
      this.setState({
        pins: pinsArray,
      })
      console.log(this.state.pins)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  postComment(evt){
    evt.preventDefault();
    var forminput = document.getElementById('comment').value
    axios.post('/pins/update', {
      comment: forminput,
      _id: this.state.clickedMarker._id
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
    this.sendGetRequest()
  }

  showPopup(lng, lat, comment, imageurl) {
    console.log(this.state.clickedMarker.comment)
    console.log(this.state.clickedMarker._id)
    return(
      <Popup
      coordinates={[lng, lat]}
      offset={{
        'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
      }}
    >
      <Form comment={comment} id={this.state.clickedMarker._id} imageurl={imageurl} />
    </Popup>
  )
  }

  handlePopupClick(pin) {
     this.sendGetRequest()
    this.setState({
      clickedMarker: {isClicked: true, lng: pin.lng, lat: pin.lat, _id: pin._id, comment: pin.comment, imageurl: pin.imageurl}
    })
  }

  renderMarker(pin,index){
    return (
      <Marker
        key={index}
        id={pin._id}
        coordinates={[pin.lng, pin.lat]}
        comment={pin.comment}
        onClick={() => this.handlePopupClick(pin)}
        anchor="bottom"
      >
        <img src={"1.png"} alt="pin" style={{"width": "60px"}}/>
      </Marker>
    )
  }

  handleClick(map, evt) {
    this.setState({
      clickedMarker: { isClicked: false }
    })
    if (this.state.isDropPin.on ) {
      this.toggleDropPin()
      axios.post('/pins/new', {
        longitude: evt.lngLat.lng,
        latitude: evt.lngLat.lat
      })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      });
      this.sendGetRequest()
    }
  }

  toggleDropPin() {
    let newDropPinStatus = this.state.isDropPin.on ? false : true;
    this.setState({
      isDropPin: { on: newDropPinStatus }
    });
  }

  clickHamburger(){
    if(this.state.hamburger === true){
      this.setState({
        sidebar: true,
        hamburger: false
      })
    }

    else {
      this.setState({
        sidebar: false,
        hamburger: true
      })
    }
  }

  render() {
    var sidebar = null

    if (this.state.sidebar) {
      sidebar = (
        <Sidebar clickHamburger={this.clickHamburger}/>
      )
    }

    var hamburger = null

    if (this.state.hamburger){
      hamburger = (
        <Hamburger clickHamburger={this.clickHamburger}/>
      )
    }

    const allPins = this.state.pins.map((pin, index) => {
      return this.renderMarker(pin, index)
    })
    return (
      <div>
        <button onClick={this.toggleDropPin} style={{position: "absolute", zIndex: 1000, top: 55, right: 80, backgroundColor: "white"}}>Toggle</button>
        {hamburger}
        {sidebar}

        <this.props.MapClass
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          onClick={this.handleClick}
        >
          {allPins}
          <this.props.GeocoderClass />
          {this.state.clickedMarker.isClicked ? this.showPopup(this.state.clickedMarker.lng,
                                                               this.state.clickedMarker.lat,
                                                               this.state.clickedMarker.comment,
                                                               this.state.clickedMarker.imageurl) : null}
        </this.props.MapClass>

      </div>
    )
  }
}

export default App;
