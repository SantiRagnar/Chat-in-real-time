import './chat.css';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import {io} from "socket.io-client";
import logo1 from '../../assets/psh_brand.png';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setarrivalMessage] = useState("");    
    const socket = useRef();
    const {user} = useContext(AuthContext);
    const scrollRef = useRef();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(()=>{
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data =>{
            setarrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, []);

    useEffect(()=>{
        arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    },[arrivalMessage, currentChat])

    useEffect(()=>{
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users=>{
            console.log(users)
        })
    },[user]);

    useEffect(()=>{
        const getConversations = async ()=>{
            try{
                const res = await axios.get("/conversations/"+ user._id);
                setConversations(res.data);
            }catch(err){
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(()=>{
        const getMessages = async () => {
        try{
            const res = await axios.get("/messages/" + currentChat?._id);
            setMessages(res.data);
        }catch(err){
            console.log(err);
        }
        };
        getMessages();
    },[currentChat]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

    const receiverId = currentChat.members.find(member=> member !==user._id)

    socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage
    })

        try{
            const res = await axios.post("/messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    return (
        <div className="chat">
            <div className="chatMenu">
                <div className="chatTop">
                    <img src={logo1} className="chatLogo"/>
                    <label className="chatTopTitle">React Chat</label>
                </div>
                <div className="chatUser" > 
                    <img className="" src={user.profilePicture || PF+"person/NoFoto.jpeg"}></img>
                    <span>{user.username}</span>
                </div>
                <hr />          
                <div className="chatMenuWrapper">
                    <div className="chatContactos">Contactos</div>    
                {conversations.map((c)=>(
                    <div onClick={()=>setCurrentChat(c)}>
                    <Conversation conversation={c} currentUser={user}/>
                    </div>
                ))}
                
                
                </div>
            </div>
            <div className="chatBox">
                <div className="chatUser">
                <img className="" src={user.profilePicture || PF+"person/NoFoto.jpeg"}></img>
                <span>{user?.username}</span>
                </div>
                
                <div className="chatBoxWrapper">
                    {
                        currentChat ?
                    <>
                    <div className="chatBoxTop">
                    {messages.map((m)=>(
                        <div ref={scrollRef}>
                        <Message  message={m} own={m.sender === user._id}/>
                        </div>
                    ))}
                    
                    </div>
                    <div className="chatBoxButtom">
                        <textarea 
                        classname="chatMessageinput"
                        placeholder="Type your message.."
                        onChange={(e)=>setNewMessage(e.target.value)}
                        value={newMessage}
                        >

                        </textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>SEND</button>
                    </div></> : <span className="noConversationText"></span>}
                </div>
            </div>
        </div>
    )
}
