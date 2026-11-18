import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto, createHash } from 'node:crypto';
import { transformSync } from 'esbuild';

function backend(user = null) {
  const source = readFileSync(new URL('../convex/auth.ts', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
  const validators = new Proxy({}, { get: () => () => ({}) });
  const context = { exports: {}, module: { exports: {} }, crypto: webcrypto, TextEncoder, v: validators,
    mutation: x => x, query: x => x, ConvexError: Error };
  vm.runInNewContext(transformSync(source, { loader: 'ts', format: 'cjs' }).code, context);
  let inserted;
  const db = { query: () => ({ withIndex: () => ({ first: async () => user }) }),
    insert: async (_, value) => { inserted = value; return 'new-user'; }, patch: async () => {} };
  return { auth: context.module.exports, ctx: { db }, inserted: () => inserted };
}
const hash = password => createHash('sha256').update(password + '__chamaki_salt__').digest('hex');
const args = { name: ' Ana ', email: ' ANA@EXAMPLE.COM ', password: 'abcdef', type: 'cli' };

test('registration normalizes identity and never returns a password', async () => {
  const b = backend(); const result = await b.auth.register.handler(b.ctx, args);
  assert.equal(result.email, 'ana@example.com'); assert.equal(result.name, 'Ana');
  assert.equal(b.inserted().passwordHash, hash('abcdef')); assert.equal(result.passwordHash, undefined);
});
test('registration rejects duplicate email', async () => {
  const b = backend({ email: 'ana@example.com' });
  await assert.rejects(b.auth.register.handler(b.ctx, args));
});
test('registration rejects invalid email, blank name and short password', async () => {
  for (const change of [{ email: 'invalid' }, { name: ' ' }, { password: '123' }]) {
    const b = backend(); await assert.rejects(b.auth.register.handler(b.ctx, { ...args, ...change }));
    assert.equal(b.inserted(), undefined);
  }
});
test('login rejects fixed passwords and incorrect credentials', async () => {
  const b = backend({ passwordHash: hash('my-secret'), email: 'ana@example.com' });
  for (const password of ['123', '123456', 'wrong']) {
    await assert.rejects(b.auth.login.handler(b.ctx, { email: args.email, password }));
  }
});
test('login accepts only the stored password, including existing short passwords', async () => {
  for (const password of ['my-secret', '123']) {
    const b = backend({ name: 'Ana', email: 'ana@example.com', type: 'cli', passwordHash: hash(password) });
    const result = await b.auth.login.handler(b.ctx, { email: args.email, password });
    assert.equal(result.name, 'Ana'); assert.equal(result.passwordHash, undefined);
  }
});
test('profile response never exposes password hash', async () => {
  const b = backend({ _id: 'user', passwordHash: hash('secret'), email: 'ana@example.com' });
  const result = await b.auth.updateProfile.handler(b.ctx, { email: args.email, name: 'Ana' });
  assert.equal(result.passwordHash, undefined); assert.equal(result.name, 'Ana');
});
test('frontend uses a single backend and no SPA API fallback or stale cache', () => {
  const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /fetch\(|backendFetch|chamaki_tickets_cache|setInterval/);
  assert.match(source, /convex\.query\(api\.tickets\.list/);
});

function frontend(mutation) {
  let source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/gm, '').replace('import.meta.env.VITE_CONVEX_URL', '"https://test.convex.cloud"');
  const nodes = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, { value: '', style: {}, classList: { contains: () => true, add() {}, remove() {} } }); return nodes.get(id); };
  const context = vm.createContext({ ConvexClient: class { mutation = mutation; query = async () => []; },
    api: { auth: { login: 'login', register: 'register' }, tickets: { list: 'list' } },
    logoDark: '/logo.png', window: { addEventListener() {} }, document: { getElementById: node },
    localStorage: { getItem: () => '{invalid', setItem() { throw Error('blocked'); } },
    console: { warn() {}, error() {} }, setTimeout: () => 0 });
  vm.runInContext(source, context);
  return { context, node, run: code => vm.runInContext(code, context) };
}
test('login preserves backend errors without requesting HTML from Netlify', async () => {
  let calls = 0;
  const f = frontend(async () => { calls++; throw Error('Senha incorreta'); });
  f.node('cEmail').value = 'ana@example.com'; f.node('cPass').value = 'incorrect';
  await f.run('handleLoginCli()');
  assert.equal(calls, 1); assert.equal(f.node('cAuthError').textContent, 'Senha incorreta');
});
test('ticket dates use Convex creation time and malformed sessions are ignored', () => {
  const f = frontend(async () => {});
  f.run('updateTickets([{ ticketId: "CHK-001", _creationTime: 12345 }])');
  assert.equal(f.run('tickets[0].createdTime'), 12345);
  assert.equal(f.run('loadSession()'), null);
});

