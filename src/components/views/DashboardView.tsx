import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FolderKanban, Mail, MailOpen, Archive } from 'lucide-react';
import Card from '../ui/Card';
import { getAllProjects } from '../../services/projectApi';
import { getAllMessages } from '../../services/messageApi';
import type { Message } from '../../types';

const DashboardView: React.FC = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =======================================================
  // 📊 Fetch dashboard data
  // =======================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, messages] = await Promise.all([
          getAllProjects(),
          getAllMessages(),
        ]);

        setProjectCount(projects.length);
        setMessageCount(messages.length);
        setUnreadCount(messages.filter((m) => m.status === 'unread').length);

        // Show only latest 5 messages
        const sorted = [...messages].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentMessages(sorted.slice(0, 5));
      } catch (err) {
        console.error('❌ Error loading dashboard:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>

        {isLoading ? (
          <p className="text-slate-400">Loading dashboard data...</p>
        ) : (
          <>
            {/* === Overview Cards === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Projects */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
              >
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <FolderKanban className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Projects</p>
                  <h3 className="text-white text-2xl font-bold">{projectCount}</h3>
                </div>
              </motion.div>

              {/* Messages */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
              >
                <div className="bg-teal-600/20 p-3 rounded-full">
                  <Mail className="text-teal-400" size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                  <h3 className="text-white text-2xl font-bold">{messageCount}</h3>
                </div>
              </motion.div>

              {/* Unread */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
              >
                <div className="bg-amber-600/20 p-3 rounded-full">
                  <MailOpen className="text-amber-400" size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Unread Messages</p>
                  <h3 className="text-white text-2xl font-bold">{unreadCount}</h3>
                </div>
              </motion.div>

              {/* Archived */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
              >
                <div className="bg-gray-600/20 p-3 rounded-full">
                  <Archive className="text-gray-400" size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Archived</p>
                  <h3 className="text-white text-2xl font-bold">
                    {messageCount - unreadCount - recentMessages.filter((m) => m.status === 'read').length}
                  </h3>
                </div>
              </motion.div>
            </div>

            {/* === Recent Messages === */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                📬 Recent Messages
              </h3>
              {recentMessages.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent messages.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentMessages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-600 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {msg.subject}
                          </h4>
                          <p className="text-slate-400 text-xs mb-1">
                            From: <span className="text-teal-400">{msg.senderName}</span>{' '}
                            (<span className="text-blue-400">{msg.senderEmail}</span>)
                          </p>
                          <p className="text-slate-300 text-xs line-clamp-2">
                            {msg.messageBody}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            msg.status === 'unread'
                              ? 'bg-blue-600/20 text-blue-400'
                              : msg.status === 'archived'
                              ? 'bg-amber-600/20 text-amber-400'
                              : 'bg-slate-600/30 text-slate-300'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-2">
                        {new Date(msg.receivedAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default DashboardView;
