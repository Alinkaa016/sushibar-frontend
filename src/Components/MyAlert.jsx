import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function MyAlert({ show, handleHide, variant, header, message}) {
    if (show) {
        return (
            <Alert className="position-fixed top-0 start-50 translate-middle-x" variant={variant} onClose={() => handleHide()} dismissible>
                <Alert.Heading>{header}</Alert.Heading>
                <div>
                    {message}
                </div>
            </Alert>
        );
    }
}

export default MyAlert;