import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Autocomplete from 'react-google-autocomplete';
import firebaseConfig from '../../config.js';
import Firebase from 'firebase';
import { Button } from 'react-bootstrap';
import './Map.css';
import {chatService} from '../../chatService';

const mapStyle = [{
  "featureType": "administrative",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#d6e2e6"
    }
  ]
},
{
  "featureType": "administrative",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#cfd4d5"
    }
  ]
},
{
  "featureType": "administrative",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#7492a8"
    }
  ]
},
{
  "featureType": "administrative.neighborhood",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "lightness": 25
    }
  ]
},
{
  "featureType": "landscape.man_made",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#dde2e3"
    }
  ]
},
{
  "featureType": "landscape.man_made",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#cfd4d5"
    }
  ]
},
{
  "featureType": "landscape.natural",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#dde2e3"
    }
  ]
},
{
  "featureType": "landscape.natural",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#7492a8"
    }
  ]
},
{
  "featureType": "landscape.natural.terrain",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#dde2e3"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.icon",
  "stylers": [
    {
      "saturation": -100
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#588ca4"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#a9de83"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#bae6a1"
    }
  ]
},
{
  "featureType": "poi.sports_complex",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#c6e8b3"
    }
  ]
},
{
  "featureType": "poi.sports_complex",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#bae6a1"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.icon",
  "stylers": [
    {
      "saturation": -45
    },
    {
      "lightness": 10
    },
    {
      "visibility": "on"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#41626b"
    }
  ]
},
{
  "featureType": "road.arterial",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#ffffff"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#c1d1d6"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#a6b5bb"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "on"
    }
  ]
},
{
  "featureType": "road.highway.controlled_access",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#9fb6bd"
    }
  ]
},
{
  "featureType": "road.local",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#ffffff"
    }
  ]
},
{
  "featureType": "transit",
  "elementType": "labels.icon",
  "stylers": [
    {
      "saturation": -70
    }
  ]
},
{
  "featureType": "transit.line",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#b4cbd4"
    }
  ]
},
{
  "featureType": "transit.line",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#588ca4"
    }
  ]
},
{
  "featureType": "transit.station",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#008cb5"
    }
  ]
},
{
  "featureType": "transit.station.airport",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "saturation": -100
    },
    {
      "lightness": -5
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#a6cbe3"
    }
  ]
}
]

// const icon = {
//   url: "https://loc8tor.co.uk/wp-content/uploads/2015/08/stencil.png", // url
//   scaledSize: new this.props.google.maps.Size(90, 42), // scaled size
// };

const blue_icon = {
  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
}

const yellow_icon = {
  url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
}

let curr_lat = null;
let curr_lng = null;
let all_sos = [];


class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapPosition: {
        lat: null,
        lng: null
      },
      markPosition: {
        lat: null,
        lng: null
      },
      markers: [],
      isMarkerShown: true
    }

    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(
      success => this.setState({
        mapPosition: { lat: success.coords.latitude, lng: success.coords.longitude },
        markPosition: { lat: success.coords.latitude, lng: success.coords.longitude }
      })
    );

    curr_lat = parseFloat(this.state.mapPosition.lat);
    curr_lng = parseFloat(this.state.mapPosition.lng);

    this.getSOSData({'food': true, 'emotional': true, 'adhoc': true, 'name': ''});
    chatService.getList().subscribe(res => {
        this.getSOSData(res);
    })
  }

  getSOSData = (res) => {
    console.log(res);
    Firebase.database().ref("sos").on("value", snapshot => {
        let sos_markers = [];
        snapshot.forEach((snap) => {
            if ((snap.val().category == 'Food' && res.food) || 
                (snap.val().category == 'Emotional Support' && res.emotional) || 
                (snap.val().category == 'Others' && res.adhoc)) {
                    if(snap.val().name.toLowerCase().includes(res.name.toLowerCase())){
                        sos_markers.push(snap.val());
                    }
                    
            }
        });
        console.log("in map");
        console.log(sos_markers);
        this.setState({markers: sos_markers});
        console.log(this.state.markers);
        all_sos = sos_markers;
    });
  }

  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newlng = event.latLng.lng();
    this.setState({
      mapPosition: { lat: newLat, lng: newlng },
      markPosition: { lat: newLat, lng: newlng }
    })
    window.localStorage.setItem("lat", newLat);
    window.localStorage.setItem("lng", newlng);
  }

  onPlaceSelected = (place) => {
    console.log('plc', place);
    const latValue = place.geometry.location.lat(), lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      markPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      },
    })
  };

  setCurrentLocation = (event) => {
    window.navigator.geolocation.getCurrentPosition(
      success => this.setState({
        mapPosition: { lat: success.coords.latitude, lng: success.coords.longitude },
        markPosition: { lat: success.coords.latitude, lng: success.coords.longitude }
      })
    );
  }

  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultOptions={{ styles: mapStyle }}
        defaultCenter={this.state.mapPosition}
        defaultZoom={13}
      >
        <Autocomplete
          style={{
            position: 'absolute',
            width: '50%',
            height: '40px',
            borderRadius: '2px',
            border: '1px',
            paddingLeft: '9px',
            top: '10px',
            left: '10px'
          }}
          placeholder='Enter your location'
          onPlaceSelected={this.onPlaceSelected}
          types={['(regions)']}
        />

        <Marker position={this.state.markPosition}
          title="Drag Me"
          draggable={true}
          onDragEnd={this.onMarkerDragEnd} />

        {this.state.markers.map((m, i) => (
          m.category !== 'Emotional Support' ? (m.category === 'Food Supply' ? 
          <Marker key={i} options={{ icon: blue_icon}} key={i} position={{'lat': m.latitude, 'lng': m.longitude}}
          title={m.category}/>: <Marker options={{ icon: yellow_icon}} key={i} position={{'lat': m.latitude, 'lng': m.longitude}}
          title={m.category} />):null
        ))}

      </GoogleMap>
    ));
    return (
      [

      <i className="fa fa-map-marker set-marker-button" aria-hidden="true" onClick={this.setCurrentLocation}></i>,
      <div style={{width: '100%'}}>
        <GoogleMapExample
          containerElement={<div style={{ height: '70vh', marginTop: '0px', overflow: 'hidden' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
      </div>
      ]
    );
  }
}

export default Map;