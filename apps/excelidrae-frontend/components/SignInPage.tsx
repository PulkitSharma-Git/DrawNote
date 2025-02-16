"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef } from "react";

export function SignInPage() {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function onClickHandler() {
        if(emailRef.current && passwordRef.current) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;


            const response = await axios.post(`${HTTP_BACKEND}/signin`, {
                email,
                password
            })

            //here redirect to room making page using the token from response in headers

            alert(response.data.token)
        }

    }

    return <div className="flex items-center justify-center">
       <input type="text" placeholder="email" />
       <input type="text" placeholder="password" />
       <button onClick={onClickHandler}>Sign In</button>
    </div>
}