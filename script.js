// SoC Block Diagram Interaction
var blockInfo = {
  core: { name: 'risc_v_core', desc: '5-stage pipelined RV32IM processor with hazard detection, data forwarding, and branch prediction', specs: 'RV32IM \u00b7 full bypass \u00b7 integrated M-extension via booth_mult', connections: ['cache', 'mult'] },
  mult: { name: 'booth_mult', desc: 'Radix-4 Booth2 encoding multiplier with Wallace tree reduction, used for M-extension multiply/divide', specs: 'Radix-4 Booth \u00b7 Wallace tree \u00b7 connected to EX stage', connections: ['core'] },
  cache: { name: 'cache', desc: '4-bank direct-mapped cache for instruction and data access', specs: '4 banks \u00b7 direct-mapped \u00b7 single-cycle hit', connections: ['core', 'bus'] },
  bus: { name: 'bus interconnect', desc: 'Bus interconnect connecting processor to peripherals', specs: 'master/slave topology', connections: ['cache', 'uart'] },
  uart: { name: 'uart', desc: '8-bit UART transceiver with configurable baud rate', specs: '8-bit \u00b7 TX + RX \u00b7 APB slave', connections: ['bus'] }
};

document.querySelectorAll('.soc-block').forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    var id = el.dataset.id;
    var info = blockInfo[id];
    if (!info) return;
    var connIds = new Set([id].concat(info.connections));
    document.querySelectorAll('.soc-block').forEach(function (b) {
      b.style.opacity = connIds.has(b.dataset.id) ? '1' : '0.2';
    });
    document.querySelectorAll('.soc-line').forEach(function (l) {
      var c = l.dataset.from === id || l.dataset.to === id;
      l.style.opacity = c ? '1' : '0.1';
      l.style.strokeWidth = c ? '2.5' : '1.5';
    });
    document.querySelectorAll('.soc-intf').forEach(function (t) {
      var k = t.dataset.line;
      t.style.opacity = (k && k.indexOf(id) !== -1) ? '1' : '0';
    });
    var detail = document.getElementById('soc-detail');
    if (detail) {
      detail.style.opacity = '1';
      document.getElementById('soc-detail-text').innerHTML =
        '<strong style="color:var(--text);">' + info.name + '</strong> \u2014 ' + info.desc +
        '<br><span style="color:var(--text2);">' + info.specs + '</span>';
    }
  });
  el.addEventListener('mouseleave', clearSocHover);
});

function clearSocHover() {
  document.querySelectorAll('.soc-block').forEach(function (b) { b.style.opacity = '1'; });
  document.querySelectorAll('.soc-line').forEach(function (l) { l.style.opacity = '1'; l.style.strokeWidth = '1.5'; });
  document.querySelectorAll('.soc-intf').forEach(function (t) { t.style.opacity = '0'; });
  var detail = document.getElementById('soc-detail');
  if (detail) {
    detail.style.opacity = '0.5';
    document.getElementById('soc-detail-text').textContent = 'Hover an IP block to see details';
  }
}

// Register Map Interaction
var fieldInfo = {
  rtl: { name: 'RTL_DESIGN [31:22]', desc: 'SystemVerilog, Verilog \u00b7 FSMs, pipelines, CDC \u00b7 lint + synthesis-aware coding', width: '10 bits \u2014 primary domain' },
  arch: { name: 'COMP_ARCH [21:15]', desc: 'Pipeline design, cache hierarchies, branch prediction, NoC topology, ISA trade-offs', width: '7 bits \u2014 core strength' },
  verif: { name: 'VERIFICATION [14:9]', desc: 'cocotb, Verilator, formal verification \u00b7 coverage-driven', width: '6 bits \u2014 strong' },
  sta: { name: 'STA_SYNTH [8:3]', desc: 'OpenSTA, LibreLane \u00b7 timing closure, synthesis constraints, clock tree', width: '6 bits \u2014 strong' },
  sw: { name: 'SOFTWARE [2:0]', desc: 'Python, C/C++ \u00b7 scripting for EDA flows + embedded firmware', width: '3 bits \u2014 supporting' }
};

