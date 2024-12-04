import React, { useState } from 'react';
import { Button, Card, Container, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../Components/Header";
import MyAlert from "../Components/MyAlert";
import { topUpDeposit } from "../Utils/APIService";

const PaymentPage = ({ show, onHide, handleSubmit }) => {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCardDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    return (
        <>
            <Modal show={show} onHide={() => onHide()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Оплата картой</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2" controlId="formGridCardNumber">
                            <Form.Label>Номер карты</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formGridExpiryDate">
                            <Form.Label>Срок действия</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="MM/YY"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formGridCVV">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="CVV"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formGridCardHolderName">
                            <Form.Label>Имя держателя карты</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Имя Фамилия"
                                name="cardHolderName"
                                value={cardDetails.cardHolderName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 w-100">
                            Оплатить
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onHide()}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentPage;
