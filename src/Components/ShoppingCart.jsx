
import React, {useEffect, useState} from 'react';
import {
    getShoppingCart,
    increaseProductQuantityInCart,
    reduceProductQuantityInCart,
    removeFromCart
} from '../Utils/APIService';
import {Button, Col, Container, Form, Image, Row} from 'react-bootstrap';
import '../css/shoppingCart.css';
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import MyAlert from "./MyAlert"; // Убедитесь, что путь к Header корректен

const ShoppingCart = ({ username }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getShoppingCart(username);
                setCart(data);
            } catch (error) {
                setError(error);
                setErrorResponse(error.message);
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [username, reload]);

    if (loading) {
        return (
            <Container className="mt-5">
                <Row>
                    <Col md={8}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Container key={index} className="rounded-3 mb-3" style={{boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", backgroundColor: '#FFFFFF'}}>
                                <Row className="px-3 py-3">
                                    <Col sm={4} md={3}>
                                        <Skeleton height={200} />
                                    </Col>
                                    <Col sm={8} md={9}>
                                        <Skeleton height={30} width={`80%`} />
                                        <Skeleton height={20} width={`90%`} count={3} style={{ marginTop: 10 }} />
                                    </Col>
                                </Row>
                            </Container>
                        ))}
                    </Col>
                    <Col md={4}>
                        <Container className="rounded-3" style={{boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", backgroundColor: '#FFFFFF'}}>
                            <Skeleton height={30} width={`90%`} />
                            <Skeleton height={20} width={`90%`} count={3} style={{ marginTop: 10 }} />
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }
    if (error) return <p>Error: {error.message}</p>;
    if (!cart || cart.cartItems?.length === 0) return <p>Корзина пуста.</p>;

    function calculateTotalAmount() {
        return cart?.cartItems?.reduce((total, item) => {
            return total + (CalculateProductPriceWithDiscounts(item.product) * item.quantity);
        }, 0);
    }

    function calculateTotalAmountWithoutDiscounts() {
        return cart?.cartItems?.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    function calculateBenefit() {
        return calculateTotalAmountWithoutDiscounts() - calculateTotalAmount();
    }

    function calculateTotalQuantityShop(product) {
        return product.storeList.reduce((total, item) => {
            return total + 1;
        }, 0)
    }

    function getStoreCountText(count) {
        const tens = count % 100;
        const ones = count % 10;

        if (tens > 10 && tens < 20) {
            return `в ${count} магазинах`;
        }

        switch (ones) {
            case 1:
                return `в ${count} магазине`;
            case 2:
            case 3:
            case 4:
                return `в ${count} магазинах`;
            default:
                return `в ${count} магазинах`;
        }
    }

    function handleDeleteProduct(productId){
        removeFromCart(productId)
            .then(data => {
                setCart(data);
                setReload(!reload);
                setShowAlert(true);
                setSuccessResponse(data.message);
            })
            .catch(err =>{
                setShowAlert(true);
                setErrorResponse(err.message);
        })
    }

    function handleChangeQuantityProduct(productId, isReduce){
        if (isReduce){
            reduceProductQuantityInCart(productId)
                .then(data => {
                    setCart(data);
                    setReload(!reload);
                    setShowAlert(true);
                    setSuccessResponse(data.message);
                })
                .catch(err =>{
                    setShowAlert(true);
                    setErrorResponse(err.message);
                })
        }
        else{
            increaseProductQuantityInCart(productId)
                .then(data => {
                    setCart(data);
                    setReload(!reload);
                    setShowAlert(true);
                    setSuccessResponse(data.message);
                })
                .catch(err =>{
                    setShowAlert(true);
                    setErrorResponse(err.message);
                })
        }
    }


    return (
        <>
            <Container>
                <Row className="shopping-cart">
                    <Col xs={12} lg={8} className="order-2 order-lg-1">
                        {cart?.cartItems?.map((item, index) => (
                            <Container className="rounded-3" style={{boxShadow:"0 4px 16px rgba(0, 0, 0, 0.1)", backgroundColor: '#FFFFFF', border: '0px solid #007bff' }}>
                                <Row key={index} className="px-3 py-3 mb-3 product-card">
                                    <Col className="product-image" sm={4} md={3}>
                                        <Image className="rounded-1 image" src={`data:image/jpeg;base64,${item.product.image}`} alt="Product" />
                                    </Col>
                                    <Col className="product-info" sm={5} md={7}>
                                        <div style={{flexGrow: 1}}>
                                            <Row>
                                                <div style={{maxWidth:"fit-content"}} className="text fs-6">
                                                    {item.product.name}
                                                </div>
                                            </Row>
                                            <Row className="quantity-selectors">
                                                <Col>
                                                    <Button
                                                        onClick={() => handleChangeQuantityProduct(item.product.id, true)}
                                                        variant="outline-dark" style={{
                                                        borderWidth: "1px",
                                                        fontWeight: "bolder",
                                                        borderBottomLeftRadius: "8px",
                                                        borderTopLeftRadius: "8px",
                                                        borderBottomRightRadius: "0px",
                                                        borderTopRightRadius: "0px",
                                                        borderRight: 'none'
                                                    }}>–</Button>
                                                    <Button disabled={true} style={{
                                                        fontWeight: "600",
                                                        borderWidth: "1px",
                                                        color: '#000000',
                                                        borderColor: '#000000',
                                                        borderLeft: 'none',
                                                        borderRight: 'none'
                                                    }} variant="outline-dark rounded-0">{item.quantity}</Button>
                                                    <Button
                                                        onClick={() => handleChangeQuantityProduct(item.product.id, false)}
                                                        variant="outline-dark" style={{
                                                        borderWidth: "1px",
                                                        fontWeight: "bolder",
                                                        borderBottomRightRadius: "8px",
                                                        borderTopRightRadius: "8px",
                                                        borderTopLeftRadius: "0px",
                                                        borderBottomLeftRadius: "0px",
                                                        borderLeft: 'none'
                                                    }}>+</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Row className="" style={{marginTop: 'auto'}}>
                                            <Col xs={12} style={{maxWidth: "fit-content"}} className="text text-nowrap fs-6 pe-0">
                                                В наличии:
                                            </Col>
                                            <Col xs={12} className="text fs-6 ps-md-1 ps-xs-0 brighter-text" style={{maxWidth: "fit-content", color: "#1b6ab3"}}>
                                                {getStoreCountText(calculateTotalQuantityShop(item.product))}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="product-actions" sm={3} md={2}>
                                        <div className="order-1 btn-del-container">
                                            <Col className="btn-del-col">
                                                <Button variant="dark" onClick={() => handleDeleteProduct(item.product.id)} className="rounded-3 py-1 px-1">
                                                    Удалить
                                                </Button>
                                            </Col>
                                        </div>
                                        <Row className="m-0 order-2 pricing-actions-container">
                                            <Row className="pb-2" style={{display:"flex", justifyContent:"end", fontSize: "medium", fontWeight: "650", textWrap: "nowrap", flexGrow: 1}}>
                                                {CalculateProductPriceWithDiscounts(item.product).toLocaleString('ru-RU')} ₽
                                            </Row>
                                            <Row>
                                                <Button className="rounded-3" variant={'outline-dark'}>Купить</Button>
                                            </Row>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        ))}
                    </Col>
                    <Col xs={12} lg={4} className="order-1 order-lg-2 mb-3 mb-sm-3 mb-md-3">
                        <Container className="rounded-3" style={{ boxShadow:"0 4px 16px rgba(0, 0, 0, 0.1)", backgroundColor: '#FFFFFF', border: '0px solid #007bff' }}>
                            <Col style={{ maxWidth: "100%" }}>
                                <div className="title py-2 px-2 text-start fs-5">
                                    Детали заказа
                                </div>
                            </Col>
                            <Row className="total-container">
                                <Col xs={12} md={6}>
                                        <div style={{color: "#9d9d9d", fontSize: "small"}} className="text pb-0 pt-1 px-2 text-nowrap text-start">
                                            Итого
                                        </div>
                                        <div className="text rounded-1 py-1 px-2 text-nowrap text-start fs-6">
                                            Товаров: {cart?.cartItems?.length}
                                        </div>
                                </Col>
                                <Col xs={12} md={6} className="total-amount-container">
                                    <div style={{maxWidth:"fit-content"}} className="text rounded-1 text-nowrap py-1 px-2 fs-6">
                                        {calculateTotalAmount()?.toLocaleString('ru-RU')} ₽
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pb-3 pt-1" style={{display: "flex", justifyContent: "center"}}>
                                <Button className="rounded-3 w-100" variant="dark" onClick={() => navigate("/checkout")}>Оформление заказа</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                         handleHide={() => {
                             setShowAlert(false)
                         }} message={successResponse ? successResponse : errorResponse}
                         header={"Уведомление"}/>
            </Container>
        </>
    );
};

const Total = ({ price, priceWithDiscount }) => {
    return (
        <Row className="m-0 order-2 pricing-actions-container">
            <Row className="text-decoration-line-through" style={{ color: "#9d9d9d", display:"flex", justifyContent:"end", fontSize: "small", fontWeight: "normal"}}>
                {price?.toLocaleString('ru-RU')} ₽
            </Row>
            <Row style={{display:"flex", justifyContent:"end", fontSize: "medium", fontWeight: "650", textWrap: "nowrap", flexGrow: 1}}>
                {priceWithDiscount?.toLocaleString('ru-RU')} ₽
            </Row>
        </Row>
    );
};
function CalculateProductPriceWithDiscounts(product) {
    let priceWithDiscount = product.price;
    return priceWithDiscount;
}

export { Total, CalculateProductPriceWithDiscounts, ShoppingCart }

export default ShoppingCart;
