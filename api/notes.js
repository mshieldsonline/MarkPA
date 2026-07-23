const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('notes').select('*, note_tags(tag_id)').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { title, content, tag_ids = [] } = req.body;
    const { data: note, error } = await supabase.from('notes').insert({ title, content }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (tag_ids.length) {
      await supabase.from('note_tags').insert(tag_ids.map(tag_id => ({ note_id: note.id, tag_id })));
    }
    return res.status(201).json(note);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
