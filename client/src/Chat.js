import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagelist, setMessagelist] = useState([]);
  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send-message", messageData);
      setMessagelist((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessagelist((list) => [...list, data]);
    });
  }, [socket]);
  return (
    <div className="chat-window">
      <div className="chat-header">Live chat</div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messagelist.map((messagecontent) => {
            return (
              <div
                className="message"
                id={username === messagecontent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messagecontent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="author">{messagecontent.author}</p>
                    <p id="time">{messagecontent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="input a message"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
