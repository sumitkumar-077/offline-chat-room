import React from 'react'
import { useState, useRef } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import useChatContext from '../context/ChatContext.jsx';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper.js';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService.js';
import { getTimeAgo } from '../config/helper.js';



const ChatPage = () => {

    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!connected) {
            navigate('/');
        }
    }, [connected, roomId, currentUser]);


    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);


    //page init:
    //message ko load krne honge


    useEffect(() => {
        async function loadMessages() {

            try {

                const messages = await getMessages(roomId);
                //console.log(messages);
                setMessages(messages);

            } catch (error) {
                console.log(error);
            }
        }
        if (connected) {
            loadMessages();
        }
    }, []);

    //scroll down
    useEffect(() => {

        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }

    }, [messages]);


    //stompClient ko init karne honge
    //subscribe krna hoga

    useEffect(() => {

        const connectWebSocket = () => {
            //sockJS 
            const sock = new SockJS(`${baseURL}/chat`);

            const client = Stomp.over(sock);
            client.connect({}, () => {
                setStompClient(client);
                toast.success("connected");
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);

                    //rest of the work after success receiving the message
                });


            });

        };

        if (connected) {
            connectWebSocket();
        }

        //stompclient
    }, [roomId])


    //send message handle  

 
    const sendMessage = () => {
        if (stompClient && connected && input.trim()) {
            console.log(input);

            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            }

            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput('');
            //
        }
    };

function handleLogout() {
    stompClient.disconnect()
    setConnected(false);
    setRoomId('');
    setCurrentUser('');
    navigate('/');
}


return (
    <div className="">
        {/* header  */}
        <header className="flex justify-around fixed w-full h-20 items-center p-4 bg-gray-200 dark:bg-gray-900 py-5">
            {/* room name */}
            <div>
                <h1 className="text-xl font-semibold">
                    Room: <span>{roomId}</span>
                </h1>
            </div>
            {/* username container */}
            <div>
                <h1 className="text-xl font-semibold">
                    User: <span>{currentUser}</span>
                </h1>
            </div>
            {/* button: leave room */}
            <div>
                <button onClick={handleLogout} className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full">Leave Room</button>
            </div>
        </header>

        {/* chat container */}
        <main ref={chatBoxRef} className="pt-20 pb-24 w-2/3 px-5 dark:bg-gray-600 mx-auto h-screen overflow-y-auto">
            {
                messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                        <div className={`my-2 ${message.sender === currentUser ? "bg-green-800" : "bg-purple-800"} p-2 rounded max-w-xs`}>

                            <div className='flex flex-row gap-4 w-60'>
                                <img className='h-10 w-10' src={'https://avatar.shifaul.dev/random'} alt="" />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm font-bold'>{message.sender}</p>
                                    <p>{message.content}</p>
                                    <p className="text-xs text-gray-400">{getTimeAgo(message.timestamp)}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            }
        </main>


        {/* input message container */}
        <div className="fixed bottom-4 w-full h-16">
            <div className=" h-full gap-4 flex items-center justify-between pr-10 rounded-full w-1/2 mx-auto dark:bg-gray-900">
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    type="text" placeholder="Type your message here..." className=" h-full px-4 py-2 rounded-full w-full dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <div className="flex gap-3">
                    <button className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full dark:hover:bg-purple-700">
                        <MdAttachFile size={20} />
                    </button>
                    <button onClick={sendMessage} className="dark:bg-green-700 h-10 w-10 flex justify-center items-center rounded-full dark:hover:bg-green-800">
                        <MdSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
)
};

export default ChatPage;