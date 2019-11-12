import React from 'react'
import Layout from '../components/layout'
import GoogleMapReact from 'google-map-react'
import { Alert } from 'react-bootstrap'
import events, { position } from '../events'
import Icon from '../components/icon'

const config = require('../jinlile.config')

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            center: { lat: 40.7448501, lng: -74.027187 },
            defaultCenter: { lat: 40.7448501, lng: -74.027187 },
            alert: { show: false, content: '' },
            markers: [],
        }
    }

    setCenter(center) {
        this.setState({
            ...this.state,
            center
        })
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
        setTimeout(() => this.watchMarkers(), 6000)
    }
    
    async getMarkers(zoom=14) {
        let myself = (
            <Icon
                name="You"
                lat={this.state.center.lat}
                lng={this.state.center.lng}
                key="You"
                zoom={14}
            ></Icon>
        )
        let markers = [myself]
        for (let f of await this.getFriendsPosition()) {
            markers.push(
                <Icon
                    name={f.name}
                    lat={f.lat}
                    lng={f.lng}
                    key={f.name}
                    zoom={14}
                ></Icon>
            )
        }
        this.setState({
            ...this.state,
            markers
        })
    }
    
    render() {
        return (
            <Layout>
                <small className="text-muted">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></small>
                <Alert
                    dismissible
                    show={this.state.alert.show}
                    onClose={ () => this.setState({ ...this.state, alert: {show: false, content: ''} }) }
                    variant="danger">
                    Test
                </Alert>
                <div id="map-container">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: config.google_map_api_key }}
                        defaultZoom={14}
                        defaultCenter={this.state.defaultCenter}
                        center={this.state.center}
                        onDragEnd={this.handleDrapEnd.bind(this)}
                    >
                        {this.state.markers}
                    </GoogleMapReact>
                </div>
                <style jsx>{`
                    #map-container {
                        top: 0;
                        left: 0;
                        position: fixed;
                        height: 100%;
                        width: 100%;
                        z-index: -999;
                    }
                `}</style>
            </Layout>
        )
    }
}

export default Map