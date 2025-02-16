"use client"

import { HTTP_BACKEND } from "@/config";
import axios, { AxiosError } from "axios";
import { useRef } from "react"
import { useRouter } from "next/navigation";

export function SignUpPage() {
    const router = useRouter()
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function onClickHandler() {
        if (nameRef.current && emailRef.current && passwordRef.current) {
            const name = nameRef.current.value;
            const username = emailRef.current.value;
            const password = passwordRef.current.value;
    
            try {
                const response = await axios.post(`${HTTP_BACKEND}/signup`, {
                    name,
                    username,
                    password
                });
    
                console.log("Response received:", response.data);
                alert(response.data.userId);
                
                setTimeout(() => router.push("/signin"), 1000);
    
            } catch (error) {
                console.error("Signup failed:", error);
                const err = error as AxiosError;
                const errorMessage = (err.response?.data as { message: string })?.message || "Unknown error";
                alert("Signup failed: " + errorMessage);
                setTimeout(() => router.push("/signin"), 1000);
            }
        } else {
            alert("Please fill all the fields");
        }
    }
    




    return <div className="w-screen h-screen flex items-center justify-center bg-orange-100">
        <div className="p-2 m-2 bg-white rounded flex flex-col gap-8 bg-blue-400">

            <input ref={nameRef} type="text" placeholder="Name" />
            <input ref={emailRef} type="text" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="password" />

            <button onClick={() => {
                console.log("Click hua bhai")
                onClickHandler()
            }}>{"Sign up"}</button>
        </div>
        

    </div>
}