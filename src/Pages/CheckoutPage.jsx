import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import OrderSummary from "../Components/OrderSummary";
import {createOrder, getPaymentMethods, getShippingMethods, getShoppingCart, getStores} from "../Utils/APIService";
import {useNavigate} from "react-router-dom";
import Header from "../Components/Header";
import MyAlert from "../Components/MyAlert";
import {CalculateProductPriceWithDiscounts} from "../Components/ShoppingCart";
import PaymentPage from "./PaymentPage";

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const calculateTotal = (cartItems) => {
        return cartItems && cartItems.length > 0 ? cartItems.reduce((total, item) => total + item.quantity * CalculateProductPriceWithDiscounts(item.product), 0) : 0;
    };

    const [orderDetails, setOrderDetails] = useState({
        totalAmount: 0,
        paymentMethod: null,
        shippingMethod: null,
        orderItems: null,
        store: null,
        deliveryAddress: ""
    });

    useEffect(() => {
        const username = localStorage.getItem('username');

        const fetchCartAndMethods = async () => {
            try {
                const cartData = await getShoppingCart(username);
                setCartItems(cartData.cartItems);

                if (cartData.cartItems.length === 0) {
                    return;
                }

                const paymentData = await getPaymentMethods();
                setPaymentMethods(paymentData);

                const shippingData = await getShippingMethods();
                setShippingMethods(shippingData);

                const stores = await getStores();
                setStores(stores);



                setOrderDetails(prev => ({
                    ...prev,
                    totalAmount: calculateTotal(cartData.cartItems),
                    orderItems: cartData.cartItems.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity
                    })),
                    paymentMethod: paymentData[0],
                    shippingMethod: shippingData[0],
                    store: stores[0]
                }));
            } catch (error) {
                setErrorResponse(error.message);
                setShowAlert(true);
            }
        };

        fetchCartAndMethods();
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        const selectedValue = parseInt(value);

        setOrderDetails(prev => ({
            ...prev,
            [name]: name === "shippingMethod"
                ? shippingMethods.find(item => item.id === selectedValue)
                : name === "paymentMethod"
                    ? paymentMethods.find(item => item.id === selectedValue)
                    : stores.find(item => item.id === selectedValue) // Добавляем выбор магазина
        }));

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fetchOrder = async () => {
            try {
                const data = await createOrder(orderDetails);
                setSuccessResponse(data.message);
            } catch (error) {
                setErrorResponse(error.message);
            } finally {
                setShowAlert(true);
                setShowModal(false);
            }
        };

        fetchOrder();
    };

    const handleSubmitCurr = (e) => {
        e.preventDefault();
        if (orderDetails.paymentMethod.description === "Картой"){
            setShowModal(true);
        }
        else {
            handleSubmit(e);
        }
    };

    return (
        <>
            <Header/>
            <Container className="my-5">
                {cartItems.length === 0 ?
                    <Row>
                        <h3>Нет товаров в корзине</h3>
                    </Row>
                    :
                    <Row>
                        <Col md={7}>
                            <Card style={{boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"}} className="border-0">
                                <Card.Body>
                                    <Card.Title>Оформление заказа</Card.Title>
                                    <Form onSubmit={handleSubmitCurr}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Общая сумма</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={orderDetails.totalAmount.toFixed(2)}
                                                readOnly
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Способ оплаты</Form.Label>
                                            <Form.Select
                                                name="paymentMethod"
                                                value={orderDetails.paymentMethod?.id || ''}
                                                onChange={handleInputChange}
                                            >
                                                {paymentMethods && paymentMethods.map(method => (
                                                    <option key={method.id} value={method.id}>
                                                        {method.description}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Способ доставки</Form.Label>
                                            <Form.Select
                                                name="shippingMethod"
                                                value={orderDetails.shippingMethod?.id || ''}
                                                onChange={handleInputChange}
                                            >
                                                {shippingMethods && shippingMethods.map(method => (
                                                    <option key={method.id} value={method.id}>
                                                        {method.description}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        {orderDetails.shippingMethod && orderDetails.shippingMethod?.description === "Самовывозом" &&
                                            <Form.Group className="mb-3">
                                                <Form.Label>Магазин</Form.Label>
                                                <Form.Select
                                                    name="store"
                                                    value={orderDetails.store?.id || ''}
                                                    onChange={handleInputChange}
                                                >
                                                    {stores && stores.map(store => (
                                                        <option key={store.id} value={store.id}>
                                                            {store.name}, г. {store.address.city},
                                                            ул. {store.address.street} {store.address.houseNumber}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        }
                                        {orderDetails.shippingMethod && orderDetails.shippingMethod?.description === "Доставкой" &&
                                            <Form.Group className="mb-3">
                                                <Form.Label>Адрес доставки</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={orderDetails.deliveryAddress}
                                                    onChange={(event) => {
                                                        setOrderDetails(prevState => ({
                                                            ...prevState,
                                                            deliveryAddress: event.target.value
                                                        }))

                                                    }}
                                                />
                                            </Form.Group>
                                        }
                                        <Button style={{width: "100%"}} variant="primary" type="submit">
                                            Оформить заказ
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card style={{boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"}} className="border-0">
                                {cartItems && cartItems.length > 0 && (
                                    <OrderSummary cartItems={cartItems}/>
                                )}
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
            <PaymentPage show={showModal} handleSubmit={handleSubmit} onHide={() => setShowModal(false)}/>
            <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                     handleHide={() => {
                         setShowAlert(false)
                         successResponse && navigate("/")
                     }} message={successResponse ? successResponse : errorResponse}
                     header={"Уведомление"}/>
        </>
    );
};

export default CheckoutPage;
