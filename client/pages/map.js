import React from 'react'
import Layout from '../components/layout'
import GoogleMapReact from 'google-map-react'
import { Alert, Button } from 'react-bootstrap'
import events, { position } from '../events'
import Marker from '../components/marker'
import Spinner from 'react-bootstrap/Spinner'
import { FaBars, FaComments, FaPaperPlane } from 'react-icons/fa'
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import Toast from 'react-bootstrap/Toast'
import { withRouter } from 'next/router'
import Icon from '../components/icon'
import config from '../jinlile.client.config'

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.watching = true
        this.state = {
            center: { lat: 40.7448501, lng: -74.027187 },
            defaultCenter: null,
            // defaultCenter: { lat: 40.7448501, lng: -74.027187 },
            alert: { show: false, content: '' },
            markers: [],
            loading: true,
            toast: {
                msg: '',
                from: '',
                time: '',
                show: false,
            },
        }
    }

    setCenter(center) {
        if (this.watching == false) return
        this.setState({
            center
        })
    }

    componentWillUnmount() {
        this.watching = false
        events.removeAllListeners('position', () => console.log('removed all position'))
    }
    
    async componentDidMount() {
        // check geolocation is available
        if ('geolocation' in navigator == false) {
            let errMsg = 'Browser Does Not Support Location'
            console.log(errMsg)
            this.setState({
                ...this.state,
                alert: { show: true, content: errMsg }
            })
            return
        }

        let center = await position.getCurrentPosition()
        // Set the map to current location
        this.setCenter(center)
        this.setState({
            defaultCenter: center
        })
        events.on('position', position => {
            this.setCenter(position)
        })

        this.watchMarkers()
    }

    handleDrapEnd(map) {
        // this.setCenter({ lat: map.center.lat(), lng: map.center.lng() })
    }

    async getFriendsPosition() {
        return [
            { name: 'Alice', lat: 40.7438877, lng: -74.0339645 },
            { name: 'Eric', lat: 40.747139, lng: -74.0306601 },
            { name: 'Amy', lat: 40.7335799, lng: -74.0345654 },
        ]
    }

    async watchMarkers() {
        await this.getMarkers()
        if (this.watching == false) return
        setTimeout(() => this.watchMarkers(), 3000)
    }
    
    async getMarkers(zoom=14) {
        let myself = (
            <Marker
                name="You"
                iconIndex={this.simpleHash("You")}
                lat={this.state.center.lat}
                lng={this.state.center.lng}
                key="You"
                zoom={14}
            ></Marker>
        )
        let markers = [myself]
        for (let f of await this.getFriendsPosition()) {
            markers.push(
                <Marker
                    name={f.name}
                    iconIndex={this.simpleHash(f.name)}
                    lat={f.lat}
                    lng={f.lng}
                    key={f.name}
                    zoom={14}
                ></Marker>
            )
        }
        if (this.watching == false) return
        this.setState({
            ...this.state,
            markers
        })
    }

    simpleHash(name='') {
        let sum = 0;
        for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i)
        }
        return sum % 50 + 1
    }
    
    setLoading(loading) {
        this.setState({
            // ...this.state,
            loading
        })
    }

    sideIconRight() {
        return (
          <FaBars color="#007bff" size="1.5rem" onClick={() => alert('testing')} className="flex-grow-0" />
        )
    }

    sideIconleft() {
        let { router } = this.props
        return (
            <FaComments color="#007bff" size="1.5rem" onClick={() => window.location.href='/chat'} className="flex-grow-0" />
        )
    }

    sendMessage() {
        let input = document.getElementById('message-input')
        let msg = input.value
        this.showToast({ msg, from: 'You', time: 'Now' })
        input.value = ""
    }

    toast() {
        let { show, time, msg, from } = this.state.toast
        let newToastState = {
            ...this.state.toast,
            show: false
        }
        return (
            <>
            <Toast className="mt-3 align-self-center" style={{ display: show ? 'block' : 'none', zIndex: 1, width: '300px' }} show={show} onClose={() => this.setState({ ...this.state, toast: newToastState })}>
                <Toast.Header>
                    <Icon name={from} className="rounded mr-2" style={{ width: '20px', height: '20px' }} />
                    <strong className="mr-auto">{from}</strong>
                    <small>{time}</small>
                </Toast.Header>
                <Toast.Body style={{ wordBreak: 'break-word' }}>{msg}</Toast.Body>
            </Toast>
            </>
        )
    }

    showToast({ msg, from, time, show=true}) {
        this.setState({
            ...this.state,
            toast: {
                msg,
                from,
                time,
                show
            }
        })
    }
    
    render() {
        return (
            <Layout sideIconRight={this.sideIconRight.bind(this)} sideIconLeft={this.sideIconleft.bind(this)}>
                <div id="spinner">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
                <small style={{ zIndex: 1 }} className="text-muted">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></small>
                <Alert
                    dismissible
                    show={this.state.alert.show}
                    onClose={ () => this.setState({ alert: {show: false, content: ''} }) }
                    style={{ zIndex: 1 }}
                    variant="danger">
                    Test
                </Alert>
                {this.toast()}
                {(this.state.defaultCenter != null) 
                ?
                <div id="map-container">
                    <GoogleMapReact
                        onGoogleApiLoaded={this.setLoading.bind(this, false)}
                        bootstrapURLKeys={{ key: config.google_map_api_key }}
                        yesIWantToUseGoogleMapApiInternals={true}
                        defaultZoom={14}
                        options={{zoomControl:false}}
                        defaultCenter={this.state.defaultCenter}
                        // center={this.state.center}
                        onDragEnd={this.handleDrapEnd.bind(this)}
                    >
                        {this.state.markers}
                    </GoogleMapReact>
                    <div className="container" id="message-input-container">
                        <InputGroup>
                            <Form.Control id="message-input" size="lg" placeholder="Message..."></Form.Control>
                            <InputGroup.Append>
                                <Button as="div" onClick={this.sendMessage.bind(this)} variant="primary">
                                    <FaPaperPlane style={{width: '2rem', fontSize: '1.3rem'}} />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div> : ''
                }
                <style jsx>{`
                    #map-container {
                        top: 0;
                        left: 0;
                        position: fixed;
                        height: 100%;
                        width: 100%;
                        z-index: 0;
                    }
                    #message-input-container {
                        position: relative;
                        bottom: 13%;
                    }
                    #spinner {
                        position: fixed;
                        width: 100%;
                        height: 100%;
                        display: ${this.state.loading == true ? 'flex' : 'none'};
                        justify-content: center;
                        align-items: center;
                        left: 0;
                        top: 0;
                    }
                `}</style>
            </Layout>
        )
    }
}

export default withRouter(Map)