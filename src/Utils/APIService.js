// const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;
const API_BASE_URL = "http://localhost:8080";

const fetchWithToken = async (url, method, data = null, tokenRequired = false) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    if (tokenRequired) {
        const token = localStorage.getItem('token');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (data !== null) {
        config.body = JSON.stringify(data);
        console.log("Данные для отправки: " + data);
    }


    const fullUrl = `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, config);
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || 'Что-то пошло не так');
    }
    console.log("Полученные данные: " + responseData);
    return responseData;
};

const register = (userData) => {
    return fetchWithToken('/register', 'POST', userData);
};

const authenticate = (loginData) => {
    return fetchWithToken('/authenticate', 'POST', loginData);
};

const checkingForReviewUser = (productId) => {
    return fetchWithToken(`/user/checkingForReview/${productId}`, 'GET', null, true);
};

const getPageProducts = (page, size) => {
    return fetchWithToken('/products', 'GET');
};

const getProductsByCategory = (categoryId, page, size) => {
    return fetchWithToken(`/products/byCategory/${categoryId}?page=${page - 1}&size=${size}`, 'GET');
};

const getSortProductsByPrice = (categoryId, direction, page, size) => {
    return fetchWithToken(`/products/sortByPrice/${categoryId}?page=${page - 1}&size=${size}&direction=${direction}`, 'GET');
};

const getProductsBySearch = (name, categoryId, direction, page, size) => {
    return fetchWithToken(`/products/search/${categoryId}?name=${name}&page=${page - 1}&size=${size}&direction=${direction}`, 'GET');
};

const getProductById = (id) => {
    return fetchWithToken(`/products/get/${id}`, 'GET');
};

const getAllCategories = () => {
    return fetchWithToken('/products/categories', 'GET');
};

const getDeposit = () => {
    return fetchWithToken('/user/deposit', 'GET', null, true);
};

const getUserInfo = () => {
    return fetchWithToken('/user/getUserInfo', 'GET', null, true);
};

const topUpDeposit = (amount) => {
    return fetchWithToken(`/user/topUpDeposit?amount=${amount}`, 'POST', null, true);
};

export {
    getSortProductsByPrice,
    getProductsBySearch,
    topUpDeposit,
    getUserInfo,
    getDeposit,
    register,
    authenticate,
    getPageProducts,
    getAllCategories,
    getProductsByCategory,
    getProductById,
    checkingForReviewUser
};
