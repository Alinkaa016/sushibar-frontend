import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Row} from 'react-bootstrap';
import {getAllCategories} from '../Utils/APIService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from "../Components/Header";
import MyAlert from "../Components/MyAlert";

function CategoriesPage() {

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getAllCategories()
            .then(data => {
                setCategories(data);
                setSelectedCategory(data[0]);
                setIsLoading(false);

            })
            .catch(err => {
                setErrorResponse(err.message);
                setShowAlert(true);
            })
    }, []);

    return (
        <>
            <Header/>
            <Container className="mt-5 flex-grow-1">
                <h1 className="text-center mb-4">Выберите категорию товаров</h1>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {isLoading ? (
                        Array.from({length: 6}).map((_, idx) => (
                            <Col key={idx}>
                                <Card>
                                    <Card.Body>
                                        <Skeleton height={30} width={`70%`}/>
                                        <Skeleton height={15} width={`90%`} style={{marginTop: 10}} count={2}/>
                                        <Skeleton height={40} width={`50%`} style={{marginTop: 20}}/>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        categories.map((category) => (
                            <Col key={category.id}>
                                <Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                    <Card.Body style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                        <Card.Title>{category.name}</Card.Title>
                                        <Card.Text style={{flex: 1}}>{category.description}</Card.Text>
                                        <Button variant="primary" href={`/catalog/${category.id}`}>Посмотреть
                                            товары</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
                <MyAlert show={showAlert} variant={"danger"} handleHide={() => setShowAlert(false)} message={errorResponse} header={"Уведомление"}/>
            </Container>
        </>
    );
}

export default CategoriesPage;
