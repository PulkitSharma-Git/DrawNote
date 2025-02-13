import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxODJkZmRkZS1lYWMxLTQ1NDgtODZjZC00ZGMxMjg4OTI1Y2QiLCJpYXQiOjE3Mzk0NDYwODV9.dxrb7caJgm44Ffs6oO-Hpm3QPhAxsmg7dcNXcJdEGXw`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}