/* STATELESS FUNCTION COMPONENT */

import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// Declare function to render Header elements
export default function UserSignOut ({ context }) {
    // Component calls signOut() and updates state AFTER render (of Redirect component in return function)
    // Call signOut() passed down from context
    useEffect(() => context.actions.signOut());

    // Redirect user to '/'
    return (
        <Redirect to="/" />
    );
}





