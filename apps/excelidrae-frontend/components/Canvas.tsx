"use client"
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import { BarButton } from "./BarButton";
import { FaRegCircle, FaRegSquare } from "react-icons/fa";
import { Bar } from "./Bar";
import { GiStraightPipe } from "react-icons/gi";
import { GoDash } from "react-icons/go";
import ColorIcon from "./ColorIcon";
import Pallate from "./Pallate";
import { IoText } from "react-icons/io5";
import { BiMove } from "react-icons/bi";
import { BsDiamond } from "react-icons/bs";

export type Tool = "circle" | "rect" | "pencil" | "line" | "text" | "move" | "diamond";
export type Color = "red-500" | "green-500" | "blue-500" | "white";

export function Canvas({
    socket,
    roomId
} : {
    socket: WebSocket
    roomId: string;
}) {
    const [selectColor, setselectColor] = useState<Color>("white")
    const [selected, setSelected] = useState<Tool>("circle");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();

    useEffect( () => {
        game?.setTool(selected);
        game?.setColor(selectColor);
    }, [selectColor, selected, game]);

    useEffect(()=> { //In dev mode effects run two times the destroy function is to destroy one instance of the class otherwise it causes problem .... The problem is that out of two instances one classes gets the default tool selected circle and other gets what we select sqare therefore on making a square a circle was also being rendered (now solved)
        if(canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g);

            return () => { //Cleanup function
                g.destroy();
            }
        }

    }, [canvasRef, roomId, socket]); 

    return <div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Bar>
            <BarButton onClick={() => {
                setSelected("rect")
            }} activate={selected === "rect"} icon = {<FaRegSquare className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("circle")
            }} activate={selected === "circle"} icon = {<FaRegCircle className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("diamond")
            }} activate={selected === "diamond"} icon = {<BsDiamond  className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("pencil")
            }} activate={selected === "pencil"} icon = {<GiStraightPipe  className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("line")
            }} activate={selected === "line"} icon = {<GoDash  className="size-6"/>}></BarButton>
            <BarButton onClick={() => {
                setSelected("text")
            }} activate={selected === "text"} icon = {<IoText  className="size-6"/>}></BarButton> 
            <BarButton onClick={() => {
                setSelected("move")
            }} activate={selected === "move"} icon = {<BiMove  className="size-6"/>}></BarButton> 
             
        </Bar>
        <Pallate>
            <ColorIcon onClick = {
                () => { setselectColor("red-500")
            }} activate = { selectColor === "red-500" }  color="red-500"></ColorIcon>
            <ColorIcon onClick = {
                () => { setselectColor("green-500")
            }}  activate = { selectColor === "green-500" }   color="green-500"></ColorIcon>
            <ColorIcon onClick = {
                () => { setselectColor("blue-500")
            }}  activate = { selectColor === "blue-500" }   color="blue-500"></ColorIcon>
            <ColorIcon onClick = {
                () => { setselectColor("white")
            }}  activate = { selectColor === "white" }   color="white"></ColorIcon>
        </Pallate>
    </div>
}