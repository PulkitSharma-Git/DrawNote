"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function SignInPage() {

    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function onClickHandler() {

        if(emailRef.current && passwordRef.current) {
            console.log("Idhar idhar")
   
            const email = emailRef.current.value;
            const password = passwordRef.current.value;

            console.log(email);
            console.log(password);


            const response = await axios.post(`${HTTP_BACKEND}/signin`, {
                username: email,
                password
            })

            const token = response.data.token;
            console.log(token);
            localStorage.setItem("token", token);
            router.push("/join");
        }

    }

    return <div className="flex items-center justify-center flex-col">
       <input ref = {emailRef} type="text" placeholder="email" />
       <input ref = {passwordRef} type="password" placeholder="password" />
       <button onClick={ () => { onClickHandler() }}>Sign In</button>
    </div>
}