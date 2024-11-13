import React, {useEffect, useState} from 'react';
import {Button, Container, Dropdown, Nav, Navbar, NavLink, Offcanvas} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import "../css/header.css";
import {getDeposit} from "../Utils/APIService";
import Badge from 'react-bootstrap/Badge';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faCartShopping, faShoppingCart, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const username = localStorage.getItem('username');
    const [notificationCount, setNotificationCount] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
    const isChildModeEnabled = JSON.parse(localStorage.getItem('isChildModeEnabled'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate("/");

    };

    useEffect(() => {
        if (username != null) {

            const fetchDeposit = () => {
                getDeposit()
                    .then(data => {
                        setDeposit(data);
                    })
                    .catch(error => {
                        console.error('Ошибка при получении депозита:', error);
                    });
            };
            fetchDeposit();

            const resizeListener = () => {
                setIsLargeScreen(window.innerWidth >= 992);
            };

            window.addEventListener('resize', resizeListener);

            return () => {

                window.removeEventListener('resize', resizeListener);
            };
        }
    }, []);

    return (
        <>
            {isLargeScreen ? (
                <Navbar bg="dark" variant="dark" expand="lg" className="header-nav">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="navbar-brand-logo">Сушибар</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                {username ? (
                                    <>
                                        {!isChildModeEnabled &&
                                            <NavLink as={Link} to="/deposit"
                                                     className="custom-nav-link d-flex align-items-center">
                                                Текущий депозит: {deposit.toLocaleString('ru-RU')} ₽
                                            </NavLink>
                                        }
                                        <Dropdown as={Nav.Item}>
                                            <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center">
                                                <Button className={" profile-button"} variant="light">
                                                    {notificationCount > 0 && (
                                                        <Badge onClick={() => navigate("/notifications")} bg="light"
                                                               style={{color: 'black'}} className="badge">
                                                            {notificationCount}
                                                            <span className="visually-hidden">unread messages</span>
                                                        </Badge>
                                                    )}
                                                    <FontAwesomeIcon icon={faUser} aria-hidden="true"/>
                                                </Button>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu align="end">
                                                <Dropdown.Item as={Link} to="/orders">Заказы</Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/profile">Профиль</Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/notifications">Уведомления</Dropdown.Item>
                                                {!isChildModeEnabled &&
                                                    <Dropdown.Item as={Link} to="/cart">Корзина</Dropdown.Item>
                                                }
                                                <Dropdown.Divider/>
                                                <Dropdown.Item onClick={handleLogout}>Выйти</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>
                                ) : (
                                    <>
                                        <NavLink as={Link} to="/login" className="custom-nav-link">Авторизация</NavLink>
                                        <NavLink as={Link} to="/register"
                                                 className="custom-nav-link">Регистрация</NavLink>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            ) : (
                <>
                    <Navbar bg="dark" variant="dark" expand="lg" className="header-nav">
                        <Container>
                            <Navbar.Brand as={Link} to="/" className="navbar-brand-logo">Backlog</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShowOffCanvas(true)}/>
                        </Container>
                    </Navbar>
                    <Offcanvas className={"custom-container"} show={showOffCanvas}
                               onHide={() => setShowOffCanvas(false)} placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Меню</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column">
                                {username ? (
                                    <>
                                        <Nav.Link as={Link} to="/orders"
                                                  className="d-flex align-items-center custom-black-text">
                                            <FontAwesomeIcon icon={faShoppingCart} className="me-2"/> Заказы
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/profile"
                                                  className="d-flex align-items-center custom-black-text">
                                            <FontAwesomeIcon icon={faUser} className="me-2"/> Профиль
                                        </Nav.Link>
                                        {!isChildModeEnabled &&
                                            <Nav.Link as={Link} to="/cart"
                                                      className="d-flex align-items-center custom-black-text">
                                                <FontAwesomeIcon icon={faCartShopping} className="me-2"/> Корзина
                                            </Nav.Link>
                                        }
                                        <Nav.Link as={Link} to="/notifications"
                                                  className="d-flex align-items-center custom-black-text">
                                            <FontAwesomeIcon icon={faBell} className="me-2"/> Уведомления
                                            {notificationCount > 0 && (
                                                <Badge bg="danger" text="dark"
                                                       className="ms-2">{notificationCount}</Badge>
                                            )}
                                        </Nav.Link>
                                        <Nav.Item className="mt-3">
                                            <Button variant="outline-danger" onClick={handleLogout}
                                                    style={{width: '100%'}}>
                                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2"/> Выйти
                                            </Button>
                                        </Nav.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavLink as={Link} to="/login" className="custom-nav-link">
                                            <FontAwesomeIcon icon={faUser} className="me-2"/> Авторизация
                                        </NavLink>
                                        <NavLink as={Link} to="/register" className="custom-nav-link">
                                            <FontAwesomeIcon icon={faUser} className="me-2"/> Регистрация
                                        </NavLink>
                                    </>
                                )}
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            )}
        </>
    );
};

export default Header;
