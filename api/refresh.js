const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, status, body) {
  return res.status(status).json(body);
}

function classifyReport(title = '', body = '') {
  const text = `${title} ${body}`.toLowerCase();

  if (/(brent|oil|crude|hormuz|petroleum|shipping|energy)/.test(text)) {
    return 'energy';
  }

  if (/(spy|s&p|dow|nasdaq|etf|stocks|equity|market)/.test(text)) {
    return 'markets';
  }

  if (/(missile|drone|strike|airstrike|rocket|attack|military|defense)/.test(text)) {
    return 'kinetic';
  }

  return 'general';
}

function deriveActor(title = '', body = '') {
  const text = `${title} ${body}`.toLowerCase();

  if (text.includes('iran')) return 'iran';
  if (text.includes('israel')) return 'israel';
  if (text.includes('u.s.') || text.includes('us ') || text.includes('united states')) return 'us';

  return 'multi';
}

function deriveRegion(title = '', body = '') {
  const text = `${title} ${body}`.toLowerCase();

  if (/(gulf|hormuz|saudi|kuwait|uae|bahrain|dubai|qatar)/.test(text)) return 'gulf';
  if (/(iran|tehran|isfahan|tabriz)/.test(text)) return 'iran';
  if (/(israel|tel aviv|jerusalem|haifa)/.test(text)) return 'israel';

  return 'global';
}

async function fetchJson(url, label) {
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'wartracker/1.0' }
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        ok: false,
        label,
        status: response.status,
        error: text.slice(0, 300)
      };
    }

    const data = await response.json();
    return { ok: true, label, data };
  } catch (error) {
    return { ok: false, label, error: error.message };
  }
}

function buildEiaUrl() {
  const params = new URLSearchParams();
  params.set('api_key', process.env.EIA_API_KEY);
  params.set('frequency', 'daily');
  params.append('data[]', 'value');
  params.append('facets[product][]', 'EPCBRENT');
  params.set('sort[0][column]', 'period');
  params.set('sort[0][direction]', 'desc');
  params.set('offset', '0');
  params.set('length', '1');

  return `https://api.eia.gov/v2/petroleum/pri/spt/data/?${params.toString()}`;
}

function buildGdeltUrl() {
  const params = new URLSearchParams();
  params.set(
    'query',
    '(Iran OR Israel OR US OR Hormuz OR Gulf) AND (missile OR drone OR strike OR oil OR shipping OR market)'
  );
  params.set('mode', 'ArtList');
  params.set('format', 'json');
  params.set('maxrecords', '8');
  params.set('timespan', '6h');
  params.set('sort', 'datedesc');

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

module.exports = async (req, res) => {
  const auth = req.headers.authorization || '';

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return json(res, 401, { ok: false, error: 'Unauthorized' });
  }

  const diagnostics = {
    sources: {},
    inserts: {
      metricsSaved: 0,
      reportsSaved: 0
    }
  };

  try {
    const [spyRes, itaRes, brentRes, gdeltRes] = await Promise.all([
      fetchJson(
        `https://finnhub.io/api/v1/quote?symbol=SPY&token=${process.env.FINNHUB_API_KEY}`,
        'finnhub_spy'
      ),
      fetchJson(
        `https://finnhub.io/api/v1/quote?symbol=ITA&token=${process.env.FINNHUB_API_KEY}`,
        'finnhub_ita'
      ),
      fetchJson(buildEiaUrl(), 'eia_brent'),
      fetchJson(buildGdeltUrl(), 'gdelt_reports')
    ]);

    diagnostics.sources.spy = spyRes.ok
      ? { ok: true }
      : { ok: false, status: spyRes.status || null, error: spyRes.error || 'Unknown error' };

    diagnostics.sources.ita = itaRes.ok
      ? { ok: true }
      : { ok: false, status: itaRes.status || null, error: itaRes.error || 'Unknown error' };

    diagnostics.sources.brent = brentRes.ok
      ? { ok: true }
      : { ok: false, status: brentRes.status || null, error: brentRes.error || 'Unknown error' };

    diagnostics.sources.gdelt = gdeltRes.ok
      ? { ok: true }
      : { ok: false, status: gdeltRes.status || null, error: gdeltRes.error || 'Unknown error' };

    const metrics = [];

    if (spyRes.ok) {
      metrics.push({
        metric_key: 'spy',
        label: 'S&P 500 ETF (SPY)',
        category: 'markets',
        value_num: spyRes.data.c ?? null,
        value_text: spyRes.data.c ? `$${spyRes.data.c}` : null,
        change_pct: spyRes.data.dp ?? null,
        source_name: 'Finnhub',
        source_url: 'https://finnhub.io/'
      });
    }

    if (itaRes.ok) {
      metrics.push({
        metric_key: 'ita',
        label: 'Defense ETF (ITA)',
        category: 'markets',
        value_num: itaRes.data.c ?? null,
        value_text: itaRes.data.c ? `$${itaRes.data.c}` : null,
        change_pct: itaRes.data.dp ?? null,
        source_name: 'Finnhub',
        source_url: 'https://finnhub.io/'
      });
    }

    if (brentRes.ok) {
      const brentValue = brentRes.data?.response?.data?.[0]?.value ?? null;

      metrics.push({
        metric_key: 'brent',
        label: 'Brent Crude',
        category: 'energy',
        value_num: brentValue,
        value_text: brentValue ? `$${brentValue}` : null,
        change_pct: null,
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/opendata/'
      });
    }

    if (metrics.length > 0) {
      const { error: metricsError } = await supabase
        .from('metrics')
        .upsert(metrics, { onConflict: 'metric_key' });

      if (metricsError) throw metricsError;
      diagnostics.inserts.metricsSaved = metrics.length;
    }

    if (gdeltRes.ok && Array.isArray(gdeltRes.data.articles)) {
      const reports = gdeltRes.data.articles
        .filter((article) => article.url && article.title)
        .map((article) => {
          const title = article.title || 'Untitled report';
          const body = article.seendate
            ? `Seen by GDELT at ${article.seendate}. Category: ${classifyReport(title)}.`
            : `Category: ${classifyReport(title)}.`;

          return {
            title,
            body,
            actor: deriveActor(title, body),
            region: deriveRegion(title, body),
            status: 'reported',
            source_name: article.domain || article.sourcecountry || 'GDELT',
            source_url: article.url,
            published_at: article.seendate || new Date().toISOString()
          };
        });

      if (reports.length > 0) {
        const { error: reportsError } = await supabase
          .from('reports')
          .upsert(reports, { onConflict: 'source_url' });

        if (reportsError) throw reportsError;
        diagnostics.inserts.reportsSaved = reports.length;
      }
    }

    return json(res, 200, {
      ok: true,
      message: 'Refresh completed',
      diagnostics
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error.message,
      diagnostics
    });
  }
};

