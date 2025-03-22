import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const WS_SERVER = "http://localhost:3000";

export const SocketContext = createContext<any | null>(null);
const socket = io(WS_SERVER, {
    transports: ["websocket", "polling"],
    withCredentials: true,
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        socket.on("room-created", enterRoom);

        return () => {
            socket.off("room-created", enterRoom);
        };
    }, []); 

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
