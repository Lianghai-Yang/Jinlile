import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { Container } from 'react-bootstrap'

class Layout extends React.Component {
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