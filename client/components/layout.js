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
    let { title } = this.props
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no"/>
          <title>{title ? title : 'Jinlile'}</title>
        </Head>
        <div className="position-absolute d-flex flex-column h-100 w-100">
          <Nav sideIconRight={this.props.sideIconRight} sideIconLeft={this.props.sideIconLeft} title={title} />
          <div className="flex-grow-1 d-flex flex-column flex-shrink-0">
            {this.props.children}
          </div>
        </div>
        <style>{`
          nav {
            z-index: 1;
          }
        `}</style>
      </>
    )
  }
}

export default Layout