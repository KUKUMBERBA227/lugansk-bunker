const $ = (id) => document.getElementById(id);
const statusDisplay = $('statusDisplay');

function updateClock() {
  const now = new Date();
  $('clock').textContent = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(now);
  $('dateLabel').textContent = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(now);
}

function setStatus(state, title, description) {
  statusDisplay.dataset.state = state;
  $('statusTitle').textContent = title;
  $('statusText').textContent = description;
}

function formatTimestamp(value) {
  if (!value) return 'Нет данных';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Нет данных';
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
  }).format(date);
}

async function loadRegionStatus() {
  // У официальных источников нет подтверждённого публичного API,
  // поэтому сайт не угадывает состояние тревоги и не показывает ложное «отбой».
  setStatus(
    'offline',
    'ПРОВЕРЯЙТЕ ОФИЦИАЛЬНЫЕ СООБЩЕНИЯ',
    'Автоматический статус не подключён. Используйте официальные каналы МЧС России по ЛНР.'
  );
  $('updatedAt').textContent = 'Автостатус не подключён';
}

function initMap() {
  if (!window.L) {
    $('map').innerHTML = '<div class="map-error">Не удалось загрузить карту. Проверьте подключение к интернету.</div>';
    return;
  }
  const map = L.map('map', { zoomControl: false, scrollWheelZoom: true }).setView([48.57, 39.31], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  const marker = L.circleMarker([48.57, 39.31], {
    radius: 7, color: '#b9a4ff', weight: 2,
    fillColor: '#8067d8', fillOpacity: 0.95
  }).addTo(map);
  marker.bindTooltip('Луганск · центр карты', { direction: 'top', offset: [0, -8] });
}

$('refreshBtn').addEventListener('click', loadRegionStatus);
$('statusRefresh').addEventListener('click', loadRegionStatus);
updateClock();
setInterval(updateClock, 1000);
initMap();
loadRegionStatus();
setInterval(loadRegionStatus, 60_000);
