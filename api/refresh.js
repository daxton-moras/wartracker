const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return response.json();
}

module.exports = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const [spy, ita] = await Promise.all([
      getJson(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${process.env.FINNHUB_API_KEY}`),
      getJson(`https://finnhub.io/api/v1/quote?symbol=ITA&token=${process.env.FINNHUB_API_KEY}`)
    ]);

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
      }
    ];

    const { error } = await supabase
      .from('metrics')
      .upsert(metrics, { onConflict: 'metric_key' });

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      saved: metrics.length
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
