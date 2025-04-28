import { useEffect, useState, useRef } from 'react';
import styles from './NotificationOverlay.module.css';
import Cookies from 'js-cookie';

type Notification = {
  id: string;
  message: string;
  created_at: string;
  isDone?: boolean;
};

export default function NotificationOverlay() {
  const [notes, setNotes] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const latestIdRef = useRef<string | null>(null);

  // Pengecekan cookie setiap beberapa detik
  useEffect(() => {
    const checkLoginStatus = () => {
      const cookie = Cookies.get('user');
      setIsLoggedIn(!!cookie);
    };

    checkLoginStatus(); // cek sekali pas mount

    const interval = setInterval(checkLoginStatus, 3000); // cek tiap 3 detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setNotes([]);
      setShowToast(false);
      setHasNewNotification(false);
      latestIdRef.current = null;
      return;
    }

    let interval: NodeJS.Timeout;

    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notification');
        const data: Notification[] = await res.json();

        if (Array.isArray(data)) {
          if (data.length > 0 && data[0].id !== latestIdRef.current) {
            latestIdRef.current = data[0].id;
            setNotes(data);
            setHasNewNotification(true);
            setShowToast(true);
          }
        }
      } catch (error) {
        console.error('failed to fetch api:', error);
      }
    };

    const startPolling = () => {
      fetchNotes();
      interval = setInterval(fetchNotes, 5000);
    };

    const stopPolling = () => clearInterval(interval);

    startPolling();

    return () => {
      stopPolling();
    };
  }, [isLoggedIn]);

  const handleShowToast = () => {
    if (hasNewNotification) {
      setShowToast(true);
      setHasNewNotification(false);
    } else {
      setShowToast(!showToast);
    }
  };

  const handleToggleDone = async (id: string) => {
    try {
      await fetch(`/api/notification?id=${id}`, { method: 'DELETE' });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Gagal memindahkan note:', error);
    }
  };

  const formatDate = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Tanggal tidak tersedia';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!isLoggedIn) {
    return null; // Gak render lonceng
  }

  return (
    <div>
      <div className={styles.iconWrapper} onClick={handleShowToast}>
        <div className={styles.icon}>🔔</div>
      </div>

      {showToast && (
        <div className={styles.toast}>
          {notes.map((note) => (
            <div key={note.id} className={styles.toastMessage}>
              <p>{note.message}</p>
              <small className={styles.timestamp}>{formatDate(note.created_at)}</small>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={note.isDone}
                  onChange={() => handleToggleDone(note.id)}
                />
                <label>Sudah dilakukan</label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
