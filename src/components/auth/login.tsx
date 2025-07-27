import './authStyles.css'

export default function Login(){
    return(
        <div className="auth-container">
            <div className="auth-content">
                <span>Welcome to Task Master</span>
                <form action="POST">
                    <input type="email" name="" id="input-email" placeholder="Email"/>
                    <input type="password" name="" id="input-password" placeholder="Password"/>
                    <button type="submit" id="submit-btn">Login</button>
                </form>
                <button id="register-btn">Register</button>
                <a href="#">Forgot password?</a>
            </div>
        </div>
    )
}