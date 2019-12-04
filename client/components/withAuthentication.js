import React, { useEffect, useState } from 'react'
import { Spinner, Container } from 'react-bootstrap'
import { useRouter } from 'next/router'
import axios from 'axios'

function withAuthentication(WrappedComponent) {
    return props => {
        const router = useRouter()
        const [auth, setAuth] = useState(null)
        useEffect(() => {
            axios.get('/users/authenticated').then(() => {
                setAuth(true)
            })
            .catch(() => {
                setAuth(false)
            })
        })

        if (auth == false) {
            router.replace('/')
        }
        
        if (auth !== true) {
            return (
                <div style={{left: 0, top: 0}} className="d-flex h-100 w-100 align-items-center position-fixed justify-content-center">
                    <Spinner className="" animation="border" />
                </div>
            )
        }
        
        return (
            <WrappedComponent {...props} />
        )
    }
}

export default withAuthentication