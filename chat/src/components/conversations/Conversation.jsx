import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css';

export default function Conversation({conversation ,currentUser}) {
const [user,setUser] = useState();

    useEffect(()=>{
        const user = conversation.members.find((m)=>m !== currentUser._id)
        const getUser = async ()=>{
            try{
                const res = await axios("/users?userId=" + user);
                setUser(res.data)
            }catch(err){
                console.log(err);
            }
        };
        getUser()
    }, [currentUser, conversation]);

    return (
        <div className="conversacion">
            <img className='conversacionImg' src='' alt=''></img>
            <span className='conversacionNom'>{user?.username}</span>
        </div>
    )
}
