import { createContext } from 'react';
import { io } from 'socket.io-client';

const WS_SERVER = "http://localhost:3000";

const SocketContext = createContext<any | null>(null);
const socket = io(WS_SERVER, {
    transports: ["websocket", "polling"],  // 🔹 Ensures proper connection
    withCredentials: true,
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
