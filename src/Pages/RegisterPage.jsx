import React, {useState} from 'react';
import {Button, Container, Form} from 'react-bootstrap';
import * as APIService from '../Utils/APIService';
import {useNavigate} from 'react-router-dom';
import Header from "../Components/Header";
import validator from 'validator';
import MyAlert from "../Components/MyAlert";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        username: '',
        password: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (!validator.isAlphanumeric(value, 'en-US')) {
                    error = 'Логин должен содержать только английские буквы и цифры';
                }
                break;
            case 'password':
                if (!validator.isStrongPassword(value, {
                    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
                })) {
                    error = 'Пароль должен быть длиннее 8 символов и содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ';
                }
                break;
            case 'patronymic':
                if (value && !validator.matches(value, /^[A-Za-zА-Яа-яЁё\s-]+$/)) {
                    error = 'Должно содержать только буквы';
                }
                break;
            case 'firstName':
            case 'lastName':
                if (!validator.matches(value, /^[A-Za-zА-Яа-яЁё\s-]+$/)) {
                    error = 'Должно содержать только буквы';
                }
                break;
            case 'email':
                if (!validator.isEmail(value)) {
                    error = 'Некорректный email';
                }
                break;
            default:
                break;
        }
        setErrors(prev => ({...prev, [name]: error}));
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
        validateField(name, value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        const formErrors = Object.keys(formData).map(key => validateField(key, formData[key]));
        if (formErrors.every(error => !error) && Object.values(formData).every(value => value.trim() !== '')) {

            setLoading(true);
            try {
                const response = await APIService.register(formData);
                if (response.success) {
                    navigate('/login');
                } else {
                    alert(response.message);
                }
            } catch (error) {
                setErrorResponse(error.message);
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        } else {

        }
    };

    return (
        <>
            <Header/>
            <div className="registration-page">
                <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                    <div className="w-100" style={{maxWidth: "400px"}}>
                        <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded">
                            <h2 className="text-center mb-4">Регистрация</h2>
                            <Form.Group controlId="formFirstName" className="mb-3">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите имя"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formLastName" className="mb-3">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите фамилию"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPatronymic" className="mb-3">
                                <Form.Label>Отчество (необязательно)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите отчество"
                                    name="patronymic"
                                    value={formData.patronymic}
                                    onChange={handleChange}
                                    isInvalid={!!errors.patronymic}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.patronymic}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formUsername" className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите логин"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    isInvalid={!!errors.username}
                                /><Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Введите пароль"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Введите email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button disabled={loading || Object.values(errors).some(value => value !== '')}
                                    variant="primary" type="submit" className="w-100">
                                Зарегистрироваться
                            </Button>
                        </Form>
                    </div>
                    <MyAlert show={showAlert} variant={"danger"} handleHide={() => setShowAlert(false)}
                             message={errorResponse} header={"Уведомление"}/>
                </Container>
            </div>
        </>
    );
};

export default RegisterPage;
