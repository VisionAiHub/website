// Add Resend's 3 verification records to Porkbun via API.
// Run: node scripts/porkbun-add-resend.mjs

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DOMAIN = 'visionaihub.com';
const ENDPOINT = `https://api.porkbun.com/api/json/v3/dns/create/${DOMAIN}`;

const env = {};
if (existsSync(path.resolve('.env'))) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const API_KEY = process.env.PORKBUN_API_KEY || env.PORKBUN_API_KEY || env.apikey;
const SECRET  = process.env.PORKBUN_SECRET  || env.PORKBUN_SECRET  || env.secretapikey;

if (!API_KEY || !SECRET) {
  console.error('Could not find Porkbun credentials in .env');
  process.exit(1);
}

const records = [
  // DKIM key for outgoing emails
  {
    type: 'TXT',
    name: 'resend._domainkey',
    content:
      'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCa6Cv339XhaWT1ik6+UI4uhkJ2aS7n3JZMkMHK8egauk3o/EYPSbzWqNL+gjSZwoOx9nCkF2eQUiKdSwEarjZFnyMyM87QSYt0xHigi/FwYarUZvZBfGgBkgl7sn/0DebFNx9SwrSXF8FRYuwO2ZEN9FbvBhWPfY1urOv2GKfLuQIDAQAB',
  },
  // SPF for the send.* subdomain
  {
    type: 'TXT',
    name: 'send',
    content: 'v=spf1 include:amazonses.com ~all',
  },
  // MX for bounce/complaint feedback to Resend
  {
    type: 'MX',
    name: 'send',
    content: 'feedback-smtp.eu-west-1.amazonses.com',
    prio: 10,
  },
];

const summary = { created: 0, failed: 0 };

for (const rec of records) {
  const body = {
    apikey: API_KEY,
    secretapikey: SECRET,
    type: rec.type,
    content: rec.content,
    name: rec.name,
    ttl: 600,
  };
  if (rec.prio !== undefined) body.prio = rec.prio;

  const label = `${rec.type.padEnd(5)} ${rec.name.padEnd(22)} → ${rec.content.slice(0, 60)}${rec.content.length > 60 ? '…' : ''}`;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (data.status === 'SUCCESS') {
      console.log(`✓ ${label}  [id ${data.id}]`);
      summary.created++;
    } else {
      console.log(`✗ ${label}  ${data.message || JSON.stringify(data)}`);
      summary.failed++;
    }
  } catch (e) {
    console.error(`✗ ${label}  ERROR: ${e.message}`);
    summary.failed++;
  }
}

console.log(`\nDone. created=${summary.created} failed=${summary.failed}`);
process.exit(summary.failed > 0 ? 1 : 0);
