// Vercel Serverless Function - Domain Availability Check
// api/check-domain.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: 'No domain provided' });

  const name = domain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!name) return res.status(400).json({ error: 'Invalid domain' });

  const extensions = ['.com', '.net', '.org', '.io', '.co', '.store', '.online', '.site'];
  
  const results = await Promise.all(
    extensions.map(async (ext) => {
      const fullDomain = name + ext;
      try {
        const response = await fetch(`https://dns.google/resolve?name=${fullDomain}&type=A`, {
          signal: AbortSignal.timeout(3000)
        });
        const data = await response.json();
        
        // If Status 0 and has answers → domain is TAKEN
        // If Status 3 (NXDOMAIN) → domain is AVAILABLE
        const available = data.Status === 3 || !data.Answer;
        
        const prices = {
          '.com': { usd: 12.99, egp: 400 },
          '.net': { usd: 13.99, egp: 430 },
          '.org': { usd: 12.99, egp: 400 },
          '.io': { usd: 49.99, egp: 1540 },
          '.co': { usd: 29.99, egp: 920 },
          '.store': { usd: 8.99, egp: 275 },
          '.online': { usd: 4.99, egp: 155 },
          '.site': { usd: 4.99, egp: 155 },
        };

        return {
          domain: fullDomain,
          extension: ext,
          available,
          price: prices[ext] || { usd: 14.99, egp: 460 }
        };
      } catch {
        return { domain: name + ext, extension: ext, available: null, price: null };
      }
    })
  );

  res.status(200).json({ name, results });
}
