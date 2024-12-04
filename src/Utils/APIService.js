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

const verifyTwoFactorCode = (twoFactorData) => {
    return fetchWithToken('/verifyTwoFactorCode', 'POST', twoFactorData);
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

const addToCart = (data) => {
    return fetchWithToken(`/cart/addToCart`, 'POST', data, true);
};

const removeFromCart = (productId) => {
    return fetchWithToken(`/cart/removeFromCart/${productId}`, 'DELETE', null, true);
};

const reduceProductQuantityInCart = (productId) => {
    return fetchWithToken(`/cart/reduceProductQuantityInCart/${productId}`, 'POST', null, true);
};

const increaseProductQuantityInCart = (productId) => {
    return fetchWithToken(`/cart/increaseProductQuantityInCart/${productId}`, 'POST', null, true);
};

const getProductById = (id) => {
    return fetchWithToken(`/products/get/${id}`, 'GET');
};

const updateReview = (data) => {
    return fetchWithToken(`/products/updateReview`, 'PUT', data, true);
};

const deleteReview = (reviewId) => {
    return fetchWithToken(`/products/deleteReview/${reviewId}`, 'DELETE', null, true);
};

const createReview = (data) => {
    return fetchWithToken(`/products/createReview`, 'POST', data, true);
};

const getAllCategories = () => {
    return fetchWithToken('/products/categories', 'GET');
};

const getShoppingCart = () => {
    return fetchWithToken('/user/getShopCart', 'GET', null, true);
};

const getOrdersByUser = (username) => {
    return fetchWithToken(`/order/byUser?username=${username}`, 'GET', null, true);
};

const getPaymentMethods = () => {
    return fetchWithToken(`/order/getPaymentMethods`, 'GET', null, true);
};

const getShippingMethods = () => {
    return fetchWithToken(`/order/getShippingMethods`, 'GET', null, true);
};

const getStores = () => {
    return fetchWithToken(`/order/getStore`, 'GET', null, true);
};

const createOrder = (data) => {
    return fetchWithToken(`/order/create`, 'POST', data, true);
};

const exchangeToken = (data) => {
    return fetchWithToken('/exchangeSilentAuthToken', 'POST', data, false);
};

const getNotifications = () => {
    return fetchWithToken('/notifications/', 'GET', null, true);
};

const getNewNotifications = () => {
    return fetchWithToken('/notifications/new', 'GET', null, true);
};

const getDeposit = () => {
    return fetchWithToken('/user/deposit', 'GET', null, true);
};

const getUserInfo = () => {
    return fetchWithToken('/user/getUserInfo', 'GET', null, true);
};

const changePassword = (data) => {
    return fetchWithToken('/user/changePassword', 'POST', data, true);
};

const changeSettings = (data, parameter) => {
    const path = getSettingsPath(parameter);
    return fetchWithToken('/user/' + path, 'POST', data, true);
};

const containsInCart = (productId) => {
    return fetchWithToken(`/user/containsInCart/${productId}`, 'GET', null, true);
};

const checkingForReviewUser = (productId) => {
    return fetchWithToken(`/user/checkingForReview/${productId}`, 'GET', null, true);
};

const changeUserData = (data) => {
    return fetchWithToken('/user/changeUserData', 'POST', data, true);
};

const readNotification = (noitificationId) => {
    return fetchWithToken(`/notifications/read/${noitificationId}`, 'POST', null, true);
};

const topUpDeposit = (amount) => {
    return fetchWithToken(`/user/topUpDeposit?amount=${amount}`, 'POST', null, true);
};

const resetPassword = (email) => {
    return fetchWithToken(`/resetPassword?email=${email}`, 'POST', null, false);
};


const getSettingsPath = (parameter) => {
    switch (parameter) {
        case "twoFactorEnabled":
            return "settingTwoFactorAuth";
        case "areNotificationsEnabled":
            return "settingNotifications";
        case "isChildModeEnabled":  // Предполагая, что это правильный параметр
            return "settingChildMode";
        default:
            throw new Error("Unsupported setting parameter");
    }
};

export {
    resetPassword,
    getSortProductsByPrice,
    getProductsBySearch,
    getStores,
    topUpDeposit,
    checkingForReviewUser,
    getNewNotifications,
    readNotification,
    containsInCart,
    changeUserData,
    changeSettings,
    changePassword,
    getUserInfo,
    getDeposit,
    getNotifications,
    createOrder,
    getShippingMethods,
    getPaymentMethods,
    getOrdersByUser,
    createReview,
    deleteReview,
    updateReview,
    register,
    authenticate,
    verifyTwoFactorCode,
    getPageProducts,
    getShoppingCart,
    exchangeToken,
    getAllCategories,
    getProductsByCategory,
    getProductById,
    addToCart,
    removeFromCart,
    reduceProductQuantityInCart,
    increaseProductQuantityInCart
};
