const { supabase } = require('../../_lib/supabase');
const { setCors } = require('../../_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const { data: capture, error: fetchError } = await supabase.from('captures').select('text').eq('id', id).single();
  if (fetchError) return res.status(404).json({ error: 'Capture not found' });

  const { data: task, error: taskError } = await supabase.from('tasks').insert({ text: capture.text, priority: 'med' }).select().single();
  if (taskError) return res.status(500).json({ error: taskError.message });

  await supabase.from('captures').update({ promoted_to_task_id: task.id }).eq('id', id);

  return res.json(task);
};
