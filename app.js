let latestData = { metrics: {}, reports: [] };
let activeFilter = 'all';

function byId(id) {
  return document.getElementById(id);
}

function pctText(value) {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function numText(value) {
  if (value === null || value === undefined) return '--';
  return Number(value).toFixed(2);
}

function toneClass(value) {
  if (value === null || value === undefined) return 'text-slate-300';
  return Number(value) >= 0 ? 'text-green-400' : 'text-red-400';
}

function renderMetrics(metrics) {
  const spy = metrics.spy;
  const ita = metrics.ita;
  const brent = metrics.brent;

  byId('spy-value').textContent = spy?.value_text || '--';
  byId('spy-change').textContent = pctText(spy?.change_pct);
  byId('spy-change').className = `text-sm mt-2 ${toneClass(spy?.change_pct)}`;

  byId('ita-value').textContent = ita?.value_text || '--';
  byId('ita-change').textContent = pctText(ita?.change_pct);
  byId('ita-change').className = `text-sm mt-2 ${toneClass(ita?.change_pct)}`;

  byId('brent-price').textContent = brent?.value_text || 'N/A';
  byId('brent-status').textContent = brent
    ? `Source: ${brent.source_name}`
    : 'Brent feed not connected yet';
}

function filteredReports(reports) {
  if (activeFilter === 'all') return reports;
  if (activeFilter === 'reported') return reports.filter(r => (r.status || '').toLowerCase() === 'reported');
  return reports.filter(r => (r.category || '').toLowerCase() === activeFilter);
}

function openModal(report) {
  byId('modal-source').textContent = `${report.source_name || 'Unknown source'} • ${report.status || 'reported'}`;
  byId('modal-title').textContent = report.title || 'Untitled report';
  byId('modal-body').textContent = report.body || 'No additional summary has been stored for this report yet.';
  byId('modal-link').href = report.source_url || '#';
  byId('report-modal').classList.remove('hidden');
  byId('report-modal').classList.add('flex');
}

function renderReports(reports) {
  const list = byId('report-list');
  list.innerHTML = '';
  byId('report-count').textContent = reports.length;
  byId('report-summary').textContent = reports.length
    ? `${reports.length} report(s) available`
    : 'No report feed connected yet';

  const visible = filteredReports(reports);

  if (!visible.length) {
    list.innerHTML = `
      <div class="border border-dashed border-slate-700 rounded-2xl p-6 text-slate-400">
        No reports match the current filter yet.
      </div>
    `;
    return;
  }

  visible.forEach((report) => {
    const card = document.createElement('button');
    card.className = 'w-full text-left border border-slate-800 hover:border-slate-600 bg-slate-950 hover:bg-slate-800 rounded-2xl p-5 transition';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500">${report.source_name || 'Source'} • ${report.status || 'reported'}</p>
          <h3 class="text-lg font-semibold mt-2">${report.title || 'Untitled report'}</h3>
          <p class="text-sm text-slate-400 mt-3">${report.body || 'Click to inspect this source and open the original article.'}</p>
        </div>
        <span class="text-blue-400 text-sm shrink-0">Open</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(report));
    list.appendChild(card);
  });

  const top = reports[0];
  if (top) {
    byId('top-alert').textContent = top.title || 'Top report available';
    byId('alert-badge').textContent = top.status || 'reported';
    const link = byId('top-alert-link');
    link.href = top.source_url || '#';
    link.classList.remove('hidden');
  } else {
    byId('top-alert').textContent = 'No verified report headline yet.';
    byId('alert-badge').textContent = 'No live reports yet';
    byId('top-alert-link').classList.add('hidden');
  }
}

async function loadDashboard() {
  const res = await fetch('/api/latest');
  const data = await res.json();

  if (!data.ok) {
    byId('pipeline-status').textContent = 'Backend load failed';
    return;
  }

  latestData = data;
  byId('last-update').textContent = new Date(data.generatedAt).toUTCString();

  const metricsCount = Object.keys(data.metrics || {}).length;
  const reportsCount = (data.reports || []).length;

  byId('pipeline-status').textContent = `Loaded ${metricsCount} metrics and ${reportsCount} reports`;

  renderMetrics(data.metrics || {});
  renderReports(data.reports || []);
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.filter-btn')) {
    activeFilter = e.target.dataset.filter;
    renderReports(latestData.reports || []);
  }
});

byId('refresh-btn').addEventListener('click', loadDashboard);
byId('open-help').addEventListener('click', () => {
  alert('Markets cards are automated. Kinetic data should be manually verified. Reports become clickable once the report feed is connected.');
});
byId('close-modal').addEventListener('click', () => {
  byId('report-modal').classList.add('hidden');
  byId('report-modal').classList.remove('flex');
});
byId('report-modal').addEventListener('click', (e) => {
  if (e.target.id === 'report-modal') {
    byId('report-modal').classList.add('hidden');
    byId('report-modal').classList.remove('flex');
  }
});

loadDashboard();
setInterval(loadDashboard, 60000);

