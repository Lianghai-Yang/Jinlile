import axios from 'axios'

const config = {
    google_map_api_key: 'api_key',
    api_base_url: 'http://localhost:4000',
    socketio_url: 'http://localhost:8800',
}

axios.defaults.baseURL = config.api_base_url
axios.defaults.withCredentials = true

export default config