import React from 'react'
import { Navbar } from 'react-bootstrap'

class JinlileNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sideIconLeft: () => {},
      sideIconRight: () => {}
    }
    if (props.sideIconLeft) {
      this.state.sideIconLeft = props.sideIconLeft
    }
    if (props.sideIconRight) {
      this.state.sideIconRight = props.sideIconRight
    }
  }
  
  render() {
    return (
      <>
        <Navbar className="justify-content-center" bg="light" variant="light">
          <div className="flex-grow-0">
            {this.state.sideIconLeft()}
          </div>
          <Navbar.Brand className="flex-grow-1 text-center m-0 flex-shrink-1 text-primary">Jinlile</Navbar.Brand>
          <div className="flex-grow-0">
            {this.state.sideIconRight()}
          </div>
        </Navbar>
      </>
    )
  }
}

export default JinlileNav