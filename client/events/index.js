import * as EventEmitter from 'eventemitter3'
import { start as startPosition } from './position'

const event = new EventEmitter()

event.on('error', err => {
    console.log(err)
})

export default event;
export { default as position } from './position';
export function start() {
    startPosition()
}