import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Modal, Spinner} from 'react-bootstrap';
import * as APIService from '../Utils/APIService';
import {useNavigate} from 'react-router-dom';
import Header from "../Components/Header";
import MyAlert from "../Components/MyAlert";
import validator from "validator";
import * as VKID from '@vkid/sdk';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);
    const [showReset, setShowReset] = useState(false);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        VKID.Config.set({
            app: 51934140,
            redirectUrl: 'https://backlogshop.ru/vkAuth',
            state: 'dj29fnsadjsd82' //было dj29fnsadjsd82, стало dj29dfsagfsd23
        });

        const oneTap = new VKID.OneTap();
        const container = document.getElementById('VkIdSdkOneTap');
        if (container) {
            oneTap.render({container: container, scheme: VKID.Scheme.LIGHT, lang: VKID.Languages.RUS});
        }
    }, []);


    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
        validateField(name, value);
    };


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
            default:
                break;
        }
        setErrors(prev => ({...prev, [name]: error}));
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const formErrors = Object.keys(formData).map(key => validateField(key, formData[key]));
        if (formErrors.every(error => !error) && Object.values(formData).every(value => value.trim() !== '')) {
            setLoading(true);
            try {
                const response = await APIService.authenticate(formData);
                if (response.success && response.message.includes("2FA")) {
                    navigate(`/two-factor-auth/${formData.username}`);
                } else {
                    localStorage.setItem('username', response.username);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('isChildModeEnabled', JSON.stringify(response.isChildModeEnabled));

                    navigate('/');
                }
            } catch (error) {
                setErrorResponse(error.message);
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Header/>
            <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                <div className="w-100" style={{maxWidth: "400px"}}>
                    <Form onSubmit={handleLogin} className="p-4 shadow-lg rounded">
                        <h2 className="text-center mb-4">Авторизация</h2>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Введите логин"
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Введите пароль"
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-3"
                                disabled={loading || Object.values(errors).some(value => value !== '')}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status"
                                                aria-hidden="true"/> : "Войти"}
                        </Button>
                    </Form>
                </div>
                <MyAlert show={showAlert} variant={successResponse ? "success" : "danger"}
                         handleHide={() => {
                             setShowAlert(false)
                         }} message={successResponse ? successResponse : errorResponse}
                         header={"Уведомление"}/>
            </Container>
        </>
    );
};

export default LoginPage;
