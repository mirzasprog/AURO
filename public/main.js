const state = {
  data: {
    background: null,
    positions: [],
  },
  mode: 'select',
  scale: 1,
  selectedId: null,
  saveTimer: null,
  draggingId: null,
  dragOffset: { x: 0, y: 0 },
};

const planUpload = document.getElementById('plan-upload');
const replacePlanBtn = document.getElementById('replace-plan');
const removePlanBtn = document.getElementById('remove-plan');
const selectModeBtn = document.getElementById('select-mode');
const addModeBtn = document.getElementById('add-mode');
const copyBtn = document.getElementById('copy-position');
const deleteBtn = document.getElementById('delete-position');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomInBtn = document.getElementById('zoom-in');
const zoomValue = document.getElementById('zoom-value');
const planStage = document.getElementById('plan-stage');
const planContent = document.getElementById('plan-content');
const planImage = document.getElementById('plan-image');
const planOverlay = document.getElementById('plan-overlay');
const planPlaceholder = document.getElementById('plan-placeholder');
const selectedLabel = document.getElementById('selected-label');
const detailLabel = document.getElementById('detail-label');
const detailTenant = document.getElementById('detail-tenant');
const detailDate = document.getElementById('detail-date');
const detailValue = document.getElementById('detail-value');
const detailContract = document.getElementById('detail-contract');
const detailType = document.getElementById('detail-type');
const detailSize = document.getElementById('detail-size');
const detailHint = document.getElementById('detail-hint');

const DEFAULT_SIZE = 44;

function scheduleSave() {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
  }
  state.saveTimer = setTimeout(saveData, 400);
}

async function saveData() {
  state.saveTimer = null;
  await fetch('/api/pozicije', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.data),
  });
}

async function loadData() {
  const res = await fetch('/api/pozicije');
  state.data = await res.json();
  if (!state.data.positions) {
    state.data.positions = [];
  }
  renderBackground();
  renderPositions();
}

function setMode(mode) {
  state.mode = mode;
  selectModeBtn.classList.toggle('primary', mode === 'select');
  addModeBtn.classList.toggle('primary', mode === 'add');
}

function updateZoom(value) {
  state.scale = Math.min(2.5, Math.max(0.3, value));
  planContent.style.transform = `scale(${state.scale})`;
  zoomValue.textContent = `${Math.round(state.scale * 100)}%`;
}

function renderBackground() {
  const background = state.data.background;
  if (!background) {
    planImage.src = '';
    planImage.style.display = 'none';
    planPlaceholder.textContent = 'Učitaj nacrt (JPEG ili DWG) da bi započeo.';
    planPlaceholder.style.display = 'flex';
    planContent.style.width = '100%';
    planContent.style.height = '100%';
    return;
  }

  const isImage = background.type?.startsWith('image') || /\.(jpeg|jpg)$/i.test(background.name);
  if (isImage) {
    planImage.src = background.dataUrl;
    planImage.style.display = 'block';
    planPlaceholder.style.display = 'none';
  } else {
    planImage.src = '';
    planImage.style.display = 'none';
    planPlaceholder.textContent = `Učitan nacrt: ${background.name}. Pregled nije dostupan.`;
    planPlaceholder.style.display = 'flex';
    planContent.style.width = '100%';
    planContent.style.height = '100%';
  }
}

function renderPositions() {
  planOverlay.innerHTML = '';
  state.data.positions.forEach((position) => {
    const marker = document.createElement('div');
    marker.className = 'position-marker';
    marker.dataset.id = position.id;
    marker.textContent = position.label || position.id;
    marker.style.left = `${position.x}px`;
    marker.style.top = `${position.y}px`;
    marker.style.width = `${position.size || DEFAULT_SIZE}px`;
    marker.style.height = `${position.size || DEFAULT_SIZE}px`;

    if (position.id === state.selectedId) {
      marker.classList.add('selected');
    }

    marker.addEventListener('pointerdown', (event) => {
      if (state.mode !== 'select') return;
      event.stopPropagation();
      selectPosition(position.id);
      state.draggingId = position.id;
      const rect = planContent.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / state.scale - position.x;
      const offsetY = (event.clientY - rect.top) / state.scale - position.y;
      state.dragOffset = { x: offsetX, y: offsetY };
      marker.setPointerCapture(event.pointerId);
    });

    marker.addEventListener('pointerup', () => {
      if (state.draggingId) {
        state.draggingId = null;
        scheduleSave();
      }
    });

    planOverlay.appendChild(marker);
  });

  updateControls();
}

function updateControls() {
  const hasSelection = Boolean(state.selectedId);
  copyBtn.disabled = !hasSelection;
  deleteBtn.disabled = !hasSelection;
  detailLabel.disabled = !hasSelection;
  detailTenant.disabled = !hasSelection;
  detailDate.disabled = !hasSelection;
  detailValue.disabled = !hasSelection;
  detailContract.disabled = !hasSelection;
  detailType.disabled = !hasSelection;
  detailSize.disabled = !hasSelection;
  detailHint.textContent = hasSelection
    ? 'Promjene se automatski spremaju u bazu.'
    : 'Odaberite poziciju na nacrtu.';
}

