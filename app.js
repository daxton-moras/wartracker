function byId(id) {
  return document.getElementById(id);
}

function formatPct(value) {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

async function loadDashboard() {
  const res = await fetch('/api/latest');
  const data = await res.json();

  if (!data.ok) {
    byId('top-alert').textContent = 'Could not load live data.';
    return;
  }

  byId('last-update').textContent = new Date(data.generatedAt).toUTCString();
  byId('brent-price').textContent = data.metrics.brent?.value_text || 'N/A';
  byId('spy-change').textContent = formatPct(data.metrics.spy?.change_pct);
  byId('ita-change').textContent = formatPct(data.metrics.ita?.change_pct);

  const firstReport = data.reports?.[0];
  if (firstReport) {
    byId('top-alert').innerHTML = `<strong>ALERT:</strong> ${firstReport.title}`;
  }

  const list = byId('report-list');
  list.innerHTML = '';
  for (const report of data.reports || []) {
    const li = document.createElement('li');
    li.className = 'border border-slate-800 rounded-lg p-4 bg-slate-900';
    li.innerHTML = `
      <a href="${report.source_url}" target="_blank" class="text-blue-400 font-semibold">${report.title}</a>
      <p class="text-slate-400 text-sm mt-2">Status: ${report.status} | Source: ${report.source_name}</p>
    `;
    list.appendChild(li);
  }
}

loadDashboard();
setInterval(loadDashboard, 60000);

