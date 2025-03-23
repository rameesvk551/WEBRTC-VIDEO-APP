import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import UserFeedLayer from "../components/UserFeedLayer";

const Room: React.FC = () => {
    const { id } = useParams();
    const { socket, user, stream, peers } = useContext(SocketContext);

    useEffect(() => {
        if (user && socket) {
            socket.emit("joined-room", { roomId: id, peerId: user.id });
        }
    }, [id, user, socket]);

    return (
        <div>
            <h1>Your Own Feed</h1>
            <UserFeedLayer stream={stream} />
            <div>
                <h2>Other Users' Feeds</h2>
                {Object.keys(peers).map((peerId) => (
                    <UserFeedLayer stream={peers[peerId].stream} key={peerId} />
                ))}
            </div>
        </div>
    );
};

export default Room;
