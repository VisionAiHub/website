// Bulk-add DNS records to Porkbun via the v3 API.
// Run: node scripts/porkbun-dns-bulk-add.mjs
//
// Reads PORKBUN_API_KEY/PORKBUN_SECRET (or apikey/secretapikey) from .env
// and POSTs each record to:
//   https://api.porkbun.com/api/json/v3/dns/create/<domain>

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DOMAIN = 'visionaihub.com';
const ENDPOINT = `https://api.porkbun.com/api/json/v3/dns/create/${DOMAIN}`;

// Tiny .env loader — no extra deps.
const envPath = path.resolve('.env');
const env = {};
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[m[1]] = v;
  }
}

const API_KEY = process.env.PORKBUN_API_KEY || env.PORKBUN_API_KEY || env.apikey;
const SECRET  = process.env.PORKBUN_SECRET  || env.PORKBUN_SECRET  || env.secretapikey;

if (!API_KEY || !SECRET) {
  console.error('Could not find Porkbun credentials. Expected one of:');
  console.error('  - apikey + secretapikey in .env');
  console.error('  - PORKBUN_API_KEY + PORKBUN_SECRET in .env or environment');
  process.exit(1);
}

// `name` is the subdomain part WITHOUT the apex. Empty string = apex (@).
// `content` is the value/answer. For SRV, format is "weight port target" with prio separate.
const records = [
  // Website → Vercel
  { type: 'A',     name: '',     content: '216.198.79.1' },
  { type: 'CNAME', name: 'www',  content: '5230586b4759de83.vercel-dns-017.com.' },

  // Microsoft 365 mail
  { type: 'MX',    name: '',     content: 'visionaihub-com.mail.protection.outlook.com', prio: 10 },

  // SPF + verifications
  { type: 'TXT',   name: '',     content: 'v=spf1 include:spf.protection.outlook.com -all' },
  { type: 'TXT',   name: '',     content: 'MS=ms94465920' },
  { type: 'TXT',   name: '',     content: 'google-site-verification=YqyvCg2FlpijjQmcwihAlb4uatf9oTDOXW1e' },

  // M365 service CNAMEs
  { type: 'CNAME', name: 'autodiscover',           content: 'autodiscover.outlook.com' },
  { type: 'CNAME', name: 'enterpriseenrollment',   content: 'enterpriseenrollment.manage.microsoft.com' },
  { type: 'CNAME', name: 'enterpriseregistration', content: 'enterpriseregistration.windows.net' },
  { type: 'CNAME', name: 'lyncdiscover',           content: 'webdir.online.lync.com' },
  { type: 'CNAME', name: 'sip',                    content: 'sipdir.online.lync.com' },

  // Wix DKIM/DMARC (kept so any residual Wix-sent mail stays authenticated)
  { type: 'CNAME', name: '_dmarc',         content: '_dmarc.wixemails.com' },
  { type: 'CNAME', name: 's1._domainkey',  content: 's1._domainkey.visionaihub.com.s018.ascendbywix.com' },
  { type: 'CNAME', name: 's2._domainkey',  content: 's2._domainkey.visionaihub.com.s018.ascendbywix.com' },
  { type: 'CNAME', name: 'sel1._domainkey',content: 'sel1._domainkey.visionaihub.com.s018.ascendbywix.com' },

  // Microsoft Teams/Skype federation SRV
  // SRV content format used here: "weight port target", priority sent in `prio`.
  { type: 'SRV', name: '_sipfederationtls._tcp', content: '1 5061 sipfed.online.lync.com', prio: 100 },
  { type: 'SRV', name: '_sip._tls',              content: '1 443 sipdir.online.lync.com',  prio: 100 },
];

async function createRecord(rec) {
  const body = {
    apikey: API_KEY,
    secretapikey: SECRET,
    type: rec.type,
    content: rec.content,
    ttl: 600,
  };
  if (rec.name) body.name = rec.name;
  if (rec.prio !== undefined) body.prio = rec.prio;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: data.status, ...data };
}

const summary = { created: 0, skipped: 0, failed: 0 };

for (const rec of records) {
  const label = `${rec.type.padEnd(5)} ${(rec.name || '@').padEnd(28)} → ${rec.content}${rec.prio !== undefined ? ` (prio ${rec.prio})` : ''}`;
  try {
    const out = await createRecord(rec);
    if (out.status === 'SUCCESS') {
      console.log(`✓ ${label}  [id ${out.id}]`);
      summary.created++;
    } else {
      console.log(`✗ ${label}  ${out.message || JSON.stringify(out)}`);
      // "Duplicate" is an expected outcome on re-runs — count as skipped.
      if ((out.message || '').toLowerCase().includes('duplicate')) summary.skipped++;
      else summary.failed++;
    }
  } catch (e) {
    console.error(`✗ ${label}  ERROR: ${e.message}`);
    summary.failed++;
  }
}

console.log(`\nDone. created=${summary.created} skipped=${summary.skipped} failed=${summary.failed}`);
process.exit(summary.failed > 0 ? 1 : 0);
