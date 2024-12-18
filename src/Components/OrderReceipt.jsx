import React, {forwardRef} from 'react';

const OrderReceipt = forwardRef(({ order, formatDate }, ref) => {
    return (
        <>
        {order &&
        <div ref={ref} className="receipt ms-3">
            <h2>Чек заказа</h2>
            <p><strong>ID заказа:</strong> {order.id}</p>
            <p><strong>Дата создания:</strong> {formatDate(order.creationDate) || 'Не завершён'}</p>
            <p><strong>Дата завершения:</strong> {formatDate(order.completionDate) || 'Не завершён'}</p>
            <p><strong>Статус:</strong> {order.status.description}</p>
            <p><strong>Способ оплаты:</strong> {order.paymentMethod.description}</p>
            <p><strong>Способ доставки:</strong> {order.shippingMethod.description}</p>
            <p><strong>Итого:</strong> {order.totalAmount?.toFixed(2)} руб.</p>
            <h3>Товары:</h3>
            <ul>
                {order.orderItems.map(item => (
                    <li key={item.id}>
                        {item.product.name} - {item.quantity} шт. по {item.product.price?.toFixed(2)} руб.
                    </li>
                ))}
            </ul>
        </div>
}
        </>
    );
});

export default OrderReceipt;