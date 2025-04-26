import { useState } from 'react';
import { supabase } from '../../../utils/supabase';
import styles from './note.module.css';

export default function NotePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === '') {
      setError('Pesan tidak boleh kosong!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{ message, created_at: new Date() }]);

      if (error) {
        setError(error.message);
        return;
      }

      setMessage('');
      setError('');
      alert('Catatan berhasil dikirim!');
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
    </div>
  );
}
