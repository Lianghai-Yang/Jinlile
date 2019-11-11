import React from 'react'
import Layout from '../components/layout'
import GoogleMapReact from 'google-map-react'

const config = require('../jinlile.config')

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            center: { lat: 40.7448501, lng: -74.027187 }
        }
    }
    
    componentDidMount() {
        if ('geolocation' in navigator == false) {
            console.log('Browser Does Not Support Location')
            return
        }
        
    }
    
    render() {        
        return (
            <Layout>
                <div>Hiking Group</div>
                <div id="map-container">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: config.google_map_api_key }}
                        defaultZoom={15}
                        defaultCenter={this.state.center}
                    >
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