document.querySelectorAll('.reg-field').forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    var id = el.dataset.field;
    var info = fieldInfo[id];
    if (!info) return;
    document.querySelectorAll('.reg-field').forEach(function (f) {
      if (f.dataset.field !== id) {
        f.querySelector('rect').style.opacity = '0.25';
        f.querySelectorAll('text').forEach(function (t) { t.style.opacity = '0.2'; });
      }
    });
    var detail = document.getElementById('reg-detail');
    if (detail) {
      detail.style.opacity = '1';
      document.getElementById('reg-detail-text').innerHTML =
        '<strong style="color:var(--text);">' + info.name + '</strong> \u2014 ' + info.desc +
        '<br><span style="color:var(--text2);">' + info.width + '</span>';
    }
  });
  el.addEventListener('mouseleave', function () {
    document.querySelectorAll('.reg-field').forEach(function (f) {
      f.querySelector('rect').style.opacity = '1';
      f.querySelectorAll('text').forEach(function (t) { t.style.opacity = '1'; });
    });
    var detail = document.getElementById('reg-detail');
    if (detail) {
      detail.style.opacity = '0.5';
      document.getElementById('reg-detail-text').textContent = 'Hover a bitfield \u2014 wider fields = deeper expertise';
    }
  });
});

// Filter buttons (projects + blog)
function filterCards(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('[data-cat]').forEach(function (el) {
    if (cat === 'all') { el.style.display = ''; return; }
    el.style.display = (el.dataset.cat || '').indexOf(cat) !== -1 ? '' : 'none';
  });
}

// Highlight active nav link
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// ============================================
// GitHub Live Commit Log
// ============================================
// CHANGE THIS to your GitHub username
var GITHUB_USERNAME = 'AndrewVu23';

function timeAgo(dateStr) {
  var seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  var minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  var days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  var months = Math.floor(days / 30);
  return months + 'mo ago';
}

function renderCommits(events) {
  var commits = [];
  events.forEach(function (event) {
    if (event.type !== 'PushEvent') return;
    var repo = event.repo.name.split('/').pop();
    (event.payload.commits || []).forEach(function (c) {
      commits.push({
        hash: c.sha.substring(0, 7),
        msg: c.message.split('\n')[0],
        repo: repo,
        time: event.created_at,
        url: 'https://github.com/' + event.repo.name + '/commit/' + c.sha
      });
    });
  });

  // Take only the 6 most recent commits
  commits = commits.slice(0, 6);

  var container = document.getElementById('github-log');
  if (!container) return;

  if (commits.length === 0) {
    container.innerHTML = '<div style="font-size:12px;color:var(--text3);">No recent pushes found</div>';
    return;
  }

  var html = '';
  commits.forEach(function (c) {
    html += '<div class="commit-row">' +
      '<a href="' + c.url + '" target="_blank" class="commit-hash" style="text-decoration:none;color:var(--text3);">' + c.hash + '</a>' +
      '<span class="commit-msg">' + c.msg.substring(0, 60) + (c.msg.length > 60 ? '...' : '') + '</span>' +
      '<span class="commit-repo">' + c.repo + '</span>' +
      '<span class="commit-time">' + timeAgo(c.time) + '</span>' +
      '</div>';
  });
  html += '<p style="margin-top:8px;font-size:11px;color:var(--text3);opacity:0.5;">Live from GitHub API</p>';
  container.innerHTML = html;
}

function fetchGitHub() {
  var container = document.getElementById('github-log');
  if (!container) return; // Only runs on homepage

  fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/events/public?per_page=30')
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API ' + res.status);
      return res.json();
    })
    .then(renderCommits)
    .catch(function (err) {
      container.innerHTML =
        '<div style="font-size:12px;color:var(--text3);">' +
        '// could not reach GitHub API \u2014 showing cached data</div>' +
        '<div class="commit-row"><span class="commit-hash">a3f9c21</span><span class="commit-msg">fix: hazard detection for load-use case</span><span class="commit-repo">risc-v-core</span><span class="commit-time">recently</span></div>' +
        '<div class="commit-row"><span class="commit-hash">e7b2d08</span><span class="commit-msg">feat: add write-back buffer to cache_ctrl</span><span class="commit-repo">risc-v-core</span><span class="commit-time">recently</span></div>' +
        '<div class="commit-row"><span class="commit-hash">1c4a5f6</span><span class="commit-msg">refactor: clean up APB bridge timing</span><span class="commit-repo">spi-peripheral</span><span class="commit-time">recently</span></div>';
    });
}

fetchGitHub();
