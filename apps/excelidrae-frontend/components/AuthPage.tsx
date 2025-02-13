"use client"
export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return <div className="w-screen h-screen flex items-center justify-center">
        <div className="p-2 m-2 bg-white rounded flex flex-col gap-8 bg-blue-400">
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="password" />
            <button onClick={() => {

            }}>{isSignin? "Sign in" : "Sign up"}</button>
        </div>
    </div>
}