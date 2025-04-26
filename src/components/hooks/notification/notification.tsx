import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import styles from './NotificationOverlay.module.css';

type Notification = {
  id: string;
  message: string;
  created_at: string;
  isDone?: boolean;
};


export default function NotificationOverlay() {
  const [notes, setNotes] = useState<Notification[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const latestIdRef = useRef<string | null>(null);

  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      try {
        const user = JSON.parse(cookie);
        if (user.position === 'Employee' || user.position === 'Manager') {
          setIsAllowed(true);
        }
      } catch (e) {
        console.error('Gagal parse cookie user:', e);
      }
    }
  }, []);

  useEffect(() => {
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
        console.error('failed to catch api:', error);
      }
    };

    const startPolling = () => {
      fetchNotes();
      interval = setInterval(fetchNotes, 5000);
    };

    const stopPolling = () => {
      clearInterval(interval);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startPolling(); // Mulai polling ketika halaman aktif
      } else {
        stopPolling(); // Stop polling ketika halaman tidak aktif
      }
    };

    if (isAllowed) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      startPolling();
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAllowed]);

  const handleShowToast = () => {
    if (hasNewNotification) {
      setShowToast(true);  // Tampilkan toast saat lonceng diklik
      setHasNewNotification(false); // Reset status notifikasi baru
    } else {
      setShowToast(!showToast);  // Jika tidak ada notifikasi baru, toggle toast
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
  
  
 

  if (!isAllowed) return null;

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
