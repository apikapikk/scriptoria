import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase';
import styles from './note.module.css';

interface DoneNotification {
  id: number;
  message: string;
  created_at: string;
  done_at: string;
}

export default function NotePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doneNotes, setDoneNotes] = useState<DoneNotification[]>([]);

  useEffect(() => {
    fetchDoneNotifications();
  }, []);

  const fetchDoneNotifications = async () => {
    const { data, error } = await supabase
      .from('done_notifications')
      .select('*')
      .order('done_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data done_notifications:', error.message);
    } else {
      setDoneNotes(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === '') {
      setError('Pesan tidak boleh kosong!');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert([{ message, created_at: new Date() }]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setMessage('');
      setError('');
      alert('Catatan berhasil dikirim!');

      // Tambahkan juga ke done_notifications
      const { error: doneError } = await supabase
        .from('done_notifications')
        .insert([{ message, created_at: new Date() }]);

      if (doneError) {
        console.error('Gagal memasukkan ke done_notifications:', doneError.message);
      } else {
        fetchDoneNotifications(); // Refresh tabel
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Tambah Catatan</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Catatan'}
          </button>
        </div>
      </form>

      <div className={styles.tableWrapper}>
  <h2 className={styles.subHeading}>Catatan Terkirim</h2>
  <div className={styles.tableScroll}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Pesan</th>
          <th>Waktu Dibuat</th>
          <th>Waktu Selesai</th>
        </tr>
      </thead>
      <tbody>
        {doneNotes.map((note) => (
          <tr key={note.id}>
            <td>{note.id}</td>
            <td>{note.message}</td>
            <td>{new Date(note.created_at).toLocaleString()}</td>
            <td>{new Date(note.done_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}
