import React, { useContext, useEffect, useState } from "react";
import { useVoiceToText } from "react-speakup";
import { ChatContext } from "./ChatContext";
import BACKEND_URL from "./config";
import speak from "./speak";
import "./App.css";
import hospitalImage from "./assets/hospital.jpg";
import muteImage from "./assets/Mute.png";
import unmuteImage from "./assets/Unmute.png";

// const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();

// recognition.continous = true
// recognition.lang = 'en-US'
const SpeechToText = () => {
    const { startListening, stopListening, transcript } = useVoiceToText({
        continuous: false,
    });
    const { chat, setChat } = useContext(ChatContext);
    const [isBotSpeaking, setIsBotSpeaking] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        speak(
            "Hello, Thanks for calling Dr. Joe's office. How may I assist you?"
        );
        setIsBotSpeaking(!isBotSpeaking);
    }, []);

    const handleStart = () => {
        setIsVisible(!isVisible);
        startListening();
    }

    const handleRequest = () => {
        stopListening();
        setIsVisible(!isVisible);
        setIsBotSpeaking(!isBotSpeaking);
        let updatedChat = chat + "USER - " + transcript;
        console.log(updatedChat);
        setChat(updatedChat);
        let apiUrl = BACKEND_URL + "chat";
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                chat: updatedChat,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                let botResponse = response.botReply.substring(
                    response.botReply.indexOf("BOT - ")
                );
                speak(botResponse.substring(6));
                // console.log(botReply);
                if (
                    response["botReply"].toUpperCase().includes("ERROR") ||
                    response["botReply"].toUpperCase().includes("BYE")
                ) {
                    window.location.reload();
                } else {
                    setChat((chat) => chat + botResponse);
                    setIsBotSpeaking(!isBotSpeaking);
                }
            });
    };

    return (
        <div id="container">
            <div id="hospital-profile">
                <img src={hospitalImage} alt="hospital" id="profile" />
            </div>
            {isVisible ? (
                <button onClick={handleStart} className="toggle-button">
                    <img src={muteImage} alt='unmute'/>
                </button>
            ) : (
                <button onClick={handleRequest} className="toggle-button">
                    <img src={unmuteImage} alt='mute'/>
                </button>
            )}
            <br />
            <span>Please mute the mic after replying</span>
        </div>
    );
};

export default SpeechToText;
