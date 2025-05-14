"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string) => void;
  dismissNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  showNotification: () => {},
  dismissNotification: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, dismissNotification }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`flex items-center justify-between rounded-lg p-4 shadow-lg ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : notification.type === "warning"
                  ? "bg-yellow-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 rounded-full p-1 hover:bg-white/20"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
