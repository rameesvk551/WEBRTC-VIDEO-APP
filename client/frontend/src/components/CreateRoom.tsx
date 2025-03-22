import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {
    const socket = useContext(SocketContext); // No destructuring

    const createRoom = () => {
        console.log("creating rooom",socket);
        socket.emit("create-room");
    };

    return <button onClick={createRoom}>Start a new meeting in a new room</button>;
};

export default CreateRoom;