test('both portals display the public Convex error without request IDs or stack traces', async () => {
  for (const [handler, emailId, passId, errorId] of [
    ['handleLoginCli', 'cEmail', 'cPass', 'cAuthError'],
    ['handleLoginTec', 'tEmail', 'tPass', 'tAuthError'],
  ]) {
    const error = Object.assign(new Error('[CONVEX M(auth:login)] [Request ID: test] Server Error'), { data: 'E-mail nao cadastrado.' });
    const f = frontend(async () => { throw error; });
    f.node(emailId).value = 'missing@example.com'; f.node(passId).value = 'secret';
    await f.run(handler + '()');
    assert.equal(f.node(errorId).textContent, error.data);
  }
});
test('unexpected Convex server errors do not expose technical details', () => {
  const f = frontend(async () => {});
  const result = f.run('errorMessage(new Error("[CONVEX M(auth:login)] Server Error"))');
  assert.doesNotMatch(result, /CONVEX|Server Error/);
  assert.match(result, /Tente novamente/);
});

test('both portals show the ticket conversation and escape multiline messages', () => {
  const f = frontend(async () => {});
  f.run(`currentUser = {name:'Ana',email:'ana@example.com',type:'cli'};
    tickets = [{ticketId:'CHK-001',authorEmail:'ana@example.com',title:'Impressora',timeline:[
      {type:'file',message:'Abertura',time:'10:00'},
      {type:'msg',message:'Tecnico: Reinicie o computador.\\n<img src=x onerror=alert(1)>',time:'10:15'},
      {type:'msg',authorType:'cli',message:'Ana: O problema continua.',time:'10:30'}
    ]}]; selectedTicketId='CHK-001';`);
  for (const detail of [f.run('rCDet()'), f.run('rTDet()')]) {
    assert.match(detail, /Conversa do chamado/);
    assert.match(detail, /Tecnico: Reinicie o computador/);
    assert.match(detail, /Ana: O problema continua/);
    assert.match(detail, /&lt;img/);
    assert.doesNotMatch(detail, /<img src=x/);
    assert.match(detail, /Enviar mensagem/);
  }
  assert.match(f.run('rCTickets()'), /Ver conversa/);
  assert.match(f.run('rCDash()'), /O problema continua/);
  f.run('tickets[0].status = "Resolvido"');
  assert.match(f.run('rCDet()'), /O problema continua/);
  assert.doesNotMatch(f.run('rCDet()'), /Enviar mensagem/);
});
test('collaborator detail does not render another authors ticket', () => {
  const f = frontend(async () => {});
  f.run(`currentUser={email:'ana@example.com',type:'cli'}; selectedTicketId='CHK-002';
    tickets=[{ticketId:'CHK-002',authorEmail:'other@example.com',timeline:[{type:'msg',message:'Private reply'}]}];`);
  assert.doesNotMatch(f.run('rCDet()'), /Private reply/);
});
test('live update notifies the author of a new reply without notifying on initial load', () => {
  const f = frontend(async () => {});
  f.run(`currentUser={email:'ana@example.com',type:'cli'};
    updateTickets([{ticketId:'CHK-001',authorEmail:'ana@example.com',timeline:[]}]);`);
  assert.equal(f.node('toast').textContent, undefined);
  f.run(`updateTickets([{...tickets[0],timeline:[{type:'msg',authorType:'cli',message:'Mensagem própria'}]}]);`);
  assert.equal(f.node('toast').textContent, undefined);
  f.run(`updateTickets([{...tickets[0],timeline:[...tickets[0].timeline,{type:'msg',message:'Resposta antiga da TI'}]}]);`);
  assert.match(f.node('toast').textContent, /Nova resposta/);
  f.node('toast').textContent = '';
  f.run(`currentUser={email:'ti@example.com',type:'tec'};
    updateTickets([{...tickets[0],timeline:[...tickets[0].timeline,{type:'msg',authorType:'cli',message:'Réplica'}]}]);`);
  assert.match(f.node('toast').textContent, /Nova resposta/);
  assert.equal(f.run('ticketReplies(tickets[0]).length'), 3);
});
