import { LoginComponent, PublicRoute } from '@/components'
import React from 'react'

// -----------------------------------------------

const LoginPage = () => {
    return (
        <>
            <PublicRoute>
                <LoginComponent />
            </PublicRoute>
        </>
    )
}

export default LoginPage
