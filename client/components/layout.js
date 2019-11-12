import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { Container } from 'react-bootstrap'
import { start } from '../events'

class Layout extends React.Component {
  componentDidMount() {
    start()
  }
  
  render() {
    return (
      <>
        <Head>
          <title>Jinlile</title>
        </Head>
        <Nav />
        <Container>
          {this.props.children}
        </Container>
      </>
    )
  }
}

export default Layout