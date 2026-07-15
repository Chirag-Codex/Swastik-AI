import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbPill, TbTrash, TbFile, TbAlertTriangle, TbCamera, TbMicrophone, TbSend, TbX, TbMessage2, TbPlayerStop } from 'react-icons/tb';
import { sendMessage, sendMedia, clearChat } from '../redux/chat/Action';
import EmptyState from '../components/EmptyState';
import NotificationBell from '../components/NotificationBell';

function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Chat() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const chatEndRef = useRef(null);
  const photoInputRef = useRef(null);
  const recordTimerRef = useRef(null);

  // --- real audio capture ---
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordSeconds(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const handleSend = async () => {
    if (!input.trim() && !mediaFile) return;
    try {
      if (mediaFile) {
       
        await dispatch(sendMedia(mediaFile, input, mediaPreview));
        setMediaFile(null);
        setMediaPreview(null);
      } else {
        await dispatch(sendMessage(input));
      }
      setInput('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access your microphone. Please check browser permissions.');
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null; // discard, don't send
      mediaRecorderRef.current.stop();
    }
    stopStream();
    audioChunksRef.current = [];
    setIsRecording(false);
  };

  const handleStopAndSend = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setIsRecording(false);
      return;
    }

    recorder.onstop = async () => {
      stopStream();
      setIsRecording(false);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];

      const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

    
      const audioUrl = URL.createObjectURL(audioBlob);

      try {
        await dispatch(sendMedia(audioFile, input, audioUrl));
        setInput('');
      } catch (error) {
        console.error('Send voice message error:', error);
      }
    };

    recorder.stop();
  };

  const handleClearChat = () => {
    if (window.confirm('Clear chat history?')) {
      dispatch(clearChat());
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    if (isUser) {
      return (
        <div key={index} className="flex justify-end mb-4 rise-in">
          <div
            style={{
              maxWidth: '80%', borderRadius: '16px 16px 4px 16px', padding: '10px 16px',
              background: 'var(--bg-card-active)', border: '1px solid var(--border-dashed-active)',
            }}
          >
            {msg.hasMedia && msg.mediaType?.startsWith('image/') && msg.content && (
              <img src={msg.content} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 10, marginBottom: msg.caption ? 6 : 0 }} />
            )}
            {msg.hasMedia && msg.mediaType?.startsWith('audio/') && msg.content && (
              <audio controls src={msg.content} style={{ maxWidth: 220, height: 36, marginBottom: msg.caption ? 6 : 0 }} />
            )}
            {msg.hasMedia && msg.caption && (
              <p style={{ fontSize: 14, margin: 0, color: 'var(--text-primary)' }}>{msg.caption}</p>
            )}
            {!msg.hasMedia && <p style={{ fontSize: 14, margin: 0, color: 'var(--text-primary)' }}>{msg.content}</p>}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex gap-3 mb-5 rise-in" style={{ maxWidth: '92%' }}>
        <div className="icon-chip icon-chip--accent" style={{ width: 30, height: 30, borderRadius: 9, marginTop: 2 }}>
          <TbPill size={15} />
        </div>
        <div style={{ flex: 1 }}>
          {msg.hasMedia && !msg.mediaType?.startsWith('image/') && (
            <div className="flex items-center gap-2 text-secondary mb-2" style={{ fontSize: 13 }}>
              <TbFile size={15} />
              <span>Media file attached</span>
            </div>
          )}
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: 'var(--text-primary)' }}>{msg.content}</p>
          {msg.error && (
            <span className="badge-danger flex items-center gap-1" style={{ fontSize: 12, marginTop: 4 }}>
              <TbAlertTriangle size={13} />
              Something went wrong
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 92px)' }}>
      <div className="flex justify-between items-center p-4" style={{ borderBottom: '1px dashed var(--border-dashed)' }}>
        <div className="flex items-center gap-3">
          <div className="icon-chip icon-chip--accent" style={{ borderRadius: 10 }}>
            <TbPill size={18} />
          </div>
          <div>
            <h3 className="heading" style={{ fontSize: 15, margin: 0 }}>Swastik AI</h3>
            <p className="text-secondary" style={{ fontSize: 12, margin: 0 }}>Your personal health assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button className="icon-chip icon-chip--danger" onClick={handleClearChat} title="Clear chat">
            <TbTrash size={17} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={TbMessage2}
            tint="violet"
            title="Start a conversation"
            description="Ask about medicines, set reminders, or upload a photo of your medicine."
          />
        ) : (
          messages.map(renderMessage)
        )}
        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="icon-chip icon-chip--accent" style={{ width: 30, height: 30, borderRadius: 9 }}>
              <TbPill size={15} />
            </div>
            <div className="flex gap-1 items-center">
              <span className="dot dot--filled dot-bounce" style={{ animationDelay: '0s' }} />
              <span className="dot dot--filled dot-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="dot dot--filled dot-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {mediaPreview && !isRecording && (
        <div className="p-3" style={{ borderTop: '1px dashed var(--border-dashed)' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={mediaPreview} alt="Preview" style={{ maxHeight: 72, borderRadius: 10 }} />
            <button
              onClick={() => { setMediaFile(null); setMediaPreview(null); }}
              style={{
                position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%',
                background: 'var(--danger)', color: '#FFFFFF', border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <TbX size={13} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4" style={{ borderTop: '1px dashed var(--border-dashed)' }}>
        {isRecording ? (
          <div className="flex gap-2 items-center">
            <button
              className="icon-chip icon-chip--danger"
              style={{ width: 44, height: 44, borderRadius: 12 }}
              onClick={handleCancelRecording}
              title="Cancel recording"
            >
              <TbX size={19} />
            </button>

            <div className="rec-bar">
              <span className="rec-dot" />
              <span className="mono" style={{ fontSize: 14, color: 'var(--danger)', fontWeight: 600 }}>
                {formatDuration(recordSeconds)}
              </span>
              <span className="text-secondary" style={{ fontSize: 13 }}>Recording…</span>
            </div>

            <button
              className="icon-chip icon-chip--danger rec-pulse"
              style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }}
              onClick={handleStopAndSend}
              title="Stop and send"
            >
              <TbPlayerStop size={19} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <button
              className="icon-chip icon-chip--info"
              style={{ width: 44, height: 44, borderRadius: 12 }}
              onClick={() => photoInputRef.current?.click()}
              title="Upload a photo"
            >
              <TbCamera size={19} />
            </button>

            <button
              className="icon-chip icon-chip--violet"
              style={{ width: 44, height: 44, borderRadius: 12 }}
              onClick={handleStartRecording}
              title="Record a voice message"
            >
              <TbMicrophone size={19} />
            </button>

            <textarea
              className="input-field"
              style={{ flex: 1, minHeight: 44, maxHeight: 128, resize: 'none' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message…"
              rows="1"
            />

            <button
              className="btn-primary"
              style={{ width: 44, height: 44, borderRadius: 12, padding: 0, flexShrink: 0 }}
              onClick={handleSend}
              disabled={(!input.trim() && !mediaFile) || loading}
            >
              <TbSend size={18} />
            </button>
          </div>
        )}
        {!isRecording && (
          <p className="text-secondary text-center mt-2" style={{ fontSize: 12 }}>
            Upload a photo or use voice input · AI-powered health assistant
          </p>
        )}
      </div>
    </div>
  );
}

export default Chat;