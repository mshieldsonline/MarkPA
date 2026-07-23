const Anthropic = require('@anthropic-ai/sdk');
const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

const anthropic = new Anthropic();

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body;

  const [tasks, projects, goals, notes, captures] = await Promise.all([
    supabase.from('tasks').select('*').eq('done', false),
    supabase.from('projects').select('*'),
    supabase.from('goals').select('*'),
    supabase.from('notes').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('captures').select('*').is('promoted_to_task_id', null),
  ]);

  const context = JSON.stringify({
    tasks: tasks.data || [],
    projects: projects.data || [],
    goals: goals.data || [],
    notes: notes.data || [],
    captures: captures.data || [],
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are MarkPA, a personal assistant. Answer questions about the user's tasks, projects, goals, notes and captures using the data below. Be concise and helpful.\n\nData: ${context}`,
    messages: [
      ...history,
      { role: 'user', content: message },
    ],
  });

  return res.json({ reply: response.content[0].text });
};
