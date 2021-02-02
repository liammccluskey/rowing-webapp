import React from "react"
import {Link} from "react-router-dom";

export default function LandingHeader() {
    return (
        <header>
            <ul className="d-inline ls-none m-20">
                <li><Link to="/">Landing</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </header>

    );
}