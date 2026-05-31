// Quick diagnostic: ping the API and list domains we can manage.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const env = {};
if (existsSync(path.resolve('.env'))) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const apikey = env.apikey || env.PORKBUN_API_KEY;
const secretapikey = env.secretapikey || env.PORKBUN_SECRET;

async function call(path) {
  const r = await fetch(`https://api.porkbun.com/api/json/v3${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey, secretapikey }),
  });
  return r.json();
}

console.log('--- /ping ---');
console.log(await call('/ping'));

console.log('\n--- /domain/listAll ---');
const list = await call('/domain/listAll');
console.log(JSON.stringify(list, null, 2));
