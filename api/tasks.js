const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('tasks').select('*, task_tags(tag_id)').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { text, priority = 'med', due_date, project_id, tag_ids = [] } = req.body;
    const { data: task, error } = await supabase.from('tasks').insert({ text, priority, due_date, project_id }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (tag_ids.length) {
      await supabase.from('task_tags').insert(tag_ids.map(tag_id => ({ task_id: task.id, tag_id })));
    }
    return res.status(201).json(task);
  }

  if (req.method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { data, error } = await supabase.from('tasks').update({ ...req.body, updated_at: new Date() }).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
