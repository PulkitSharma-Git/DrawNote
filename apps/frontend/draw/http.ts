import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages || [];

    const shapes = [];
    for (const x of messages) {
      try {
        const messageData = JSON.parse(x.message);
        if (messageData && messageData.shape) {
          shapes.push(messageData.shape);
        }
      } catch (e) {
        // Ignored: not a serialized shape JSON (e.g. standard chat message)
      }
    }

    return shapes;
  } catch (error) {
    console.error("Failed to load existing shapes:", error);
    return [];
  }
}

