import React from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
class JinlileNav extends React.Component {
  render() {
    return (
      <>
        <Navbar className="justify-content-center" bg="light" variant="light">
          <Navbar.Brand className="text-primary">Jinlile</Navbar.Brand>
        </Navbar>
      </>
    )
  }
}

export default JinlileNav