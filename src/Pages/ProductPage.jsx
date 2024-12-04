import React, {useEffect, useState} from 'react';
import {Button, Col, Container, FloatingLabel, Form, Image, Modal, Row, Table} from 'react-bootstrap';
import {useNavigate, useParams} from "react-router-dom";
import Header from '../Components/Header';
import {
    addToCart,
    checkingForReviewUser,
    containsInCart,
    createReview,
    deleteReview,
    getProductById,
    updateReview
} from "../Utils/APIService";
import StarRatings from 'react-star-ratings';

import MyYandexMap from "../Components/MyYandexMap";
import MyAlert from "../Components/MyAlert";
import {CalculateProductPriceWithDiscounts, Total} from "../Components/ShoppingCart";

const ProductPage = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editHeader, setEditHeader] = useState("");
    const [newReview, setNewReview] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editRating, setEditRating] = useState(0);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [isContain, setIsContain] = useState(false);
    const [reviewPresent, setReviewPresent] = useState(0);
    const [reload, setReload] = useState(false);
    const isChildModeEnabled = JSON.parse(localStorage.getItem('isChildModeEnabled'));
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);

    const username = localStorage.getItem("username");

    useEffect(() => {
        let isMounted = true;  // Для предотвращения утечки памяти и ошибок обновления состояния

        const fetchProductData = async () => {
            try {
                const productData = await getProductById(productId);
                if (isMounted) {
                    setProduct(productData);
                    setReviews(productData.reviewList);
                }

                const cartStatus = await containsInCart(productId);
                if (isMounted) {
                    setIsContain(cartStatus.success);
                }
            } catch (err) {
                if (isMounted) {
                    setErrorResponse(err.message);
                    setShowAlert(true);
                }
            }
        };

        fetchProductData();

        return () => {
            isMounted = false;
        };
    }, [productId, reload]);  // Убедитесь, что productId и reload — правильные зависимости


    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const reviewData = await checkingForReviewUser(productId);
                if (reviewData.success) {
                    setReviewPresent(+reviewData.message);

                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchReviewData();

        if (reviews && reviews.length > 0) {
            const sortedReviews = [...reviews].sort((a, b) => {
                if (!reviewPresent && a.id === reviewPresent) return -1;
                if (!reviewPresent && b.id === reviewPresent) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setSortedReviews(sortedReviews);
        }
    }, [reviews, productId]);

    function handleAddToCartProduct(product) {
        addToCart({product: product, quantity: 1})
            .then(data => {
                setReload(!reload);
                setSuccessResponse(data.message);
                setShowAlert(true);
            })
            .catch(err => {
                setErrorResponse(err.message);
                setShowAlert(true);
            })
    }

    function handleGoToCart() {
        navigate("/cart");
    }

    const handleEditClick = (review) => {
        setEditingReview(review);
        setEditHeader(review.header);
        setEditContent(review.content);
        setEditRating(review.rating);
        setNewReview(false);
    };

    const handleSaveClick = () => {
        const reviewData = {
            id: editingReview.id,
            header: editHeader,
            content: editContent,
            user: editingReview.user,
            createdAt: null,
            updatedAt: null,
            rating: editRating
        };

        updateReview(reviewData)
            .then(data => {
                setReload(!reload);
                setEditingReview(null);
                setSuccessResponse(data.message);
                setShowAlert(true);
            })
            .catch(err => {
                setErrorResponse(err.message);
                setShowAlert(true);
                console.error("Error updating or fetching product:", err);
            });
    };

    const handleChangeRating = (newRating) => {
        setEditRating(newRating);

    }

    const handleDeleteClick = (reviewId) => {
        deleteReview(reviewId)
            .then(data => {
                setReload(!reload);
                setSuccessResponse(data.message);
                setShowAlert(true);
            })
            .catch(error => {
                setErrorResponse(error.message);
                setShowAlert(true);
                console.error('Ошибка удаления отзыва:', error);
            });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setNewReview(false);
    };

    const handleCreateClick = () => {
        setEditHeader("");
        setEditContent("");
        setEditRating(0);
        handleShowModal();


    };

    const handleSaveCreateClick = () => {
        const reviewData = {
            header: editHeader,
            content: editContent,
            productId: product.id,
            rating: editRating,
        };

        createReview(reviewData)
            .then(data => {
                setEditingReview(null);
                setNewReview(false);
                setReload(!reload);
                setSuccessResponse(data.message);
                setShowAlert(true);
                handleCloseModal();
            })
            .catch(error => {
                setErrorResponse(error.message);
                setShowAlert(true);
                console.error('Ошибка сохранения отзыва:', error);
            });
    };

    return (
        <>
            <Header/>
            {product ? (
                <Container className="my-5 px-4">
                    <Row>
                        <Col md={6} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <Image className="" style={{width: '80%'}}
                                   src={`data:image/jpeg;base64,${product.image}`}
                                   alt={product.name}/>
                        </Col>
                        <Col style={{display: "flex", flexDirection: "column"}} md={6}>
                            <h2>{product.name}</h2>
                            <Row style={{display: "flex", alignItems: "center"}}>
                                <div className={"pb-2"} style={{width: 'fit-content'}}>
                                    <StarRatings
                                        rating={product.rating}
                                        starRatedColor="#fd920f"
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="1px"
                                    />
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: 'fit-content',
                                    height: '100%'
                                }}>
                                    {product.reviewList.length}
                                </div>
                            </Row>
                            <Row className={"mt-2"} style={{
                                display: "flex",
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <Col style={{maxHeight: "min-content"}}>
                                    <h5 style={{textWrap: "nowrap"}}>{product.price.toLocaleString('ru-RU')} ₽</h5>
                                </Col>
                                {!isChildModeEnabled &&
                                    <Col style={{maxHeight: "min-content"}}>
                                        {isContain ?
                                            <Button onClick={() => handleGoToCart()} variant="primary"
                                                    style={{textWrap: "nowrap"}}>В корзине</Button> :
                                            <Button onClick={() => handleAddToCartProduct(product)} variant="primary"
                                                    style={{textWrap: "nowrap"}}>Добавить в корзину</Button>}
                                    </Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <p>{product.description}</p>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div className="mt-4">
                                <h4>Характеристики:</h4>
                                <Table striped bordered hover>
                                    <tbody>
                                    {product.attributeList.map((attr, index) => (
                                        <tr key={index}>
                                            <td>{attr.name}</td>
                                            <td>{attr.value}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <MyYandexMap data={product.storeList}/>
                    </Row>
                    <Row className="mt-4">
                        <Col md={12}>
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Новый отзыв</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <div className={"mb-3"}>
                                            <StarRatings
                                                rating={editRating}
                                                starRatedColor="#fd920f"
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension="25px"
                                                starSpacing="1px"
                                                changeRating={(newRating) => handleChangeRating(newRating)} // Добавьте обработчик для изменения рейтинга
                                            />
                                        </div>
                                        <FloatingLabel controlId="floatingInputHeader" label="Заголовок"
                                                       className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Введите заголовок"
                                                value={editHeader}
                                                onChange={e => setEditHeader(e.target.value)}
                                            />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingTextareaContent" label="Содержание">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Введите содержание отзыва"
                                                style={{height: '100px'}}
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Закрыть
                                    </Button>
                                    <Button variant="primary" onClick={handleSaveCreateClick}>
                                        Сохранить
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <h4>Отзывы:</h4>
                            {!isChildModeEnabled && !reviewPresent && !sortedReviews.some(review => review.id === reviewPresent) && (
                                <Button className={"mb-3"} variant="primary" onClick={handleCreateClick}>Оставить
                                    отзыв</Button>
                            )}
                            {(sortedReviews && sortedReviews.length > 0) ? (
                                <div className="review-list">
                                    {sortedReviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className={`card mb-3 ${reviewPresent === review.id ? "border border-2 border-primary" : "border border-2"}`}
                                            style={{padding: "15px"}}
                                        >
                                            {editingReview && editingReview.id === review.id ? (
                                                <Col>
                                                    <Form>
                                                        <div className={"mb-3"}>
                                                            <StarRatings
                                                                rating={editRating}
                                                                starRatedColor="#fd920f"
                                                                numberOfStars={5}
                                                                name='rating'
                                                                starDimension="20px"
                                                                starSpacing="1px"
                                                                changeRating={(newRating) => handleChangeRating(newRating)} // Добавьте обработчик для изменения рейтинга
                                                            />
                                                        </div>
                                                        <FloatingLabel controlId="floatingInputHeader" label="Заголовок"
                                                                       className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Введите заголовок"
                                                                value={editHeader}
                                                                onChange={e => setEditHeader(e.target.value)}
                                                            />
                                                        </FloatingLabel>
                                                        <FloatingLabel controlId="floatingTextareaContent"
                                                                       label="Содержание">
                                                            <Form.Control
                                                                as="textarea"
                                                                placeholder="Введите содержание отзыва"
                                                                style={{height: '100px'}}
                                                                value={editContent}
                                                                onChange={e => setEditContent(e.target.value)}
                                                            />
                                                        </FloatingLabel>
                                                        <div className="mt-3">
                                                            <Button variant="primary"
                                                                    onClick={handleSaveClick}>Сохранить</Button>
                                                            <Button variant="danger"
                                                                    onClick={() => setEditingReview(null)}
                                                                    className="ms-2">Отмена</Button>
                                                        </div>
                                                    </Form>
                                                </Col>
                                            ) : (
                                                <div>
                                                    <StarRatings
                                                        rating={review.rating}
                                                        starRatedColor="#fd920f"
                                                        numberOfStars={5}
                                                        name='rating'
                                                        starDimension="20px"
                                                        starSpacing="1px"
                                                    />
                                                    <h5>{review.header}</h5>
                                                    <p>{review.content}</p>
                                                    {!isChildModeEnabled && reviewPresent && reviewPresent === review.id && (
                                                        <>
                                                            <button onClick={() => handleEditClick(review)}
                                                                    className="btn btn-primary">Редактировать
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(review.id)}
                                                                    className="btn btn-danger ms-2">Удалить
                                                            </button>
                                                        </>
                                                    )}
                                                    {reviewPresent && reviewPresent !== review.id && (
                                                        <footer className="blockquote-footer">
                                                            Оставлен <cite
                                                            title="Source Title">{review.user.firstName} {review.user.lastName}</cite>
                                                        </footer>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Отзывов пока нет.</p>
                            )}
                        </Col>
                    </Row>
                    <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                             handleHide={() => {
                                 setShowAlert(false)
                             }} message={successResponse ? successResponse : errorResponse}
                             header={"Уведомление"}/>
                </Container>
            ) : (
                <div>Товар не найден.</div>
            )}
        </>
    );
};

export default ProductPage;
