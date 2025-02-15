import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);

    console.log(existingShapes)

    if (!ctx) {
        return
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, canvas, ctx);
        }
    }
    

    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.clientX
        startY = e.clientY
    })

     

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            
            //Logic to select shapes
            const selected = window.selected;
            if( selected === "rect") {
                ctx.strokeRect(startX, startY, width, height);
            } else if(selected === "circle") {
                const radius = Math.max(height, width) / 2 ;
                const centerX = startX +  radius;
                const centerY = startY +  radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI*2);
                ctx.stroke();
                ctx.closePath();

            } else if(selected === "pencil") {

            }
        }
    })            
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") { 
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        }else if(shape.type === "circle") {
            console.log(shape.radius)
            ctx.beginPath();

            if(shape.radius === -21) {
                console.log("Ye -21 aaya kaha se ?")
            }else {
                ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI*2); 
            }
            ctx.stroke();
            ctx.closePath();
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}