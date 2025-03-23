import { log } from "console";
import { Socket } from "socket.io";
import {v4 as UUIDV4} from 'uuid'
import IRoomParams from "../interfaces/IroomParams";

const rooms:Record<string,string[]>={}


const roomHandler =(socket:Socket)=>{
    const createRoom=()=>{
        const roomId=UUIDV4()//create room id in witch multiple connection exchage data
socket.join(roomId)// we will make the socket connection enter a new room
rooms[roomId] = []
socket.emit("room-created",{roomId})// we will emit an event from server side that socket connection has been added to a room
    console.log("room created succssfully ",roomId);
    
}


    const joinedRoom =({roomId,peerId}:IRoomParams)=>{
        console.log("new uer joined home",roomId,"user id",peerId);
        if(rooms[roomId]){
            //if the given room id exist in memmery db
            console.log("ne member joined in room id : ",  roomId, "with peerId as :",peerId)
            rooms[roomId].push(peerId)
            socket.join(roomId) // make  the user to join the socket room


            socket.emit("get-users",{roomId,patrticipants:rooms[roomId]})

        }
        
        
        

    }

    // when we will call above two functions ?
    // we will all the above two functions when the client emit an event to create room and join room
socket.on("create-room",createRoom)
socket.on("joined-room",joinedRoom)

}


export default roomHandler