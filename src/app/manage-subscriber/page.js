import React from 'react'
import { ProtectedRoute, SubscriberPageComponent } from '@/components'

// --------------------------------------------

const ManageSubscriberPage = () => {
    return (
        <>
            <ProtectedRoute>
                <SubscriberPageComponent />
            </ProtectedRoute>
        </>
    )
}

export default ManageSubscriberPage

// Ui DOne 