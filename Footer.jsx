import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
           
            <p>Where cravings take flight, a digital feast in sight.
Order with grace, at your own pace, flavors delivered to your space.
Swift and secure, delicious allure, your culinary wishes, we ensure.
From kitchens grand, to your own hand, the finest tastes across the land.
YAD delights, morning through nights, satisfying every appetite.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-123-456-7890</li>
                <li>contact@yad.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © yad.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
