const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, action } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('captures').select('*').is('promoted_to_task_id', null).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { text } = req.body;
    const { data, error } = await supabase.from('captures').insert({ text }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === 'PATCH' && action === 'promote') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { data: capture, error: fetchError } = await supabase.from('captures').select('text').eq('id', id).single();
    if (fetchError) return res.status(404).json({ error: 'Capture not found' });
    const { data: task, error: taskError } = await supabase.from('tasks').insert({ text: capture.text, priority: 'med' }).select().single();
    if (taskError) return res.status(500).json({ error: taskError.message });
    await supabase.from('captures').update({ promoted_to_task_id: task.id }).eq('id', id);
    return res.json(task);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { error } = await supabase.from('captures').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
