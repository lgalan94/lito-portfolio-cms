import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Archive, Trash2, MailOpen, Mail } from 'lucide-react';
import Card from '../ui/Card';
import {
  getAllMessages,
  deleteMessage,
  updateMessageStatus,
} from '../../services/messageApi';
import type { Message } from '../../types';

const MessageView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // =======================================================
  // 📨 Fetch messages
  // =======================================================
  const fetchMessages = async () => {
    try {
      const data = await getAllMessages();
      if (!Array.isArray(data)) throw new Error('Invalid messages data');
      setMessages(data);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =======================================================
  // 🔄 Refresh helper (used after actions)
  // =======================================================
  const refreshMessages = async () => {
    try {
      const updatedData = await getAllMessages();
      if (Array.isArray(updatedData)) setMessages(updatedData);
    } catch (error) {
      console.error('❌ Error refreshing messages:', error);
    }
  };

  // =======================================================
  // ✉️ Toggle read/unread
  // =======================================================
  const toggleReadStatus = async (msg: Message) => {
    try {
      const newStatus = msg.status === 'unread' ? 'read' : 'unread';
      const updated = await updateMessageStatus(msg._id, newStatus);
      const updatedStatus = updated?.status || updated?.message?.status || newStatus;

      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, status: updatedStatus } : m
        )
      );

      toast.success(`✉️ Marked as ${updatedStatus}`);
      await refreshMessages(); // ensure backend and UI stay in sync
    } catch (err) {
      console.error(err);
      toast.error('Failed to update message status');
    }
  };

  // =======================================================
  // 📦 Archive message
  // =======================================================
  const handleArchive = async (msg: Message) => {
    try {
      const updated = await updateMessageStatus(msg._id, 'archived');
      const updatedStatus = updated?.status || updated?.message?.status || 'archived';

      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, status: updatedStatus } : m
        )
      );

      toast.success('📦 Message archived');
      await refreshMessages();
    } catch (err) {
      console.error(err);
      toast.error('Failed to archive message');
    }
  };

  // =======================================================
  // 🗑️ Delete message
  // =======================================================
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMessage(deleteTarget._id);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      toast.success('🗑️ Message deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  };

  // =======================================================
  // 🧱 UI
  // =======================================================
  return (
    <motion.div
      className="ml-66"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full h-full mt-16 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Messages</h2>
        </div>

        {/* Messages Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-slate-400">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-slate-400">No messages found.</p>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg._id}
                className={`relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-md group transition-all duration-200 ${
                  msg.status === 'unread'
                    ? 'border-blue-600 shadow-blue-600/20'
                    : 'border-slate-700'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Hover buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleReadStatus(msg)}
                    className="p-2 rounded-full bg-slate-700 hover:bg-blue-600 text-white"
                  >
                    {msg.status === 'unread' ? (
                      <MailOpen size={16} />
                    ) : (
                      <Mail size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleArchive(msg)}
                    className="p-2 rounded-full bg-slate-700 hover:bg-amber-600 text-white"
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="p-2 rounded-full bg-slate-700 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {msg.subject}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    From: <span className="text-teal-400">{msg.senderName}</span>{' '}
                    (<span className="text-blue-400">{msg.senderEmail}</span>)
                  </p>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-4">
                    {msg.messageBody}
                  </p>
                  <p className="text-slate-500 text-xs">
                    Received: {new Date(msg.receivedAt).toLocaleString()}
                  </p>

                  {msg.status === 'archived' && (
                    <span className="inline-block mt-3 text-xs text-amber-400 font-semibold">
                      📦 Archived
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg text-white font-semibold mb-3">
                Delete message from "{deleteTarget.senderName}"?
              </h3>
              <p className="text-slate-400 text-sm mb-5">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessageView;
