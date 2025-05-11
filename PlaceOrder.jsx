import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const location = useLocation();
    const { serveByDelivery: initialServeByDelivery = false, requireServingService: initialRequireServingService = false } = location.state || {};

    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryFee, ServingFee } = useContext(StoreContext);
    const navigate = useNavigate();

    // Maintain delivery options state from navigation or default to false
    const [serveByDelivery] = useState(initialServeByDelivery);
    const [requireServingService] = useState(initialRequireServingService);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let subtotal = getTotalCartAmount();
        let totalAmount = subtotal;
        if (serveByDelivery && subtotal > 0) totalAmount += deliveryFee;
        if (requireServingService && subtotal > 0) totalAmount += ServingFee;

        let orderData = {
            address: data,
            items: orderItems,
            amount: totalAmount,
            serveByDelivery,
            requireServingService,
        };

        try {
            if (payment === "stripe") {
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                if (response.data.success) {
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                } else {
                    toast.error("Something Went Wrong");
                }
            } else {
                let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                } else {
                    toast.error("Something Went Wrong");
                }
            }
        } catch (error) {
            toast.error("Something Went Wrong");
            console.error(error);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    const subtotal = getTotalCartAmount();
    const deliveryFeeApplied =0.5;
    const servingFeeApplied = requireServingService && subtotal > 0 ? ServingFee : 0;
    const total = subtotal + deliveryFeeApplied + servingFeeApplied;

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{subtotal}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{deliveryFeeApplied}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Serving Fee</p><p>{currency}{servingFeeApplied}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{total}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="COD" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="Stripe" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    );
};

export default PlaceOrder;
