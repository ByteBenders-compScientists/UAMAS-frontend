import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Message } from '../../types/assessment';
import { useThemeColors } from '@/context/ThemeContext';

interface MessageNotificationProps {
  message: Message | null;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({ message }) => {
  const colors = useThemeColors();

  if (!message) return null;

  const getMessageStyles = () => {
    switch (message.type) {
      case 'success':
        return {
          bg: colors.success + '10',
          border: colors.success + '30',
          text: colors.success,
          iconBg: colors.success
        };
      case 'error':
        return {
          bg: colors.error + '10',
          border: colors.error + '30',
          text: colors.error,
          iconBg: colors.error
        };
      case 'info':
        return {
          bg: colors.info + '10',
          border: colors.info + '30',
          text: colors.info,
          iconBg: colors.info
        };
      default:
        return {
          bg: colors.backgroundSecondary,
          border: colors.border,
          text: colors.textPrimary,
          iconBg: colors.textSecondary
        };
    }
  };

  const styles = getMessageStyles();
  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 mr-3" style={{ color: styles.iconBg }} />;
      case 'error':
        return <AlertCircle className="w-5 h-5 mr-3" style={{ color: styles.iconBg }} />;
      case 'info':
        return <Info className="w-5 h-5 mr-3" style={{ color: styles.iconBg }} />;
      default:
        return <Info className="w-5 h-5 mr-3" style={{ color: styles.iconBg }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6 p-4 rounded-xl border shadow-sm"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
        color: styles.text
      }}
    >
      <div className="flex items-center font-semibold">
        {getIcon()}
        {message.text}
      </div>
    </motion.div>
  );
};

export default MessageNotification;