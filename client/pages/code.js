import React from "react";
import Layout from '../components/layout';
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import { Alert, Container } from 'react-bootstrap';
import { withRouter } from 'next/router';
import axios from "axios";

class Code extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            alert: {
                show: false,
                content: ''
            },
            userData: {}
        }

    }

    async componentDidMount() {
        // let email = localStorage.getItem('email')
        // if (email == null) {
        //     return this.setState({ alert: { show: true, content: 'Invalid User' } })
        // }
        // let userData = JSON.parse(user)
        // this.setState({
        //     userData: {
        //         ...this.state.userData,
        //         ...userData
        //     }
        // })
    }
    
    async handleNumberChange(event) {
        let keyCode = event.keyCode
        let currentInput = event.currentTarget

        // backspace
        if (keyCode == 8) {
            let prevInput = currentInput.previousElementSibling
            if (prevInput != null && currentInput.value == '') {
                prevInput.focus()
            }
            return
        }
        
        let range = keyCode - '0'.charCodeAt(0);
        if (range > 9 || range < 0) {
            event.preventDefault()
            return false
        }

        let nextInput = currentInput.nextElementSibling

        currentInput.value = event.key
        event.preventDefault()
        
        if (nextInput != null) {
            nextInput.focus()
            return
        }

        // validate the code
        let inputs = Array.from(document.getElementsByClassName('number-input'))
        if (inputs == null) return
        let code = inputs.map(input => input.value).reduce((str, char) => `${str}${char}`, '')
        let validatedCode = await this.validateCode(code)
        if (validatedCode == false) {
            this.setState({
                ...this.state,
                alert: {
                    show: true,
                    content: 'Oops... It seems somthing wrong. Please check and confirm the code in your email.'
                }
            })
            return
        }

        // validated code, direct to map page
        let { router } = this.props
        router.replace('/groups')
    }

    // TODO: send request to validate the code
    async validateCode(code) {
        let { data } = await axios.get(`/users/code/${code}/validated`)
        return data.msg && data.msg === true
    }
    
    render() {
        let inputSize = '4'
        return (
            <Layout>
                <Container>
                    <style type="text/css">{`
                        .number-input {
                            width: ${inputSize}rem;
                            height: ${inputSize}rem;
                            font-size: ${inputSize - 1}rem;
                            text-align: center;
                            line-height: 0;
                        }

                        @media (min-width: 768px) {
                            .input-container {
                                max-width: 300px;
                            }
                        }
                    `}</style>

                    <div className="mt-5 d-flex justify-content-center flex-wrap">
                        <div className="input-container">
                            <p className="text-muted">We have sent an email to you. <br /> Please enter the code in your email below:</p>
                            <div className="d-flex justify-content-center mt-5">
                                <Form.Control onKeyDown={event => this.handleNumberChange(event)} maxLength="1" className="number-input ml-2 mr-2" />
                                <Form.Control onKeyDown={event => this.handleNumberChange(event)} maxLength="1" className="number-input ml-2 mr-2" />
                                <Form.Control onKeyDown={event => this.handleNumberChange(event)} maxLength="1" className="number-input ml-2 mr-2" />
                                <Form.Control onKeyDown={event => this.handleNumberChange(event)} maxLength="1" className="number-input ml-2 mr-2" />
                            </div>
                            <p className="text-muted mt-5">Or you would like to change your email address? Click <Link replace href="/login"><a>HERE</a></Link> </p>
                        </div>
                        <Alert show={this.state.alert.show} variant="dark" dismissible onClose={() => this.setState({...this.state, alert:{show: false}})}>
                            {this.state.alert.content}
                        </Alert>
                    </div>
                </Container>
            </Layout>
        )
    }
}

export default withRouter(Code)