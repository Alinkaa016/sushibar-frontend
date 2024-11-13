import React, {useState} from 'react';
import {Button, Card, Container, Form, InputGroup} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import Header from "../Components/Header";
import PaymentPage from "./PaymentPage";
import MyAlert from "../Components/MyAlert";
import {topUpDeposit} from "../Utils/APIService";

const DepositPage = () => {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmitCurr = (event) => {
        event.preventDefault();
        setShowModal(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        topUpDeposit(amount)
            .then((data) => {
                setShowModal(false);
                setSuccessResponse(data.message);
                setShowAlert(true);
            })
            .catch(error => {
                setErrorResponse(error.message);
                setShowAlert(true);
            });
    };

    const handleBack = () => {
        navigate(-1); // Возвращает пользователя на предыдущую страницу
    };

    return (
        <>
            <Header/>
            <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '90vh'}}>
                <Card style={{width: '400px'}} className="shadow-lg p-4 mb-5 bg-white rounded">
                    <Card.Body>
                        <Card.Title className="text-center">Пополнение депозита</Card.Title>
                        <Form onSubmit={handleSubmitCurr}>
                            <Form.Group controlId="depositAmount">
                                <Form.Label>Сумма пополнения</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>₽</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="Введите сумму"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        min="1" // Минимальная сумма пополнения
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mb-2">
                                Пополнить
                            </Button>
                            <Button variant="secondary" onClick={handleBack} className="w-100">
                                Назад
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <PaymentPage show={showModal} handleSubmit={handleSubmit} onHide={() => setShowModal(false)}/>
                <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                         handleHide={() => setShowAlert(false)}
                         message={successResponse ? successResponse : errorResponse} header="Уведомление"/>
            </Container>
        </>
    );
};

export default DepositPage;
