import React from "react"
import {Link} from "react-router-dom";

export default function SignHeader() {
    return (
        <header>
            <ul className="d-inline ls-none m-20">
                <li><Link to="/">Landing</Link></li>
            </ul>
        </header>

    );
}