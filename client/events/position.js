import event from './index'
import axios from 'axios'
import { debounce } from 'throttle-debounce'

const interval = 3000

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        }, err => {
           console.log(err) 
           reject(err)
        }, {
            maximumAge: 0,
            timeout: 6000,
            enableHighAccuracy: true,
        })
    })
}

let intervalId = null

async function emitPositionEvent() {
    let position = { lng: null, lat: null }
    try {
        position = await getCurrentPosition()
        event.emit('position', position)
    }
    catch(e) {
        event.emit('error', e)
    }

    try {
        let group = JSON.parse(localStorage.getItem('group'))
        if (group) {
            axios.put('/users/position', position)
        }
    }
    catch(e) {
        console.log(e)
    }
    return position
}

export async function start() {
    await emitPositionEvent()
    if (intervalId != null) return intervalId
    intervalId = setInterval(debounce(interval - 500, async () => {
        await emitPositionEvent()
    }), interval)
    return intervalId
}

export function stop() {
    if (intervalId != null) {
        clearInterval(intervalId)
    }
    return intervalId
}

export default { start, stop, getCurrentPosition }
