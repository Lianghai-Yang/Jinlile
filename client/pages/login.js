import React from 'react'
import Layout from "../components/layout";
import Form from "react-bootstrap/Form";
import { Button, Alert, Container } from 'react-bootstrap'
import { withRouter } from 'next/router'

class Login extends React.Component {
  constructor(props) {
    super(props)
    let imgNum = parseInt(Math.random() * 50)
    this.state = {
      showAlert: false,
      imgNum: imgNum
    }
  }
  
  async handleLogin(event) {
    let validation = document.getElementById('login-form').checkValidity()
    if (validation == false) {
      return this.showAlert(true)
    } 
    this.showAlert(false)
    let result = await this.sendCode()
    this.props.router.replace('/code')
  }

  showAlert(show=true) {
    this.setState({
      ...this.state,
      showAlert: show
    })
  }

  sendCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 1000);
    })
  }
  
  render() {
    return (
      <Layout>
        <Container>
        <div className="d-flex justify-content-center flex-wrap mt-5">
          <div id="form-container" className="w-100">
            <div className="w-100 d-flex justify-content-center">
              <img className="w-50 img-fluid" src={`/icons/icon-${this.state.imgNum}.svg`} alt="logo-image"/>
            </div>
            <div className="w-100 mt-5">
              <Form id="login-form" onSubmit={event => event.preventDefault()}>
                <Form.Control required size="lg" type="email" placeholder="Enter email" />
                <Button size="lg" className="btn-block mt-3" variant="dark" onClick={this.handleLogin.bind(this)}>Login</Button>
              </Form>
            </div>
            <Alert show={this.state.showAlert} className="mt-3 w-100" variant="dark" dismissible onClose={() => this.showAlert(false)}>
              Please enter a valid email.
            </Alert>
            <style jsx>{`
              // Medium devices (tablets, 768px and up)
              @media (min-width: 768px) {
                #form-container {
                  max-width: 400px;
                }
              }
              img {
                filter: drop-shadow(5px 5px 5px #222);
              }
            `}</style>
          </div>
        </div>
        </Container>
      </Layout>
    )
  }
}

export default withRouter(Login)
