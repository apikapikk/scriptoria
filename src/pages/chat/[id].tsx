import styles from './ChatDetail.module.css';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";
import Cookies from "js-cookie";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const ChatDetail = () => {
  const router = useRouter();
  const { id: receiverId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (cookie) {
      setUser(JSON.parse(cookie));
    }
  }, []);

  useEffect(() => {
    if (!user || !receiverId || typeof receiverId !== "string") return;

    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMessage = payload.new as Message;

        if (
          (newMessage.sender_id === user?.id && newMessage.receiver_id === receiverId) ||
          (newMessage.sender_id === receiverId && newMessage.receiver_id === user?.id)
        ) {
          setMessages((prev) => {
            if (!prev.some(msg => msg.id === newMessage.id)) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      })
      .subscribe();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, receiverId]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [messages]);


  const handleSendMessage = async () => {
    if (input.trim() && user && receiverId && typeof receiverId === "string") {
      if (isSending) return;

      setIsSending(true);

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: input,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setInput("");
      }

      setIsSending(false);
    }
  };

  if (!user) return <div>Loading...</div>;
  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatOuterContainer}>
        <div className={styles.header}>Chat</div>
  
        <div ref={chatContainerRef} className={styles.chatContainer}>
          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${message.sender_id === user.id ? styles.sentWrapper : styles.receivedWrapper}`}
              >
                <div className={`${styles.message} ${message.sender_id === user.id ? styles.sent : styles.received}`}>
                  <div className={styles.senderName}>
                    {message.sender_id === user.id ? "You" : "Other"}
                  </div>
                  <div className={styles.content}>
                    {message.content}
                  </div>
                  <div className={styles.timestamp}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default ChatDetail;
