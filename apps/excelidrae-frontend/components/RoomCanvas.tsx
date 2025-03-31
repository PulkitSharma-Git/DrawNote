"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMTUwMTQxZC1mYTFiLTQ5M2ItYmJhMC1lNTE2ZjFjYmZjNGIiLCJpYXQiOjE3Mzk1NDE1MzJ9.Z4iu2o8kLdnAwwQZ1bacPJBPC0cvVryAL6B1rZAYGPQ`)

        ws.onopen = () => {
            setSocket(ws);

            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
        
    }, [roomId])

    if(!socket) {
        return <div>
            Connceting to server....
        </div>
    }

    return <div> 
        <Canvas roomId = {roomId} socket = {socket} />
    </div>
    //Put canvas on the screen with a reference on it and useEffect with canvasRef in dependency array

}