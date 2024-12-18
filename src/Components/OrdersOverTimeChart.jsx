import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const aggregateOrdersByMonth = (orders, startYear, endYear, selectedMonth) => {
    const ordersByDate = {};


    for (let year = startYear; year <= endYear; year++) {
        if (selectedMonth) {
            const monthIndex = selectedMonth.split('-')[1];
            const daysInMonth = new Date(year, monthIndex, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const key = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
                ordersByDate[key] = 0;
            }
        } else {
            for (let month = 1; month <= 12; month++) {
                const key = `${year}-${month.toString().padStart(2, '0')}`;
                ordersByDate[key] = 0;
            }
        }
    }


    orders.forEach(order => {
        const orderDate = order.creationDate;
        const key = selectedMonth ? orderDate.substring(0, 10) : orderDate.substring(0, 7);
        if (ordersByDate.hasOwnProperty(key)) {
            ordersByDate[key] += 1;
        }
    });

    return Object.keys(ordersByDate).map(date => ({
        date,
        orders: ordersByDate[date]
    })).sort((a, b) => a.date.localeCompare(b.date));
};

const OrdersOverTimeChart = ({ orders }) => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setData(aggregateOrdersByMonth(orders, currentYear, currentYear, selectedMonth));
    }, [orders, selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const monthOrDayFormatter = (dateStr) => {
        if (selectedMonth) {
            return parseInt(dateStr.split('-')[2], 10); // Показываем дни
        } else {
            const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
            return months[parseInt(dateStr.split('-')[1], 10) - 1]; // Показываем месяцы
        }
    };

    return (
        <div style={{ width: '100%', height: 300 }} className="mb-5">
            <h3><FontAwesomeIcon icon={faChartLine} /> Динамика заказов</h3>
            <select onChange={handleMonthChange} value={selectedMonth}>
                <option value="">Выбрать месяц</option>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={`${new Date().getFullYear()}-${(i + 1).toString().padStart(2, '0')}`}>
                        {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][i]}
                    </option>
                ))}
            </select>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={monthOrDayFormatter} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" name="Заказы" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersOverTimeChart;
