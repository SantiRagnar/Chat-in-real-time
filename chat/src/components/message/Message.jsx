import './message.css';
import { format } from "timeago.js";

export default function Message({ message,own}) {
    return (
        <div className={own ? 'message own': "message"}>
            <div className="messageButton">{format(message.createdAt)}</div>
            <div className="messageTop">
                <img className='massageImg' src="" alt=""></img>
                <p className='messageText'>
                    {message.text}
                </p>
            </div>
            
        </div>
    )
}
