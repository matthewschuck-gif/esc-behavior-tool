/**
 * Claude calls for coaching notes and plans. The key is in Script Properties
 * (ANTHROPIC_API_KEY, saved from the BIC menu), so it never reaches the page. Only signed-in
 * people can call it, up to AI_DAILY_LIMIT calls a day each; the model and answer length come
 * from Settings, not from the page. Every call adds a row to the AI Usage tab.
 */

const AI_USAGE_TAB_ = 'AI Usage';
const AI_USAGE_HEADERS_ = ['Date', 'Who', 'Model', 'Input Tokens', 'Output Tokens'];

function aiChat_(who, body) {
  if (!aiOn_()) throw new Error('AI is turned off on the Settings tab.');
  const key = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!key) throw new Error('No Claude key yet: an admin saves it from the BIC menu.');
  const messages = body.messages;
  if (!Array.isArray(messages) || !messages.length) throw new Error('Nothing to send.');
  if (JSON.stringify(messages).length > 80000) throw new Error('That request is too long.');

  // Per-person daily cap.
  const cache = CacheService.getScriptCache();
  const day = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  const capKey = 'bic-ai-' + day + '-' + Utilities.base64EncodeWebSafe(who.id).slice(0, 200);
  const used = Number(cache.get(capKey)) || 0;
  if (used >= (Number(getSetting_('AI_DAILY_LIMIT')) || 80)) throw new Error('You\'ve reached today\'s AI limit. It resets tomorrow.');
  cache.put(capKey, String(used + 1), 86400);

  const req = {
    model: getSetting_('CLAUDE_MODEL') || 'claude-sonnet-5-5',
    max_tokens: Math.min(Number(body.max_tokens) || 4000, Number(getSetting_('AI_MAX_TOKENS')) || 6000),
    messages: messages.map(function (m) { return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }; }),
  };
  const effort = String(getSetting_('AI_EFFORT') || '').trim().toLowerCase();
  if (effort) req.output_config = { effort: effort };
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify(req),
  });
  const data = JSON.parse(res.getContentText() || '{}');
  if (res.getResponseCode() !== 200) throw new Error((data.error && data.error.message) || 'Claude returned ' + res.getResponseCode());
  const u = data.usage || {};
  try {
    tab_(AI_USAGE_TAB_).appendRow([new Date(), who.email || who.role, data.model || req.model, u.input_tokens || 0, u.output_tokens || 0]);
  } catch (e) { /* logging never blocks an answer */ }
  if (data.stop_reason === 'max_tokens') throw new Error('The answer was cut off. Raise AI_MAX_TOKENS on the Settings tab.');
  // The page reads content[0].text, the same shape the old /api/chat returned.
  const text = (data.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
  return { content: [{ type: 'text', text: text }] };
}
