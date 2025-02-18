"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

import { useRef } from "react"
import { useRouter } from "next/navigation";

export default function Join() {
    const roomref = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function createRoomHandler() {
        if(roomref.current) {
            const token = localStorage.getItem("token");

            try{
                console.log(token)
                console.log(roomref.current.value)
                const response = await axios.post(`${HTTP_BACKEND}/room`, {
                    name: roomref.current.value
                }, {
                    headers: {
                        "authorization": token
                    }
                } );

                const roomId = response.data.roomId;
                console.log(roomId)
                router.push(`/canvas/${roomId}`);

            }catch(e) {
                console.log("failed to create room: ", e);
            }
        } else {
            alert("room name possibly null");
        }
        
    }



    return <div>
        <input ref = {roomref} type="text" placeholder="room-name"/>
        <button onClick={ () => createRoomHandler()}>Create room</button>
    </div>

}