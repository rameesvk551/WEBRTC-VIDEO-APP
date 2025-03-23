import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as UUIDV4 } from "uuid";
import { addPeerAction, removePeerAction } from "../actions/peerActions";
import { peerReducer } from "../reducers/peerReducer";


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
    
    // State for the local user
    const [user, setUser] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // State for other peers in the call
    const [peers, dispatch] = useReducer(peerReducer, {});

    // Fetch user video/audio stream
    const fetchUserFeed = async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(userStream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    useEffect(() => {
        const userId = UUIDV4();
        const newPeer = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp",
        });

        setUser(newPeer);
        fetchUserFeed();

        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        socket.on("room-created", enterRoom);

        return () => {
            socket.off("room-created", enterRoom);
        };
    }, []);

    useEffect(() => {
        if (!user || !stream) return;

        socket.on("user-joined", ({ peerId }) => {
            console.log("User joined:", peerId);

            const call = user.call(peerId, stream);
            call.on("stream", (remoteStream) => {
                console.log("Receiving stream from:", peerId);
                dispatch(addPeerAction(call.peer, remoteStream));
            });

            call.on("close", () => {
                console.log("Call closed with:", peerId);
                dispatch(removePeerAction(peerId));
            });
        });

        user.on("call", (call) => {
            console.log("Receiving call from:", call.peer);
            call.answer(stream);

            call.on("stream", (remoteStream) => {
                console.log("Adding stream from peer:", call.peer);
                dispatch(addPeerAction(call.peer, remoteStream));
            });

            call.on("close", () => {
                console.log("Call closed from peer:", call.peer);
                dispatch(removePeerAction(call.peer));
            });
        });

        socket.emit("ready");

        return () => {
            socket.off("user-joined");
            user.off("call");
        };
    }, [user, stream]);

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    );
};
