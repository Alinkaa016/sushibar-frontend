

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    containsInCart,
    getAllCategories,
    getProductsByCategory,
    getProductsBySearch,
    getSortProductsByPrice
} from '../Utils/APIService';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../css/catalog.css';
import {Button, Col, Container, Form, FormControl, Row} from "react-bootstrap";
import SearchableDropdown from "../Components/SearchableDropdown";
import CustomPagination from "../Components/CustomPagination";
import ProductCard from "../Components/ProductCard";
import Skeleton from "react-loading-skeleton";
import {FormGroup, FormLabel} from "@mui/material";

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reload, setReload] = useState(true);
    const [sortDirection, setSortDirection] = useState('asc');
    const [search, setSearch] = useState("");
    const {category} = useParams();
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 8;
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getProductsBySearch(search, category, sortDirection, currentPage, pageSize)
            .then(data => {
                setProducts(data.content);
                setTotalPages(data.totalPages);

            })
            .catch(error => {
                setErrorResponse(error.message);
                setShowAlert(true);
            });
        getAllCategories()
            .then(data => {
                setCategories(data);
                const matchedCategory = data.find(item => item.id.toString() === category);
                setCurrentCategory(matchedCategory);
                setIsLoading(false);
            })
            .catch(error => {
                setErrorResponse(error.message);
                setShowAlert(true);
            })
    }, [reload, currentPage, sortDirection]);

    const handleSelectCategory = (category) => {
        navigate(`/catalog/${category.id}`);
    };
    const handleSelectProduct = (product) => {
        navigate(`/product/${product.id}`);
    };
    const onPageChange = (page) => {
        setCurrentPage(page);
        setSearch("");
        window.scrollTo(0, 0);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setReload(!reload);
    };

    const handleSortSubmit = (event) => {
        event.preventDefault();
        setReload(!reload);
    };

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <h1 className="text-center mb-4">Каталог</h1>
                <Container fluid>
                    <Row>
                        {
                            isLoading ? <Skeleton width={200} height={40} /> :
                                categories.length > 0 &&
                                <SearchableDropdown items={categories} handleSelect={handleSelectCategory}/>
                        }
                        <Col md={9}>
                            <h2>{isLoading ? <Skeleton width={200} height={40} /> : currentCategory ? currentCategory.name : 'Нет категории'}</h2>
                            <p>{isLoading ? <Skeleton width={800} height={80} /> : currentCategory ? currentCategory.description : 'Описание отсутствует'}</p>
                        </Col>
                    </Row>
                </Container>
                <Container fluid>
                    <Row className={"d-flex"}>
                        <Row className={"d-flex"} md={4}>
                            <Form inline onSubmit={handleSubmit}>
                                <Col>
                                    <FormLabel className="mr-sm-2">Поиск:</FormLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Введите название товара"
                                        className="mr-sm-2"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Col>
                                <Button className={"mt-2"} type="submit" variant="outline-primary">Поиск</Button>
                            </Form>
                        </Row>
                        <Row className={"d-flex mt-3"} md={4}>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup controlId="formSortDirection" className="mr-sm-2">
                                    <FormLabel className="mr-sm-2">Цена:</FormLabel>
                                    <FormControl as="select" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                                        <option value="asc">Возрастание</option>
                                        <option value="desc">Убывание</option>
                                    </FormControl>
                                </FormGroup>
                            </Form>
                        </Row>
                    </Row>
                </Container>
                <Row xs={1} md={2} lg={4} className="g-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, idx) => (
                            <Col key={idx}>
                                <Skeleton height={300} />
                            </Col>
                        ))
                    ) : (
                        products?.map(product => (
                            <Col key={product.id}>
                                <ProductCard handleSelectProduct={handleSelectProduct} product={product}/>
                            </Col>
                        ))
                    )}
                </Row>
                <Container className="mt-5">
                    {isLoading ? <Skeleton height={50} width={300} /> :
                        <CustomPagination totalPages={Number(totalPages)} currentPage={Number(currentPage)}
                                          onPageChange={onPageChange}/>
                    }
                </Container>
            </Container>
        </>
    );
}