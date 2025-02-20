import { Color, Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
import { colorCoder } from "./colorCoder";


type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
} | {
    type: "text";
    text: string;
    startX: number;
    startY: number;
    size: string;
    font: string;
    color: string;
} | {
    type: "pencil";
    color: string;
    points: {x: number, y: number}[] //An array of (x, y) coordinates, storing every point where the user moves the mouse.
}


export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0; 
    private selected: Tool = "circle";
    private selectedColor: Color = "red-500";
    private currentPencilStroke: { type: "pencil"; color: string; points: { x: number; y: number }[] } | null = null;
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false; 
        this.ctx = canvas.getContext("2d")!; //The "! tells the compiler that i am sure this the ctx will be obtained it will not be null (idelly there should be a if condition for checking null)"
        this.existingShapes = []; //Empty in start
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
         
    }

    setTool(tool: "circle" | "pencil" | "rect" | "line" | "text" ) {
        this.selected = tool;

        if (tool === "circle" || tool === "pencil" || tool === "rect" || tool === "line") {
            this.canvas.style.cursor = "crosshair";
        } else {
            this.canvas.style.cursor = "pointer";
        }
    }

    setColor(color: "red-500" | "blue-500" | "green-500" | "white") {
        this.selectedColor = color;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas();

    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() { //Clears and Re-Renders whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            const color = colorCoder(shape.color, 1);

        if (shape.type === "rect") { 
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        }else if(shape.type === "circle") {
            console.log(shape.radius)
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;

            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI*2);  // -21 raduis wala error haldeled by making the raduis positive even if its negative
            this.ctx.stroke();
            this.ctx.closePath();

        }else if(shape.type === "line") {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(shape.startX, shape.startY);
            this.ctx.lineTo(shape.endX, shape.endY);
            this.ctx.stroke();
        }else if(shape.type === "text"){
            this.ctx.font = `${shape.size}px ${shape.font}`; //"50px Arial"
            this.ctx.fillStyle = color;
            this.ctx.fillText(`${shape.text}`, shape.startX, shape.startY +27); //this.ctx.fillText("Hello World",10,80);
        }else if(shape.type === "pencil"){
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            shape.points.forEach((point, index) => { //Iterate and print all coordinates (prints lines between)
                if (index === 0) this.ctx.moveTo(point.x, point.y);
                else this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.stroke();

        }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY

        if(this.selected === "pencil") { //Since clicked is also true means user is drawing
            this.currentPencilStroke = { type: "pencil",color: this.selectedColor, points: [{ x: this.startX, y: this.startY }] }; //Push start point of drawing in array
        }
      
    }
    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        
        const selected  = this.selected;
        let shape: Shape|null = null;

        if(selected === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width,
                color: this.selectedColor
            }
            
        }else if(selected === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: Math.max(width, height) /2,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                color: this.selectedColor
            }
        }else if(selected === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: this.startX+width,
                endY: this.startY+height,
                color: this.selectedColor
            }
        }else if(selected === "text") {

            const input = document.createElement("input");
            input.type = "text";
            input.style.position = "absolute";
            input.style.left = `${this.startX}px`;
            input.style.top = `${this.startY}px`;
            input.style.fontSize = "25px";
            input.style.background = "transparent"
            input.style.color = colorCoder(this.selectedColor, 1); 
            input.style.caretColor = colorCoder(this.selectedColor, 1);
            input.style.border = "none";
            input.style.outline = "none";

            document.body.appendChild(input);
            input.focus();

            const startX = this.startX;
            const startY = this.startY;


            input.addEventListener("blur", () => {
                const text = input.value;

                shape = {
                    type: "text",
                    startX,
                    startY,
                    font: "Arial",
                    size: "25",
                    color: this.selectedColor,
                    text: text
                }

                
                //this.drawTextOnCanvas(input.value, x, y);
                document.body.removeChild(input);
                //Draw on the canvas
                this.ctx.font = `${shape.size}px ${shape.font}`; //"50px Arial"
                this.ctx.fillStyle = colorCoder(this.selectedColor, 1);
                this.ctx.fillText(`${shape.text}`, shape.startX , shape.startY + 27);

                if (shape) { //Push for the text right in here since shape becomes null outside the block why? have to figure out
                    this.existingShapes.push(shape);
    
                    this.socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify({ shape }),
                        roomId: this.roomId
                    }));
                }

            });
        }else if(selected === "pencil") {
            if (this.currentPencilStroke) {
                this.existingShapes.push(this.currentPencilStroke); //Push coordinates array into shapes 
                this.socket.send(JSON.stringify({ //Relay to othe ws connections
                    type: "chat",
                    message: JSON.stringify({ shape: this.currentPencilStroke }),
                    roomId: this.roomId
                }));
                this.currentPencilStroke = null; // Reset after finishing stroke
            }
        }

        console.log(shape)
        if(shape && selected !== "text" ) {
            console.log(this.existingShapes)
            this.existingShapes.push(shape);
            console.log(this.existingShapes)
           
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: this.roomId
            }))
        }
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = colorCoder(this.selectedColor, 1);
            const selected = this.selected;

            if( selected === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);

            } else if(selected === "circle") {
                const radius = Math.max(height, width) / 2 ;
                const centerX = this.startX +  radius;
                const centerY = this.startY +  radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI*2); // -21 raduis wala error haldeled by making the raduis positive even if its negative
                this.ctx.stroke();
                this.ctx.closePath();

            } else if(selected === "line") {
                const endX = this.startX+width;
                const endY = this.startY+height;

                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();

            } else if(selected === "pencil") {
                this.currentPencilStroke?.points.push({ x: e.clientX, y: e.clientY });
            
                this.clearCanvas(); // Clears and re-renders
                this.ctx.beginPath();
                this.ctx.strokeStyle = colorCoder(this.selectedColor, 1);
                this.currentPencilStroke?.points.forEach((point, index) => {
                    if (index === 0) this.ctx.moveTo(point.x, point.y);
                    else this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
            }
        }

    }
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}