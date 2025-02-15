"use client"
import { initDraw } from "@/draw";
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import { BarButton } from "./BarButton";
import { FaRegCircle, FaRegSquare } from "react-icons/fa";
import { Bar } from "./Bar";
import { GiStraightPipe } from "react-icons/gi";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
    socket,
    roomId
} : {
    socket: WebSocket
    roomId: string;
}) {

    const [selected, setSelected] = useState<Tool>("circle");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();

    useEffect( () => {
        game?.setTool(selected);
    }, [selected, game]);

    useEffect(()=> { //In dev mode effects run two times the destroy function is to destroy one instance of the class otherwise it causes problem .... The problem is that out of two instances one classes gets the default tool selected circle and other gets what we select sqare therefore on making a square a circle is also rendered
        if(canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g);

            return () => { //Cleanup function
                g.destroy();
            }
        }

    }, [canvasRef]); 

    return <div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <BarButton icon = {<FaRegSquare className="size-6"/>}></BarButton>
        <Bar>
            <BarButton onClick={() => {
                setSelected("rect")
            }} activate={selected === "rect"} icon = {<FaRegSquare className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("circle")
            }} activate={selected === "circle"} icon = {<FaRegCircle className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("pencil")
            }} activate={selected === "pencil"} icon = {<GiStraightPipe  className="size-6"/>}></BarButton>
        </Bar>
    </div>
}