import { Link } from 'react-router';
import './authStyles.css'

export default function Register(){
    return(
        <div className="auth-container">
            <div className="auth-content">
                <span>Register to TaskMaster</span>
                <form action="POST">
                    <div className="input-row">
                        <input type="text" name="firstName" id="firstName-input" placeholder="First name"/>
                        <input type="text" name="lastName" id="lastName-input" placeholder="Last name"/>
                    </div>
                    <input type="email" name="email" id="email-input" placeholder="Email"/>
                    <input type="password" name="password" id="password-input" placeholder="Password"/>
                    <input type="confirmPassword" name="confirmPassword" id="confirmPassword-input" placeholder="Confirm password"/>
                    <button type="submit" id="submit-btn">Register</button>
                </form>
                <Link to={'/user/login'}>
                    <button id="login-btn" >You alreay have an account?</button>
                </Link>
            </div>
        </div>
    );
}