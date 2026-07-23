const Anthropic = require('@anthropic-ai/sdk');
const { supabase } = require('../_lib/supabase');

const anthropic = new Anthropic();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) return res.status(403).end();

  const { message } = req.body;
  if (!message?.text) return res.status(200).end();

  const chatId = message.chat.id;
  const text = message.text;

  const [tags, projects] = await Promise.all([
    supabase.from('tags').select('name'),
    supabase.from('projects').select('name'),
  ]);

  const classification = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Classify this message as a write or query intent and extract structured data.
Known tags: ${(tags.data || []).map(t => t.name).join(', ')}
Known projects: ${(projects.data || []).map(p => p.name).join(', ')}
Message: "${text}"
Respond with JSON only: { "intent": "write"|"query", "entity": "task"|"goal"|"capture"|"note"|"tag"|"project"|null, "data": {}, "topic": string|null }`,
    }],
  });

  let parsed;
  try { parsed = JSON.parse(classification.content[0].text); }
  catch { parsed = { intent: 'query', topic: 'general_summary' }; }

  if (parsed.intent === 'write') {
    await handleWrite(parsed, chatId);
  } else {
    await handleQuery(parsed, text, chatId);
  }

  return res.status(200).end();
};

async function sendTelegram(chatId, text) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function handleWrite(parsed, chatId) {
  const { entity, data } = parsed;
  let confirmMsg = 'Done.';

  if (entity === 'task') {
    const { text, priority = 'med', due_date, project_id } = data;
    await supabase.from('tasks').insert({ text, priority, due_date, project_id });
    confirmMsg = `Added task: ${text}`;
  } else if (entity === 'goal') {
    await supabase.from('goals').insert({ title: data.title, target_description: data.target_description });
    confirmMsg = `Added goal: ${data.title}`;
  } else if (entity === 'capture') {
    await supabase.from('captures').insert({ text: data.text });
    confirmMsg = `Captured: ${data.text}`;
  } else if (entity === 'note') {
    await supabase.from('notes').insert({ title: data.title, content: data.content });
    confirmMsg = `Note saved${data.title ? ': ' + data.title : '.'}`;
  } else if (entity === 'tag') {
    await supabase.from('tags').insert({ name: data.name });
    confirmMsg = `Tag created: #${data.name}`;
  } else if (entity === 'project') {
    await supabase.from('projects').insert({ name: data.name, description: data.description });
    confirmMsg = `Project created: ${data.name}`;
  }

  await sendTelegram(chatId, confirmMsg);
}

async function handleQuery(parsed, originalText, chatId) {
  const [tasks, projects, goals, notes] = await Promise.all([
    supabase.from('tasks').select('*').eq('done', false),
    supabase.from('projects').select('*'),
    supabase.from('goals').select('*'),
    supabase.from('notes').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const context = JSON.stringify({ tasks: tasks.data, projects: projects.data, goals: goals.data, notes: notes.data });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Answer this question concisely for a Telegram message (plain text, no markdown): "${originalText}"\n\nData: ${context}`,
    }],
  });

  await sendTelegram(chatId, response.content[0].text);
}
