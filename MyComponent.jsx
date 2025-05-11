import React, { useContext, useState } from 'react';
import { StoreContext } from './StoreContext';

function MyComponent() {
  const { 
    food_list, 
    addToCart, 
    registerUser, 
    loginUser, 
    token, 
    logoutUser, 
    addFood, 
    removeFood, 
    getOrderList, 
    getUserOrders, 
    updateOrderStatus 
  } = useContext(StoreContext);

  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: null,
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [orderStatusUpdate, setOrderStatusUpdate] = useState({ orderId: '', status: '' });

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerUser(registerName, registerEmail, registerPassword);
    if (result.success) {
      alert("Registration successful!");
      // Optionally redirect or clear form
    } else {
      alert("Registration failed: " + result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(loginEmail, loginPassword);
    if (result.success) {
      alert("Login successful!");
      // Optionally redirect or update UI
    } else {
      alert("Login failed: " + result.message);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    const result = await addFood(newFood);
    if (result.success) {
      alert("Food added successfully!");
      setNewFood({ name: '', description: '', price: 0, category: '', image: null });
    } else {
      alert("Failed to add food: " + result.message);
    }
  };

  const handleRemoveFood = async (id) => {
    const result = await removeFood(id);
    if (result.success) {
      alert("Food removed successfully!");
    } else {
      alert("Failed to remove food: " + result.message);
    }
  };

  const handleGetOrderList = async () => {
    const result = await getOrderList();
    if (result.success) {
      console.log("Order List:", result.data);
      alert("Order list fetched. Check console.");
      // Display order list
    } else {
      alert("Failed to fetch order list: " + result.message);
    }
  };

  const handleGetUserOrders = async () => {
    const result = await getUserOrders();
    if (result.success) {
      console.log("User Orders:", result.data);
      alert("User orders fetched. Check console.");
      // Display user orders
    } else {
      alert("Failed to fetch user orders: " + result.message);
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    const result = await updateOrderStatus(orderStatusUpdate.orderId, orderStatusUpdate.status);
    if (result.success) {
      alert("Order status updated!");
    } else {
      alert("Failed to update order status: " + result.message);
    }
  };

  if (!token) {
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input placeholder="Name" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
          <input type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
          <button type="submit">Register</button>
        </form>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Food List</h1>
      <ul>
        {food_list.map(food => (
          <li key={food._id}>
            {food.name} - {food.price}
            <button onClick={() => handleAddToCart(food._id)}>Add to Cart</button>
            <button onClick={() => handleRemoveFood(food._id)}>Remove Food</button>
          </li>
        ))}
      </ul>

      <h2>Add New Food</h2>
      <form onSubmit={handleAddFood}>
        <input placeholder="Name" value={newFood.name} onChange={e => setNewFood({ ...newFood, name: e.target.value })} required />
        <input placeholder="Description" value={newFood.description} onChange={e => setNewFood({ ...newFood, description: e.target.value })} required />
        <input type="number" placeholder="Price" value={newFood.price} onChange={e => setNewFood({ ...newFood, price: parseFloat(e.target.value) })} required />
        <input placeholder="Category" value={newFood.category} onChange={e => setNewFood({ ...newFood, category: e.target.value })} required />
        <input type="file" accept="image/*" onChange={e => setNewFood({ ...newFood, image: e.target.files[0] })} />
        <button type="submit">Add Food</button>
      </form>

      <h2>Order Management</h2>
      <button onClick={handleGetOrderList}>Get All Orders</button>
      <button onClick={handleGetUserOrders}>Get My Orders</button>
      <form onSubmit={handleUpdateOrderStatus}>
        <input placeholder="Order ID" value={orderStatusUpdate.orderId} onChange={e => setOrderStatusUpdate({ ...orderStatusUpdate, orderId: e.target.value })} required />
        <input placeholder="New Status" value={orderStatusUpdate.status} onChange={e => setOrderStatusUpdate({ ...orderStatusUpdate, status: e.target.value })} required />
        <button type="submit">Update Order Status</button>
      </form>
    </div>
  );
}

export default MyComponent;