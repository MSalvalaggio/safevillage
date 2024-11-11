import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Admin.css';

function Admin() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'No date'
      }));
      setMessages(msgs);
    };

    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true
      });
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link to="/admin/products" className="admin-link">
          Manage Products
        </Link>
        {/* Add more admin links here as needed */}
      </div>
      <div className="admin-messages">
        <h2>Messages</h2>
        <div className="messages-grid">
          {messages.map(message => (
            <div key={message.id} className={`message-card ${!message.read ? 'unread' : ''}`}>
              <div className="message-header">
                <h3>{message.name}</h3>
                <span className="message-date">{message.timestamp}</span>
              </div>
              <div className="message-content">
                <p><strong>Email:</strong> {message.email}</p>
                <p>{message.message}</p>
              </div>
              {!message.read && (
                <button onClick={() => markAsRead(message.id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;