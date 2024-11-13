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

const getNewNotifications = () => {
    return fetchWithToken('/notifications/new', 'GET', null, true);
};

const getDeposit = () => {
    return fetchWithToken('/user/deposit', 'GET', null, true);
};

const getUserInfo = () => {
    return fetchWithToken('/user/getUserInfo', 'GET', null, true);
};

export {
    getNewNotifications,
    getUserInfo,
    getDeposit,
    register,
    authenticate
};
