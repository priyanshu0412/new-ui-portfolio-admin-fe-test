import { ProtectedRoute, SpecificManageFooterComponent } from '@/components'
import React from 'react'

// --------------------------------------------------

const SpecificManageFooterPage = () => {
    return (
        <>
            <ProtectedRoute>
                <SpecificManageFooterComponent />
            </ProtectedRoute>
        </>
    )
}

export default SpecificManageFooterPage

// UI Done 
