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
    points: {x: number, y: number}[];
} | {
    type: "diamond";
    color: string;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
}

/** Axis-aligned bounding box for any shape */
type Bounds = { x: number; y: number; width: number; height: number };

const HANDLE_SIZE = 10; // px in canvas space

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

    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;
    public onZoomChange?: (zoom: number) => void;

    // --- Select / Move / Resize state ---
    private selectedShapeIndex: number | null = null;
    private activeHandle: "nw" | "ne" | "se" | "sw" | "body" | null = null;
    private dragOffsetX = 0;
    private dragOffsetY = 0;
    private lastDragX = 0;
    private lastDragY = 0;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler);
    }

    setZoom(scale: number) {
        const oldScale = this.scale;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.offsetX = centerX - (centerX - this.offsetX) * (scale / oldScale);
        this.offsetY = centerY - (centerY - this.offsetY) * (scale / oldScale);
        this.scale = scale;
        if (this.onZoomChange) this.onZoomChange(this.scale);
        this.clearCanvas();
    }

    getTransformedPoint(x: number, y: number) {
        return {
            x: (x - this.offsetX) / this.scale,
            y: (y - this.offsetY) / this.scale
        };
    }

    setTool(tool: Tool) {
        this.selected = tool;
        if (tool !== "select") {
            this.selectedShapeIndex = null;
            this.activeHandle = null;
            this.clearCanvas();
        }
        if (tool === "circle" || tool === "pencil" || tool === "rect" || tool === "line" || tool === "diamond") {
            this.canvas.style.cursor = "crosshair";
        } else if (tool === "eraser") {
            this.canvas.style.cursor = "cell";
        } else if (tool === "select") {
            this.canvas.style.cursor = "default";
        } else {
            this.canvas.style.cursor = "pointer";
        }
    }

    setColor(color: "red-500" | "blue-500" | "green-500" | "white") {
        this.selectedColor = color;
    }

    // ─── Bounding box ───────────────────────────────────────────────────────────

    getShapeBounds(shape: Shape): Bounds {
        switch (shape.type) {
            case "rect":
                return {
                    x: shape.width >= 0 ? shape.x : shape.x + shape.width,
                    y: shape.height >= 0 ? shape.y : shape.y + shape.height,
                    width: Math.abs(shape.width),
                    height: Math.abs(shape.height)
                };
            case "circle":
                return {
                    x: shape.centerX - Math.abs(shape.radius),
                    y: shape.centerY - Math.abs(shape.radius),
                    width: Math.abs(shape.radius) * 2,
                    height: Math.abs(shape.radius) * 2
                };
            case "line":
                return {
                    x: Math.min(shape.startX, shape.endX),
                    y: Math.min(shape.startY, shape.endY),
                    width: Math.abs(shape.endX - shape.startX),
                    height: Math.abs(shape.endY - shape.startY)
                };
            case "diamond":
                return {
                    x: shape.centerX - shape.width / 2,
                    y: shape.centerY - shape.height / 2,
                    width: shape.width,
                    height: shape.height
                };
            case "text":
                return {
                    x: shape.startX,
                    y: shape.startY,
                    width: shape.text.length * Number(shape.size) * 0.6,
                    height: Number(shape.size) + 10
                };
            case "pencil": {
                const xs = shape.points.map(p => p.x);
                const ys = shape.points.map(p => p.y);
                const minX = Math.min(...xs);
                const minY = Math.min(...ys);
                return {
                    x: minX,
                    y: minY,
                    width: Math.max(...xs) - minX,
                    height: Math.max(...ys) - minY
                };
            }
        }
    }

    // ─── Hit testing ────────────────────────────────────────────────────────────

    hitTest(shape: Shape, px: number, py: number): boolean {
        const tol = 8;
        switch (shape.type) {
            case "rect": {
                const b = this.getShapeBounds(shape);
                return (
                    px >= b.x - tol && px <= b.x + b.width + tol &&
                    py >= b.y - tol && py <= b.y + b.height + tol &&
                    !(px > b.x + tol && px < b.x + b.width - tol &&
                      py > b.y + tol && py < b.y + b.height - tol)
                );
            }
            case "circle": {
                const dist = Math.hypot(px - shape.centerX, py - shape.centerY);
                return Math.abs(dist - Math.abs(shape.radius)) <= tol;
            }
            case "line": {
                const dx = shape.endX - shape.startX;
                const dy = shape.endY - shape.startY;
                const len = Math.hypot(dx, dy);
                if (len === 0) return Math.hypot(px - shape.startX, py - shape.startY) <= tol;
                const t = Math.max(0, Math.min(1, ((px - shape.startX) * dx + (py - shape.startY) * dy) / (len * len)));
                const nearX = shape.startX + t * dx;
                const nearY = shape.startY + t * dy;
                return Math.hypot(px - nearX, py - nearY) <= tol;
            }
            case "diamond": {
                const halfW = shape.width / 2;
                const halfH = shape.height / 2;
                const dx = Math.abs(px - shape.centerX);
                const dy = Math.abs(py - shape.centerY);
                const edgeTol = tol / Math.min(halfW, halfH);
                return (dx / halfW + dy / halfH) <= 1 + edgeTol;
            }
            case "text": {
                const b = this.getShapeBounds(shape);
                return px >= b.x - tol && px <= b.x + b.width + tol &&
                       py >= b.y - tol && py <= b.y + b.height + tol;
            }
            case "pencil": {
                for (let i = 1; i < shape.points.length; i++) {
                    const a = shape.points[i - 1];
                    const b = shape.points[i];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const len = Math.hypot(dx, dy);
                    if (len === 0) continue;
                    const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (len * len)));
                    const nearX = a.x + t * dx;
                    const nearY = a.y + t * dy;
                    if (Math.hypot(px - nearX, py - nearY) <= tol) return true;
                }
                return false;
            }
        }
    }

    // ─── Handle detection ───────────────────────────────────────────────────────

    getHandleAtPoint(px: number, py: number): "nw" | "ne" | "se" | "sw" | null {
        if (this.selectedShapeIndex === null) return null;
        const shape = this.existingShapes[this.selectedShapeIndex];
        const b = this.getShapeBounds(shape);
        const hs = HANDLE_SIZE / this.scale;
        const handles: { id: "nw" | "ne" | "se" | "sw"; hx: number; hy: number }[] = [
            { id: "nw", hx: b.x,           hy: b.y               },
            { id: "ne", hx: b.x + b.width, hy: b.y               },
            { id: "se", hx: b.x + b.width, hy: b.y + b.height    },
            { id: "sw", hx: b.x,           hy: b.y + b.height    },
        ];
        for (const h of handles) {
            if (Math.abs(px - h.hx) <= hs && Math.abs(py - h.hy) <= hs) return h.id;
        }
        return null;
    }

    // ─── Shape mutation ──────────────────────────────────────────────────────────

    moveShape(index: number, dx: number, dy: number) {
        const shape = this.existingShapes[index];
        switch (shape.type) {
            case "rect":    shape.x += dx; shape.y += dy; break;
            case "circle":  shape.centerX += dx; shape.centerY += dy; break;
            case "line":    shape.startX += dx; shape.startY += dy; shape.endX += dx; shape.endY += dy; break;
            case "diamond": shape.centerX += dx; shape.centerY += dy; break;
            case "text":    shape.startX += dx; shape.startY += dy; break;
            case "pencil":  shape.points = shape.points.map(p => ({ x: p.x + dx, y: p.y + dy })); break;
        }
    }

    resizeShape(index: number, handle: "nw" | "ne" | "se" | "sw", dx: number, dy: number) {
        const shape = this.existingShapes[index];
        switch (shape.type) {
            case "rect": {
                const right  = shape.x + shape.width;
                const bottom = shape.y + shape.height;
                if (handle === "nw") { shape.x += dx; shape.y += dy; shape.width -= dx; shape.height -= dy; }
                if (handle === "ne") { shape.y += dy; shape.width = right - shape.x + dx; shape.height -= dy; }
                if (handle === "se") { shape.width = right - shape.x + dx; shape.height = bottom - shape.y + dy; }
                if (handle === "sw") { shape.x += dx; shape.width -= dx; shape.height = bottom - shape.y + dy; }
                break;
            }
            case "circle": {
                const grow = handle === "se" || handle === "ne" ? dx : -dx;
                const newR = Math.abs(shape.radius) + grow / 2;
                if (newR > 5) shape.radius = newR;
                break;
            }
            case "diamond": {
                if (handle === "nw") { shape.width = Math.max(20, shape.width - dx * 2); shape.height = Math.max(20, shape.height - dy * 2); }
                if (handle === "ne") { shape.width = Math.max(20, shape.width + dx * 2); shape.height = Math.max(20, shape.height - dy * 2); }
                if (handle === "se") { shape.width = Math.max(20, shape.width + dx * 2); shape.height = Math.max(20, shape.height + dy * 2); }
                if (handle === "sw") { shape.width = Math.max(20, shape.width - dx * 2); shape.height = Math.max(20, shape.height + dy * 2); }
                break;
            }
            case "line": {
                if (handle === "nw" || handle === "sw") { shape.startX += dx; shape.startY += dy; }
                if (handle === "ne" || handle === "se") { shape.endX += dx; shape.endY += dy; }
                break;
            }
            case "pencil":
            case "text":
                this.moveShape(index, dx, dy);
                break;
        }
    }

    // ─── Init ───────────────────────────────────────────────────────────────────

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        });
    }

    // ─── Rendering ──────────────────────────────────────────────────────────────

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        this.existingShapes.forEach((shape) => {
            const color = colorCoder(shape.color, 1);

            if (shape.type === "rect") {
                this.ctx.strokeStyle = color;
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();

            } else if (shape.type === "text") {
                this.ctx.font = `${shape.size}px ${shape.font}`;
                this.ctx.fillStyle = color;
                this.ctx.textBaseline = "top";
                this.ctx.fillText(shape.text, shape.startX, shape.startY);
                this.ctx.textBaseline = "alphabetic"; // reset to default

            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                shape.points.forEach((point, index) => {
                    if (index === 0) this.ctx.moveTo(point.x, point.y);
                    else this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();

            } else if (shape.type === "diamond") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.moveTo(shape.centerX, shape.centerY - shape.height / 2);
                this.ctx.lineTo(shape.centerX + shape.width / 2, shape.centerY);
                this.ctx.lineTo(shape.centerX, shape.centerY + shape.height / 2);
                this.ctx.lineTo(shape.centerX - shape.width / 2, shape.centerY);
                this.ctx.lineTo(shape.centerX, shape.centerY - shape.height / 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });

        // Draw selection highlight + handles
        if (this.selectedShapeIndex !== null && this.existingShapes[this.selectedShapeIndex]) {
            const b = this.getShapeBounds(this.existingShapes[this.selectedShapeIndex]);
            const pad = 6;
            const bx = b.x - pad;
            const by = b.y - pad;
            const bw = b.width + pad * 2;
            const bh = b.height + pad * 2;

            this.ctx.save();
            this.ctx.strokeStyle = "#6366f1";
            this.ctx.lineWidth = 1.5 / this.scale;
            this.ctx.setLineDash([6 / this.scale, 3 / this.scale]);
            this.ctx.strokeRect(bx, by, bw, bh);
            this.ctx.setLineDash([]);
            this.ctx.restore();

            const hs = HANDLE_SIZE / this.scale;
            const corners = [
                { x: bx,      y: by      },
                { x: bx + bw, y: by      },
                { x: bx + bw, y: by + bh },
                { x: bx,      y: by + bh },
            ];
            this.ctx.save();
            for (const c of corners) {
                this.ctx.fillStyle = "#ffffff";
                this.ctx.strokeStyle = "#6366f1";
                this.ctx.lineWidth = 1.5 / this.scale;
                this.ctx.fillRect(c.x - hs / 2, c.y - hs / 2, hs, hs);
                this.ctx.strokeRect(c.x - hs / 2, c.y - hs / 2, hs, hs);
            }
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    // ─── Mouse Handlers ──────────────────────────────────────────────────────────

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;

        if (this.selected === "move") {
            this.startX = e.clientX;
            this.startY = e.clientY;
            return;
        }

        const point = this.getTransformedPoint(e.clientX, e.clientY);
        this.startX = point.x;
        this.startY = point.y;
        this.lastDragX = point.x;
        this.lastDragY = point.y;

        if (this.selected === "select") {
            const handle = this.getHandleAtPoint(point.x, point.y);
            if (handle) {
                this.activeHandle = handle;
                return;
            }

            let found = false;
            for (let i = this.existingShapes.length - 1; i >= 0; i--) {
                if (this.hitTest(this.existingShapes[i], point.x, point.y)) {
                    this.selectedShapeIndex = i;
                    this.activeHandle = "body";
                    const b = this.getShapeBounds(this.existingShapes[i]);
                    this.dragOffsetX = point.x - b.x;
                    this.dragOffsetY = point.y - b.y;
                    found = true;
                    break;
                }
            }

            if (!found) {
                this.selectedShapeIndex = null;
                this.activeHandle = null;
            }

            this.clearCanvas();
            return;
        }

        if (this.selected === "eraser") {
            this.eraseAtPoint(point.x, point.y);
            return;
        }

        if (this.selected === "pencil") {
            this.currentPencilStroke = { type: "pencil", color: this.selectedColor, points: [{ x: this.startX, y: this.startY }] };
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        if (this.selected === "move") return;

        if (this.selected === "select") {
            if (this.activeHandle && this.selectedShapeIndex !== null) {
                const shape = this.existingShapes[this.selectedShapeIndex];
                this.socket.send(JSON.stringify({
                    type: "update",
                    message: JSON.stringify({ index: this.selectedShapeIndex, shape }),
                    roomId: this.roomId
                }));
            }
            this.activeHandle = null;
            return;
        }

        if (this.selected === "eraser") return;

        const point = this.getTransformedPoint(e.clientX, e.clientY);
        const width = point.x - this.startX;
        const height = point.y - this.startY;

        const selected = this.selected;
        let shape: Shape | null = null;

        if (selected === "rect") {
            shape = { type: "rect", x: this.startX, y: this.startY, height, width, color: this.selectedColor };

        } else if (selected === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = { type: "circle", radius, centerX: this.startX + radius, centerY: this.startY + radius, color: this.selectedColor };

        } else if (selected === "line") {
            shape = { type: "line", startX: this.startX, startY: this.startY, endX: this.startX + width, endY: this.startY + height, color: this.selectedColor };

        } else if (selected === "diamond") {
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            shape = { type: "diamond", centerX, centerY, width: Math.abs(width), height: Math.abs(height), color: this.selectedColor };

        } else if (selected === "text") {
            const FONT_SIZE = 25;
            const FONT_FAMILY = "Arial";

            const screenX = this.startX * this.scale + this.offsetX;
            const screenY = this.startY * this.scale + this.offsetY;

            // div[contenteditable] has zero internal padding unlike textarea,
            // so its text top aligns exactly with canvas textBaseline="top"
            const div = document.createElement("div");
            div.contentEditable = "true";
            div.style.cssText = [
                "position:fixed",
                `left:${screenX}px`,
                `top:${screenY}px`,
                `font-size:${FONT_SIZE * this.scale}px`,
                `font-family:${FONT_FAMILY}`,
                `line-height:${FONT_SIZE * this.scale}px`,
                `color:${colorCoder(this.selectedColor, 1)}`,
                `caret-color:${colorCoder(this.selectedColor, 1)}`,
                "background:transparent",
                "border:none",
                "outline:none",
                "padding:0",
                "margin:0",
                "min-width:2px",
                "white-space:pre",
                "cursor:text",
                "z-index:9999",
            ].join(";");

            document.body.appendChild(div);
            div.focus();

            const startX = this.startX;
            const startY = this.startY;
            let committed = false;

            const commit = () => {
                if (committed) return;
                committed = true;
                const text = (div.textContent ?? "").trim();
                if (document.body.contains(div)) document.body.removeChild(div);
                if (!text) return;
                const shape: Shape = {
                    type: "text", startX, startY,
                    font: FONT_FAMILY, size: String(FONT_SIZE),
                    color: this.selectedColor, text,
                };
                this.existingShapes.push(shape);
                this.clearCanvas();
                this.socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape }), roomId: this.roomId }));
            };

            div.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); commit(); }
                if (ev.key === "Escape") { committed = true; if (document.body.contains(div)) document.body.removeChild(div); }
            });

            div.addEventListener("blur", commit);

        } else if (selected === "pencil") {
            if (this.currentPencilStroke) {
                this.existingShapes.push(this.currentPencilStroke);
                this.socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape: this.currentPencilStroke }), roomId: this.roomId }));
                this.currentPencilStroke = null;
            }
        }

        if (shape && selected !== "text") {
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({ type: "chat", message: JSON.stringify({ shape }), roomId: this.roomId }));
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            if (this.selected === "move") {
                this.offsetX += e.clientX - this.startX;
                this.offsetY += e.clientY - this.startY;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.clearCanvas();
                return;
            }

            const point = this.getTransformedPoint(e.clientX, e.clientY);
            const dx = point.x - this.lastDragX;
            const dy = point.y - this.lastDragY;
            this.lastDragX = point.x;
            this.lastDragY = point.y;

            if (this.selected === "select" && this.selectedShapeIndex !== null && this.activeHandle) {
                if (this.activeHandle === "body") {
                    this.moveShape(this.selectedShapeIndex, dx, dy);
                } else {
                    this.resizeShape(this.selectedShapeIndex, this.activeHandle, dx, dy);
                }
                this.clearCanvas();
                return;
            }

            if (this.selected === "eraser") {
                this.eraseAtPoint(point.x, point.y);
                return;
            }

            const width = point.x - this.startX;
            const height = point.y - this.startY;

            this.clearCanvas();
            this.ctx.save();
            this.ctx.translate(this.offsetX, this.offsetY);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.strokeStyle = colorCoder(this.selectedColor, 1);
            const selected = this.selected;

            if (selected === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);

            } else if (selected === "circle") {
                const radius = Math.max(height, width) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (selected === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(this.startX + width, this.startY + height);
                this.ctx.stroke();

            } else if (selected === "diamond") {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY - Math.abs(height) / 2);
                this.ctx.lineTo(centerX + Math.abs(width) / 2, centerY);
                this.ctx.lineTo(centerX, centerY + Math.abs(height) / 2);
                this.ctx.lineTo(centerX - Math.abs(width) / 2, centerY);
                this.ctx.lineTo(centerX, centerY - Math.abs(height) / 2);
                this.ctx.stroke();
                this.ctx.closePath();

            } else if (selected === "pencil") {
                this.currentPencilStroke?.points.push({ x: point.x, y: point.y });
                this.ctx.beginPath();
                this.currentPencilStroke?.points.forEach((p, index) => {
                    if (index === 0) this.ctx.moveTo(p.x, p.y);
                    else this.ctx.lineTo(p.x, p.y);
                });
                this.ctx.stroke();
            }

            this.ctx.restore();
        } else {
            if (this.selected === "select") {
                const point = this.getTransformedPoint(e.clientX, e.clientY);
                const handle = this.getHandleAtPoint(point.x, point.y);
                if (handle === "nw" || handle === "se") {
                    this.canvas.style.cursor = "nwse-resize";
                } else if (handle === "ne" || handle === "sw") {
                    this.canvas.style.cursor = "nesw-resize";
                } else if (this.selectedShapeIndex !== null &&
                           this.hitTest(this.existingShapes[this.selectedShapeIndex], point.x, point.y)) {
                    this.canvas.style.cursor = "move";
                } else {
                    this.canvas.style.cursor = "default";
                }
            }
        }
    }

    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            const newScale = Math.min(Math.max(0.1, this.scale - e.deltaY * 0.002), 5);
            this.setZoom(newScale);
        } else {
            this.offsetX -= e.deltaX;
            this.offsetY -= e.deltaY;
            this.clearCanvas();
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", this.wheelHandler, { passive: false });
    }

    // ─── Eraser ─────────────────────────────────────────────────────────────────

    private eraseAtPoint(px: number, py: number) {
        const indexToRemove = [...this.existingShapes].reverse()
            .findIndex(shape => this.hitTest(shape, px, py));

        if (indexToRemove !== -1) {
            const actualIndex = this.existingShapes.length - 1 - indexToRemove;
            this.existingShapes.splice(actualIndex, 1);
            if (this.selectedShapeIndex === actualIndex) {
                this.selectedShapeIndex = null;
            } else if (this.selectedShapeIndex !== null && this.selectedShapeIndex > actualIndex) {
                this.selectedShapeIndex--;
            }
            this.clearCanvas();
        }
    }
}