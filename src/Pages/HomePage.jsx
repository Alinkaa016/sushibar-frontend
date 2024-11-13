import React from 'react';
import Header from '../Components/Header';
import {useNavigate} from "react-router-dom";
import {Container} from "react-bootstrap"; // Убедитесь, что путь к Header корректен
import "./style.css"

const HomePage = () => {
    const username = localStorage.getItem('username'); // Получаем имя пользователя из localStorage
    const navigate = useNavigate();

    const goToCatalog = () => {
        navigate("/categories"); // Используем функцию для перехода на страницу каталога
    };

    return (
        <>
            <Header/>
            <Container>
                <div className="hero-section text-center">
                    <h1 className="display-4">Добро пожаловать в наш
                        онлайн-магазин{username ? `, ${username}` : ''}!</h1>
                    <p>Это домашняя страница нашего сайта. Вы можете просматривать товары и делать заказы.</p>
                    <button onClick={goToCatalog} className="btn btn-primary btn-lg">Посмотреть товары</button>
                </div>
            </Container>
        </>
    );
};

export default HomePage;
