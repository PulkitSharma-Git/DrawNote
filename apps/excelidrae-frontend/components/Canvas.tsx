import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({
    socket,
    roomId
} : {
    socket: WebSocket
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=> {

        if(canvasRef.current) {

            initDraw(canvasRef.current, roomId, socket);
            

        }


    }, [canvasRef]); 

    return <div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
}