function selectPosition(id) {
  state.selectedId = id;
  renderPositions();
  const position = state.data.positions.find((item) => item.id === id);
  if (!position) {
    selectedLabel.textContent = 'Nema odabrane';
    detailLabel.value = '';
    detailTenant.value = '';
    detailDate.value = '';
    detailValue.value = '';
    detailContract.value = '';
    detailType.value = '';
    detailSize.value = DEFAULT_SIZE;
    return;
  }
  selectedLabel.textContent = position.label || `Pozicija ${position.id}`;
  detailLabel.value = position.label || '';
  detailTenant.value = position.details?.tenant || '';
  detailDate.value = position.details?.date || '';
  detailValue.value = position.details?.value || '';
  detailContract.value = position.details?.contract || '';
  detailType.value = position.details?.type || '';
  detailSize.value = position.size || DEFAULT_SIZE;
}

function getNextLabel() {
  const existing = new Set(state.data.positions.map((pos) => pos.label));
  let index = state.data.positions.length + 1;
  while (existing.has(`P${String(index).padStart(3, '0')}`)) {
    index += 1;
  }
  return `P${String(index).padStart(3, '0')}`;
}

function addPosition(x, y) {
  const nextId = Date.now();
  const position = {
    id: nextId,
    label: getNextLabel(),
    x,
    y,
    size: DEFAULT_SIZE,
    details: {
      tenant: '',
      date: '',
      value: '',
      contract: '',
      type: '',
    },
  };
  state.data.positions.push(position);
  selectPosition(position.id);
  scheduleSave();
}

function copyPosition() {
  const original = state.data.positions.find((pos) => pos.id === state.selectedId);
  if (!original) return;
  const nextId = Date.now();
  const copy = {
    ...original,
    id: nextId,
    x: original.x + 24,
    y: original.y + 24,
  };
  state.data.positions.push(copy);
  selectPosition(copy.id);
  scheduleSave();
}

function deletePosition() {
  if (!state.selectedId) return;
  state.data.positions = state.data.positions.filter((pos) => pos.id !== state.selectedId);
  state.selectedId = null;
  renderPositions();
  selectPosition(null);
  scheduleSave();
}

function updateSelected(updates) {
  const position = state.data.positions.find((pos) => pos.id === state.selectedId);
  if (!position) return;
  Object.assign(position, updates);
  renderPositions();
  selectPosition(position.id);
  scheduleSave();
}

function updateSelectedDetails(updates) {
  const position = state.data.positions.find((pos) => pos.id === state.selectedId);
  if (!position) return;
  position.details = { ...position.details, ...updates };
  scheduleSave();
}

replacePlanBtn.addEventListener('click', () => planUpload.click());
removePlanBtn.addEventListener('click', () => {
  state.data.background = null;
  renderBackground();
  scheduleSave();
});

planUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.data.background = {
      name: file.name,
      type: file.type,
      dataUrl: reader.result,
    };
    renderBackground();
    scheduleSave();
  };
  reader.readAsDataURL(file);
});

planImage.addEventListener('load', () => {
  planContent.style.width = `${planImage.naturalWidth}px`;
  planContent.style.height = `${planImage.naturalHeight}px`;
});

selectModeBtn.addEventListener('click', () => setMode('select'));
addModeBtn.addEventListener('click', () => setMode('add'));
copyBtn.addEventListener('click', copyPosition);
deleteBtn.addEventListener('click', deletePosition);
zoomOutBtn.addEventListener('click', () => updateZoom(state.scale - 0.1));
zoomInBtn.addEventListener('click', () => updateZoom(state.scale + 0.1));

planStage.addEventListener('click', (event) => {
  if (state.mode !== 'add') return;
  const rect = planContent.getBoundingClientRect();
  const x = (event.clientX - rect.left) / state.scale;
  const y = (event.clientY - rect.top) / state.scale;
  addPosition(x, y);
});

planStage.addEventListener('pointermove', (event) => {
  if (!state.draggingId) return;
  const position = state.data.positions.find((pos) => pos.id === state.draggingId);
  if (!position) return;
  const rect = planContent.getBoundingClientRect();
  position.x = (event.clientX - rect.left) / state.scale - state.dragOffset.x;
  position.y = (event.clientY - rect.top) / state.scale - state.dragOffset.y;
  renderPositions();
});

planStage.addEventListener('pointerup', () => {
  if (state.draggingId) {
    state.draggingId = null;
    scheduleSave();
  }
});

planStage.addEventListener('pointerleave', () => {
  if (state.draggingId) {
    state.draggingId = null;
    scheduleSave();
  }
});

planStage.addEventListener('click', (event) => {
  if (state.mode !== 'select') return;
  if (event.target.closest('.position-marker')) return;
  state.selectedId = null;
  renderPositions();
  selectPosition(null);
});

detailLabel.addEventListener('input', (event) => {
  updateSelected({ label: event.target.value });
});

detailTenant.addEventListener('input', (event) => {
  updateSelectedDetails({ tenant: event.target.value });
});

detailDate.addEventListener('input', (event) => {
  updateSelectedDetails({ date: event.target.value });
});

detailValue.addEventListener('input', (event) => {
  updateSelectedDetails({ value: event.target.value });
});

detailContract.addEventListener('change', (event) => {
  updateSelectedDetails({ contract: event.target.value });
});

detailType.addEventListener('change', (event) => {
  updateSelectedDetails({ type: event.target.value });
});

detailSize.addEventListener('input', (event) => {
  updateSelected({ size: Number(event.target.value) });
});

updateZoom(1);
setMode('select');
loadData();
