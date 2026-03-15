const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  return response.json();
}

module.exports = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const [spy, ita, gdelt, brent] = await Promise.all([
      getJson(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${process.env.FINNHUB_API_KEY}`),
      getJson(`https://finnhub.io/api/v1/quote?symbol=ITA&token=${process.env.FINNHUB_API_KEY}`),
      getJson(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent('(Iran OR Israel OR US) AND (missile OR drone OR strike OR oil OR Hormuz)')}&mode=ArtList&maxrecords=10&format=json&sort=datedesc`),
      getJson(`https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${process.env.EIA_API_KEY}&frequency=daily&data[0]=value&facets[product][]=EPCBRENT&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`)
    ]);

    const brentValue = brent?.response?.data?.[0]?.value || null;

    const metrics = [
      {
        metric_key: 'spy',
        label: 'S&P 500 ETF (SPY)',
        category: 'markets',
        value_num: spy.c ?? null,
        value_text: spy.c ? `$${spy.c}` : null,
        change_pct: spy.dp ?? null,
        source_name: 'Finnhub',
        source_url: 'https://finnhub.io/'
      },
      {
        metric_key: 'ita',
        label: 'Defense ETF (ITA)',
        category: 'markets',
        value_num: ita.c ?? null,
        value_text: ita.c ? `$${ita.c}` : null,
        change_pct: ita.dp ?? null,
        source_name: 'Finnhub',
        source_url: 'https://finnhub.io/'
      },
      {
        metric_key: 'brent',
        label: 'Brent Crude',
        category: 'energy',
        value_num: brentValue,
        value_text: brentValue ? `$${brentValue}` : null,
        change_pct: null,
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/opendata/'
      }
    ];

    const { error: metricsError } = await supabase
      .from('metrics')
      .upsert(metrics, { onConflict: 'metric_key' });

    if (metricsError) throw metricsError;

    const reports = (gdelt.articles || []).map((a) => ({
      title: a.title || 'Untitled report',
      body: '',
      actor: 'multi',
      region: a.sourcecountry || 'unknown',
      status: 'reported',
      source_name: a.domain || 'GDELT',
      source_url: a.url,
      published_at: a.seendate || null
    }));

    if (reports.length) {
      const { error: reportsError } = await supabase
        .from('reports')
        .upsert(reports, { onConflict: 'source_url' });

      if (reportsError) throw reportsError;
    }

    res.status(200).json({ ok: true, saved: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

