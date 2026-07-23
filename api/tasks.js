const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

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

  return res.status(405).json({ error: 'Method not allowed' });
};
