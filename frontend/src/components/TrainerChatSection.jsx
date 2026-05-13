import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TrainerChatSection({ trainerSlug, trainerName }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // 1. Fetch Students & Filter by Trainer Name or Slug
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/messages");
        if (res.data.success) {
          // Check both trainerName (string) and trainerAssigned (slug) to be safe
          const myStudents = res.data.messages.filter(m => 
            m.trainerAssigned === trainerSlug || m.trainerName === trainerName
          );
          
          const unique = {};
          myStudents.forEach(s => { if(!unique[s.userId]) unique[s.userId] = s; });
          setStudents(Object.values(unique));
        }
      } catch (err) { console.error("Fetch Students Error:", err); }
    };
    fetchStudents();
  }, [trainerSlug, trainerName]);

  // 2. Load History
  useEffect(() => {
    if (selectedStudent) {
      axios.get(`http://localhost:5000/api/messages/history/${trainerSlug}/${selectedStudent.userId}`)
        .then(res => setMessages(res.data.messages))
        .catch(err => console.log(err));
    }
  }, [selectedStudent, trainerSlug]);

  const handleSend = async () => {
    if (!reply.trim()) return;
    const payload = {
      trainerName: trainerName, 
      trainerAssigned: trainerSlug,
      userId: selectedStudent.userId,
      senderName: "Admin (" + trainerName + ")",
      senderRole: "trainer",
      content: reply
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages/send", payload);
      if (res.data.success) {
        setMessages([...messages, res.data.message]);
        setReply("");
      }
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  return (
    <div className="row mt-3 rounded shadow-lg overflow-hidden" style={{ height: '65vh', background: '#1a1a1a', border: '1px solid #333' }}>
      <div className="col-md-4 border-end border-secondary overflow-auto p-0" style={{ background: '#111' }}>
        <div className="bg-dark p-3 border-bottom border-secondary">
          <h6 className="text-success m-0">Assigned Students</h6>
        </div>
        {students.length === 0 && <p className="p-3 text-muted">No students found for this trainer.</p>}
        {students.map(s => (
          <div key={s._id} onClick={() => setSelectedStudent(s)} 
               className={`p-3 border-bottom border-secondary ${selectedStudent?.userId === s.userId ? 'bg-success text-white' : 'text-light'}`}
               style={{ cursor: 'pointer', transition: '0.2s' }}>
            <strong>{s.senderName}</strong>
            <div className="small text-muted">User ID: {s.userId.substring(0,8)}...</div>
          </div>
        ))}
      </div>
      <div className="col-md-8 d-flex flex-column p-0">
        <div className="flex-grow-1 overflow-auto p-4">
          {messages.map(m => (
            <div key={m._id} className={`d-flex mb-3 ${m.senderRole === 'trainer' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-2 px-3 rounded-pill shadow-sm ${m.senderRole === 'trainer' ? 'bg-success text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '75%' }}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        {selectedStudent && (
          <div className="p-3 bg-dark border-top border-secondary d-flex">
            <input 
              className="form-control bg-black text-white border-secondary" 
              value={reply} 
              onChange={e => setReply(e.target.value)}
              placeholder={`Reply to ${selectedStudent.senderName}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn btn-success ms-2 px-4" onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}