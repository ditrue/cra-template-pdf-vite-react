import { useState } from "react";
import NotificationCalendar from "./NotificationCalendar";
import NotificationList from "./NotificationList";

export interface NotificationState {
  mode: 'list' | 'calendar';
}

const Notification: React.FC = () => {
  const [mode, setMode] = useState<NotificationState['mode']>('list');

  if (mode === 'list') return (
    <NotificationList
      onModeChange={value => setMode(value)}
    />
  );

  if (mode === 'calendar') return (
    <NotificationCalendar
      onModeChange={value => setMode(value)}
    />
  );

  return null;
};

export default Notification;
