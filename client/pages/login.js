import React from 'react'
import Layout from "../components/layout";
import Form from "react-bootstrap/Form";
import { Button } from 'react-bootstrap'

class Login extends React.Component {
  render() {
    return (
      <Layout>
        <div className="d-flex justify-content-center flex-wrap mt-5">
          <div id="form-container">
            <div className="w-100 d-flex justify-content-center">
              <img className="rounded shadow" src="https://via.placeholder.com/300" alt="logo-image"/>
            </div>
            <div className="w-100 mt-5">
              <Form>
                <Form.Control size="lg" type="email" placeholder="Enter email" />
                <Button size="lg" className="btn-block mt-3" variant="dark" type="submit">Login</Button>
              </Form>
            </div>
            <style jsx>{`
              // Medium devices (tablets, 768px and up)
              @media (min-width: 768px) {
                #form-container {
                  max-width: 400px;
                }
              }
            `}</style>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Login
