const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('projects').select('*, project_tags(tag_id), tasks(*)').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { name, description, status = 'active', tag_ids = [] } = req.body;
    const { data: project, error } = await supabase.from('projects').insert({ name, description, status }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (tag_ids.length) {
      await supabase.from('project_tags').insert(tag_ids.map(tag_id => ({ project_id: project.id, tag_id })));
    }
    return res.status(201).json(project);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
