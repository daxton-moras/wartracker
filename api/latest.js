const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('*');

    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10);

    if (metricsError) throw metricsError;
    if (reportsError) throw reportsError;

    const latestMetrics = {};
    for (const row of metrics) latestMetrics[row.metric_key] = row;

    res.status(200).json({
      ok: true,
      generatedAt: new Date().toISOString(),
      metrics: latestMetrics,
      reports
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

