import React from 'react';
import {Container} from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-4">
            <Container fluid className="text-center py-3">
                <h6>Footer Content Here</h6>
                <p>Some description or copyright notice</p>
            </Container>
        </footer>
    );
};

export default Footer;
