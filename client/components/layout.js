import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { Container } from 'react-bootstrap'
import { start } from '../events'
import 'bootstrap/dist/css/bootstrap.min.css'

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    start()
  }
  
  render() {
    return (
      <>
        <Head>
          <title>Jinlile</title>
        </Head>
        <Nav sideIconRight={this.props.sideIconRight} sideIconLeft={this.props.sideIconLeft} />
        <Container>
          {this.props.children}
        </Container>
      </>
    )
  }
}

export default Layout