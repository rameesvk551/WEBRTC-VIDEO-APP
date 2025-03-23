import Peer from "peerjs";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {v4 as UUIDV4} from 'uuid'
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
    // store user
    const [user,setUser]=useState<Peer>()
    const [stream,setStream]=useState<MediaStream>()

    const fetchParticipentList=({roomId,patrticipants}:{roomId:string,patrticipants:string})=>{
        console.log("fetchef pariciepents");
        console.log(roomId,patrticipants);
        
        
    }

    const fetchUserFeed = async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        setStream(stream)

    }
    useEffect(() => {
        const userId=UUIDV4()
        const newPeer= new Peer(userId)
        setUser(newPeer)
        fetchUserFeed()
        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        socket.on("room-created", enterRoom);
        socket.on("get-users",fetchParticipentList)

        return () => {
            socket.off("room-created", enterRoom);
        };
    }, []); 

    return <SocketContext.Provider value={{socket,user,stream}}>{children}</SocketContext.Provider>;
};
