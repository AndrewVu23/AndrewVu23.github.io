// SoC Block Diagram Interaction
var blockInfo = {
  core: { name: 'risc_v_core', desc: '5-stage pipelined RV32IM processor with hazard detection, data forwarding, and branch prediction', specs: 'RV32IM \u00b7 full bypass \u00b7 integrated M-extension via booth_mult', connections: ['cache', 'mult'], link: 'https://github.com/AndrewVu23/HOMEMADE-5-STAGE-PIPELINED-RISC-V' },
  mult: { name: 'booth_mult', desc: 'Radix-4 Booth2 encoding multiplier with Wallace tree reduction, used for M-extension multiply/divide', specs: 'Radix-4 Booth \u00b7 Wallace tree \u00b7 connected to EX stage', connections: ['core'], link: 'https://github.com/AndrewVu23/HOMEMADE-DIGITAL-COMPONENTS/tree/main/Multiplier' },
  cache: { name: 'cache', desc: '4-bank direct-mapped cache for instruction and data access', specs: '4 banks \u00b7 direct-mapped \u00b7 single-cycle hit', connections: ['core', 'bus'], link: 'https://github.com/AndrewVu23/HOMEMADE-DIGITAL-COMPONENTS/tree/main/Cache/4-banked%20Cache' },
  bus: { name: 'bus interconnect', desc: 'Bus interconnect connecting processor to peripherals', specs: 'master/slave topology', connections: ['cache', 'uart'], link: null },
  uart: { name: 'uart', desc: '8-bit UART transceiver with configurable baud rate', specs: '8-bit \u00b7 TX + RX \u00b7 APB slave', connections: ['bus'], link: 'https://github.com/AndrewVu23/HOMEMADE-8BIT-UART-PROTOCOL' }
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
      var linkHint = info.link ? ' <span style="color:var(--info);margin-left:6px;">click to view source \u2197</span>' : '';
      document.getElementById('soc-detail-text').innerHTML =
        '<strong style="color:var(--text);">' + info.name + '</strong> \u2014 ' + info.desc +
        '<br><span style="color:var(--text2);">' + info.specs + '</span>' + linkHint;
    }
  });
  el.addEventListener('mouseleave', clearSocHover);
  el.addEventListener('click', function () {
    var id = el.dataset.id;
    var info = blockInfo[id];
    if (!info || !info.link) return;
    window.open(info.link, '_blank');
  });
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

// Theme toggle
(function () {
  var toggle = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

// Highlight active nav link
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// Bottom nav chip traces
(function () {
  var wrap = document.querySelector('.bottom-nav-wrap');
  if (!wrap) return;
  var nav = wrap.querySelector('.bottom-nav');
  var svg = wrap.querySelector('.bottom-nav-svg');
  if (!nav || !svg) return;

  function drawTraces() {
    var items = nav.querySelectorAll('a, .current');
    var wrapRect = wrap.getBoundingClientRect();
    var centerX = wrapRect.width / 2;
    var chipW = 44, chipH = 22;
    var totalH = 50;
    var chipY = 0;
    var traceStart = chipY + chipH;
    var traceEnd = totalH;
    var style = getComputedStyle(document.documentElement);
    var borderColor = style.getPropertyValue('--border').trim() || '#333';
    var textColor = style.getPropertyValue('--text2').trim() || '#999';
    var purpleColor = style.getPropertyValue('--purple').trim() || '#7c6bff';

    var termColor = style.getPropertyValue('--term').trim() || '#8ecb72';
    // chip body
    var paths = '<rect x="' + (centerX - chipW/2) + '" y="' + chipY + '" width="' + chipW + '" height="' + chipH + '" rx="3" fill="none" stroke="' + termColor + '" stroke-width="1" opacity="0.7"/>';
    // chip pins on bottom
    var pinSpacing = chipW / 6;
    for (var p = 1; p <= 5; p++) {
      var px = centerX - chipW/2 + pinSpacing * p;
      paths += '<line x1="' + px + '" y1="' + (chipY + chipH) + '" x2="' + px + '" y2="' + (chipY + chipH + 3) + '" stroke="' + termColor + '" stroke-width="1" opacity="0.5"/>';
    }
    // chip label
    paths += '<text x="' + centerX + '" y="' + (chipY + chipH/2 + 4) + '" text-anchor="middle" font-size="10" font-family="var(--mono)" fill="' + termColor + '" opacity="0.8">MUX</text>';

    var midY = traceStart + (traceEnd - traceStart) * 0.55;

    items.forEach(function (item) {
      var r = item.getBoundingClientRect();
      var itemCenterX = r.left + r.width / 2 - wrapRect.left;
      var isCurrent = item.classList.contains('current');
      var col = isCurrent ? purpleColor : borderColor;
      var opacity = isCurrent ? '0.8' : '0.4';
      var sw = isCurrent ? '1' : '0.5';
      paths += '<path d="M' + centerX + ' ' + (traceStart + 3) + ' L' + centerX + ' ' + midY + ' L' + itemCenterX + ' ' + midY + ' L' + itemCenterX + ' ' + traceEnd + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" opacity="' + opacity + '"/>';
      paths += '<circle cx="' + itemCenterX + '" cy="' + midY + '" r="1.5" fill="' + col + '" opacity="' + opacity + '"/>';
    });

    svg.setAttribute('width', wrapRect.width);
    svg.setAttribute('height', totalH);
    svg.innerHTML = paths;
  }

  drawTraces();
  window.addEventListener('resize', drawTraces);
})();

