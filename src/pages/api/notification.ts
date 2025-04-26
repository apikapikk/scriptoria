// pages/api/notification.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const id = req.query.id as string;

    // Ambil catatan yang akan dihapus
    const { data: note, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !note) return res.status(500).json({ error: fetchError?.message || 'Note not found' });

    // Masukkan ke done_notifications
    const { error: insertError } = await supabase
      .from('done_notifications')
      .insert([
        {
          message: note.message,
          created_at: note.created_at,
        }
      ]);

    if (insertError) return res.status(500).json({ error: insertError.message });

    // Hapus dari notifikasi utama
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (deleteError) return res.status(500).json({ error: deleteError.message });

    res.status(200).json({ message: 'Note dipindahkan ke riwayat' });
  }
}
