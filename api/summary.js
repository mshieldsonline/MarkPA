const Anthropic = require('@anthropic-ai/sdk');
const { supabase } = require('./_lib/supabase');
const { setCors } = require('./_lib/cors');

const anthropic = new Anthropic();

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const [tasks, projects, goals, captures] = await Promise.all([
    supabase.from('tasks').select('*').eq('done', false),
    supabase.from('projects').select('*').eq('status', 'active'),
    supabase.from('goals').select('*'),
    supabase.from('captures').select('*').is('promoted_to_task_id', null).order('created_at', { ascending: false }).limit(10),
  ]);

  const context = {
    tasks: tasks.data || [],
    projects: projects.data || [],
    goals: goals.data || [],
    recentCaptures: captures.data || [],
    today: new Date().toISOString().split('T')[0],
  };

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are a personal assistant. Write a short plain-English morning briefing based on this data. Cover: overdue/due-soon tasks, high priority items, goals with low progress, active projects, anything notable. Be concise and practical. Data: ${JSON.stringify(context)}`,
    }],
  });

  return res.json({ summary: message.content[0].text });
};
