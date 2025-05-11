import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [serveByDelivery, setServeByDelivery] = useState(false);

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handlePromoCodeSubmit = () => {
    // Implement promo code logic here
    console.log("Promo code submitted:", promoCode);
  };

  const handleServeByDeliveryChange = (e) => {
    setServeByDelivery(e.target.checked);
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee=0.5;
  const ServingFee = serveByDelivery && subtotal > 0 ? deliveryCharge : 0;
  const total = subtotal + deliveryFee+ServingFee;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.filter(item => cartItems[item._id] > 0).map(item => (
          <div key={item._id}>
            <div className="cart-items-title cart-items-item">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{currency}{item.price}</p>
              <div>{cartItems[item._id]}</div>
              <p>{currency}{item.price * cartItems[item._id]}</p>
              <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
            </div>
            <hr />
          </div>
        ))}
        {food_list.every(item => cartItems[item._id] === 0) && (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="serve-delivery-option" style={{marginBottom: '10px'}}>
            <label>
              <input 
                type="checkbox" 
                checked={serveByDelivery} 
                onChange={handleServeByDeliveryChange} 
              />{' '}
              Serve by delivery agents (Additional charge applies)
            </label>
          </div>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{subtotal}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{deliveryFee}</p></div>
            <hr />
          <div className="cart-total-details"><p>Serving Fee Fee</p><p>{currency}{ServingFee}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{total}</b></div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='promo code' 
                value={promoCode} 
                onChange={handlePromoCodeChange} 
              />
              <button onClick={handlePromoCodeSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

