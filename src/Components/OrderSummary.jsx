import {Card, ListGroup, ListGroupItem, Button, Modal, Row} from 'react-bootstrap';
import {useState} from "react";
import {CalculateProductPriceWithDiscounts} from "./ShoppingCart";

const OrderSummary = ({ cartItems }) => {
    const [showAll, setShowAll] = useState(false);

    const handleShowAll = () => setShowAll(true);
    const handleClose = () => setShowAll(false);

    const visibleItems = showAll ? cartItems : cartItems.slice(0, 2);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * CalculateProductPriceWithDiscounts(item.product), 0);
    };

    return (
        <>
            <Card.Body>
                <Card.Title>Ваш заказ</Card.Title>
                <ListGroup variant="flush">
                    {visibleItems.map((item, index) => (
                        <ListGroupItem key={index}>
                            <Row className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="mb-1">{item.product.name}</h6>
                                    <div>Количество: {item.quantity}</div>
                                    <div>Цена за шт.: {CalculateProductPriceWithDiscounts(item.product).toLocaleString('ru-RU')} ₽</div>
                                </div>
                                <h5 className="text-nowrap">
                                    Всего: { (item.quantity * CalculateProductPriceWithDiscounts(item.product)).toLocaleString('ru-RU')} ₽
                                </h5>
                            </Row>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                {cartItems.length >= 2 && !showAll && (
                    <Button variant="link" onClick={handleShowAll}>Посмотреть еще</Button>
                )}
                <div className="mt-3">
                    <h5>Общая сумма: {calculateTotal().toLocaleString('ru-RU')} ₽</h5>
                </div>
            </Card.Body>

            <Modal show={showAll} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Все товары в вашем заказе</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup variant="flush">
                        {cartItems.map((item, index) => (
                            <ListGroupItem key={index}>
                                <Row style={{width: "100%"}}
                                     className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-1">{item.product.name}</h6>
                                        <div>Количество: {item.quantity}</div>
                                        <div>Цена за
                                            шт.: {CalculateProductPriceWithDiscounts(item.product).toLocaleString('ru-RU')} ₽
                                        </div>
                                    </div>
                                    <h5 className="text-nowrap">
                                        Всего: {(item.quantity * CalculateProductPriceWithDiscounts(item.product)).toLocaleString('ru-RU')} ₽
                                    </h5>
                                </Row>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OrderSummary;