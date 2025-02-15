"use client";
import { FaRegCircle, FaRegSquare } from "react-icons/fa";
import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { BarButton } from "./BarButton";
import { Bar } from "./Bar";
import { GiStraightPipe } from "react-icons/gi";

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
        
    }, [])



    if(!socket) {
        return <div>
            Connceting to server....
        </div>
    }
    return <div> 
        <Canvas roomId = {roomId} socket = {socket} />
        <BarButton icon = {<FaRegSquare className="size-6"/>}></BarButton>
        <Bar>
            <BarButton onClick={() => {
                console.log("clicked")
            }} activate={true} icon = {<FaRegSquare className="size-6"/>}></BarButton>
            <BarButton activate={true} icon = {<FaRegCircle className="size-6"/>}></BarButton>
            <BarButton activate={true} icon = {<GiStraightPipe  className="size-6"/>}></BarButton>
        </Bar>
        

    </div>
    //Put canvas on the screen with a reference on it and useEffect with canvasRef in dependency array

}