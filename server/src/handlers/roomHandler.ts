import { Socket } from "socket.io";
import {v4 as UUIDV4} from 'uuid'
const roomHandler =(socket:Socket)=>{
    const createRoom=()=>{
        const roomId=UUIDV4()//create room id in witch multiple connection exchage data
socket.join(roomId)// we will make the socket connection enter a new room
socket.emit("room-created",{roomId})// we will emit an event from server side that socket connection has been added to a room
    console.log("room created succssfully ",roomId);
    
}


    const joinRoom =()=>{

    }

    // when we will call above two functions ?
    // we will all the above two functions when the client emit an event to create room and join room
socket.on("create-room",createRoom)
socket.on("join-room",joinRoom)

}


export default roomHandler