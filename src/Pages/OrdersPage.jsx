import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Container, Modal, Row} from 'react-bootstrap';
import {getOrdersByUser} from "../Utils/APIService";
import Header from "../Components/Header";
import {format, parseISO} from 'date-fns'
import {Badge} from "@mui/material";
import {Link} from "react-router-dom";

import "../css/ordersPage.css"
import OrderReceipt from "../Components/OrderReceipt";
import {useReactToPrint} from "react-to-print";
import MyAlert from "../Components/MyAlert";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleShowReceipt = (order) => {
        setSelectedOrder(order);
        setShowReceiptModal(true);
    };

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const fetchOrders = async () => {
        const username = localStorage.getItem("username");
        try {
            getOrdersByUser(username).then(
                data => {
                    setOrders(data);
                }
            )
        } catch (error) {
            setErrorResponse(error.message);
            setShowAlert(true);
            console.error('Error fetching orders:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return;
        const date = parseISO(dateString);
        return format(date, 'dd.MM.yyyy HH:mm');
    };

    return (
        <>
            <Header/>
            <Container>
                <h1 className="my-4">Список заказов</h1>
                {orders.map(order => (
                    <HorizontalOrderCard key={order.id} order={order} onShowDetails={handleShowDetails}
                                         onReceipt={handleShowReceipt} formatDate={formatDate}/>
                ))}
                <OrderDetailsModal show={showModal} onHide={() => setShowModal(false)} order={selectedOrder}/>
                <OrderReceiptModal show={showReceiptModal} onHide={() => setShowReceiptModal(false)} on
                                   order={selectedOrder} handlePrint={handlePrint} componentRef={componentRef} formatDate={formatDate}/>
                <MyAlert show={showAlert} variant={"danger"} handleHide={() => setShowAlert(false)} message={errorResponse} header={"Уведомление"}/>
            </Container>
        </>
    );
};

const HorizontalOrderCard = ({order, onShowDetails, onReceipt, formatDate}) => {
    return (
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-end">
                    <div>
                        <Card.Title>Заказ #{order.id}</Card.Title>
                        <Card.Text>
                            <strong>Дата создания:</strong> {formatDate(order.creationDate)}<br/>
                            <strong>Дата завершения:</strong> {formatDate(order.completionDate) || 'Не завершён'}<br/>
                            <strong>Сумма:</strong> {order.totalAmount.toFixed(2)} ₽<br/>
                            <strong>Статус:</strong> {order.status.description}<br/>
                            <strong>Способ оплаты:</strong> {order.paymentMethod.description}<br/>
                            <strong>Способ доставки:</strong> {order.shippingMethod.description}
                        </Card.Text>
                    </div>
                    <div>
                        <Button variant="primary" onClick={() => onReceipt(order)}>
                            Чек
                        </Button>
                        <Button variant="primary" onClick={() => onShowDetails(order)}>
                            Подробнее
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

const OrderReceiptModal = ({show, onHide, order, componentRef, formatDate, handlePrint}) => {
    if (!order) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Детали заказа #{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <OrderReceipt ref={componentRef} order={order} formatDate={formatDate}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Закрыть</Button>
                <Button onClick={handlePrint}>Печать чека</Button>
            </Modal.Footer>
        </Modal>
    );
};

const OrderDetailsModal = ({show, onHide, order}) => {
    if (!order) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Детали заказа #{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Товары в заказе:</h4>
                {order.orderItems.map((item, index) => (
                    <div key={item.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={12}>
                                        {/*<h5 className="mb-0">{index + 1}. {item.product.name}</h5>*/}
                                        <h5>
                                            <Link to={`/product/${item.product.id}`}
                                                  className="hover-link">{index + 1}. {item.product.name}</Link>
                                        </h5>
                                    </Col>
                                    <Col xs={12} className="text-right">
                                        <Badge variant="primary">Количество: {item.quantity}</Badge>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrdersPage;
