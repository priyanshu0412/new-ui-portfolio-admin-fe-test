import { FooterContentPageComponent, ProtectedRoute } from '@/components'
import React from 'react'

// ----------------------------------------

const ManageFooterContentPage = () => {
    return (
        <>
            <ProtectedRoute>
                <FooterContentPageComponent />
            </ProtectedRoute>
        </>
    )
}

export default ManageFooterContentPage

// UI DONE 