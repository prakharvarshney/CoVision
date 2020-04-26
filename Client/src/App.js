import React, {useState, useEffect, useContext} from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
import hospitals from './hospital.geojson'
import {Nav, Navbar, Modal} from 'react-bootstrap'
import RegistrationModal from './Components/RegistrationModal/RegistrationModal'
import SearchForHospitalNames from './Components/SearchForHospitalNames/SearchForHostpitalNames'
import { ValidSessionContext } from './Context/ValidSessionContext';
import LoginModal from './Components/LoginForm/LoginModal'
import HospitalModal from "./Components/Modals/HospitalModal";

function App() {
  const [modalShow, setModalShow] = useState(false);
  const[loginModalShow, setLoginModalShow] = useState(false)
  const [hospitalList, setHospitalList] = useState(null)
  const [hospitalSearch, setHospitalSearch] = useState("")
  const [hospitalModal, setHospitalModal] = useState(false);
  const [userIsAuthenticated, setAuthenticated] = useState(null)
  const [didMount, setDidMount] = useState(false)
  const handleSearchChange = name => setHospitalSearch(name);
  const handleCloseHospitalModal = () => setHospitalModal(false);
  mapboxgl.accessToken = 'pk.eyJ1IjoiZm9nczk2IiwiYSI6ImNrODZscmx2ajA4MTUzam5oNmxqZWIwYTcifQ.YOo54ZuxuHWS2l-zvAsNYA';
  const getHospitalsEndpoint = "/api/register";
  const {userAuth} = useContext(ValidSessionContext)
  const getHospitaloptions = {
    method: "GET"
  }
  // Setting didMount to true upon mounting
  useEffect(() => setDidMount(true), [])

  useEffect(() => {

    async function isAuth() {
      const auth = await userAuth();
      setAuthenticated(auth)
      if (auth == true) {
        setHospitalModal(true);
      } else {
        setHospitalModal(false)
      }
    }
    // Execute the created function directly
    isAuth();
  },[loginModalShow])

  useEffect(() => {
    
    const fetchHospitals =  () => {
        fetch(getHospitalsEndpoint, getHospitaloptions)
        .then(result =>
          result.json()).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
          }).
        then(data => 
          {
            setHospitalList(data)
          })  
        };
        fetchHospitals();
},[])
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">U.S. Hospital Supply Inventory</Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"> 
            {!userIsAuthenticated  && (
            <Nav.Link onClick={() => setLoginModalShow(true)}>Login</Nav.Link>)}
          </Nav>
          {userIsAuthenticated   && (
              <SearchForHospitalNames value={hospitalSearch} setValue={(hospitalName) => {
                handleSearchChange(hospitalName);
                setHospitalModal(true);
              }} hospitalList={hospitalList} className="mr-sm-2" />
          )}
        </Navbar.Collapse>
      </Navbar>
      <div>
          <RegistrationModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            hospitalList={hospitalList}
            onOpenLogin
          />  
      </div>
      <div>
          <LoginModal
            show={loginModalShow}
            onHide={() => setLoginModalShow(false)}
            onOpenRegistrationModal={() => setModalShow(true)}  
          />  
      </div>
       <Map></Map>
       <div class='map-overlay' id='legend'></div>  
        <Modal className="modal-background" size="xl" show={hospitalModal} onHide={handleCloseHospitalModal}>
          <HospitalModal hospitalName={hospitalSearch}> </HospitalModal>
        </Modal>
    </div>
  );
}

class Map extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lng: -80.7959,
      lat: 41.3992 ,
      zoom: 3
    };
  }
  
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/fogs96/ck8dfn26y2vok1jr0wuxy9nhq',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    }
    );
    
    map.on('load', function() {

      var layers = ['0-5', '5-50', '50+'];
      var colors = ['#5CD65C', '#E2967E', '#E06941'];
      var legend = document.getElementById('legend')
      let legendTitle = document.createElement('h6');
      legendTitle.innerHTML = 'Predicted Cases'
      legend.appendChild(legendTitle)
      for (let i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var color = colors[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
      
        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      }
      const url = 'https://dev.aimee.bio/api/cases/predicted/geojson';
        window.setInterval(function() {
          map.getSource('newyork').setData(url);
        }, 100000);
        
        map.addSource('newyork', { type: 'geojson', data: url });
        map.addLayer({
          'id': 'newyork',
          'type': 'fill',
          'source': 'newyork',
          'paint': {
            'fill-color':
            ['case', ['<=', ['get', "cases"], 5], '#5CD65C',
                    ['<', ['get', "cases"], 50], '#E2967E',
                    ['>=', ['get', "cases"], 50], '#E06941', '#EAEAEA'],
            'fill-outline-color': '#bf502b',
            'fill-opacity': 0.5
          }
        });

  // When a click event occurs on a feature in the states layer, open a popup at the
  // location of the click, with description HTML from its properties.

      map.addSource('hospitals', {
        type: 'geojson',
        data: hospitals
      });

      map.addLayer({
      'id': 'hospital-point',
      'type': 'circle',
      'source': 'hospitals',
      'paint': {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': {
        'base': 1.75,
        'stops': [[4, 3], [6, 4], [7, 5], [8, 8], [10, 12], [12, 20], [15, 25], [18, 30]]
        },
        'circle-color': "#A71E15"
      }
      });
   
      map.on('click', function(e) {
        var ourMapLayers = map.queryRenderedFeatures(e.point, {
          layers: ['countypolygons-0l4xxe', 'newyork', 'hospital-point']
        });
        // console.log(ourMapLayers);
        const hospitalLayer = ourMapLayers.filter(layer => layer.source == "hospitals")[0];
        const newyorkLayer = ourMapLayers.filter(layer => layer.source == "newyork")[0];
        const countyLayer = ourMapLayers.filter(layer => layer.sourceLayer == "countyPolygons-0l4xxe")[0];

        if (hospitalLayer != null) {
          new mapboxgl.Popup()
          .setLngLat(hospitalLayer.geometry.coordinates)
          .setHTML('<h4>Hospital</h4><h6>' + hospitalLayer.properties.hospitalName + '</h6>' +
          '<h6>Bed Count: ' + hospitalLayer.properties.bedCount + '</h6>')
          .addTo(map);
        } else if (newyorkLayer != null && ourMapLayers.length > 1) {
          let theDate = newyorkLayer.properties.date.split('-');
          let predictDate = new Date(theDate[0], theDate[1]-1, theDate[2]);
          console.log(newyorkLayer.properties.date);
          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<h3>${countyLayer.properties.NAME}</h3>
                      <h5>${predictDate.toDateString()}</h5>
                      <h5>Predicted Cases: ${newyorkLayer.properties.cases}</h5>`)
          .addTo(map);
        } else if (ourMapLayers.length > 0) {
          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<h3>${countyLayer.properties.NAME}</h3>`)
          .addTo(map);
        }
      });

    });
    map.on('move', () => {
      this.setState({
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
        });
      });
  }
  render() {
      return (
        <div>
          <div ref={el => this.mapContainer = el} className="mapContainer" />
        </div>
      )
  }

}
export default App;
