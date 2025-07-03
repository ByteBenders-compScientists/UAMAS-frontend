import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Message } from '../../types/assessment';

interface MessageNotificationProps {
  message: Message | null;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({ message }) => {
  if (!message) return null;

  const getMessageStyles = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 mr-3" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 mr-3" />;
      case 'info':
        return <Info className="w-5 h-5 mr-3" />;
      default:
        return <Info className="w-5 h-5 mr-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-4 rounded-xl border ${getMessageStyles()} shadow-sm`}
    >
      <div className="flex items-center font-semibold">
        {getIcon()}
        {message.text}
      </div>
    </motion.div>
  );
};

export default MessageNotification;