const USER_ROLE = 'Uprava';
let zaglavljeList = [];
let currentStavke = [];
let activeZaglavljeId = null;

const zaglavljaBody = document.getElementById('zaglavlja-body');
const stavkeModal = document.getElementById('stavke-modal');
const stavkeBody = document.getElementById('stavke-body');
const closeModalBtn = document.getElementById('close-modal');
const saveStavkeBtn = document.getElementById('save-stavke');
const discardStavkeBtn = document.getElementById('discard-stavke');
const akcijaHeader = document.querySelector('.akcija-col');

function formatDate(value) {
  const date = new Date(value);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()} ${date
    .toTimeString()
    .slice(0, 5)}`;
}

async function fetchZaglavlja() {
  const res = await fetch('/api/vip-zaglavlja');
  zaglavljeList = await res.json();
  renderZaglavlja();
}

function renderZaglavlja() {
  zaglavljaBody.innerHTML = '';
  zaglavljeList.forEach((item) => {
    const tr = document.createElement('tr');
    tr.classList.add(`status-${item.Status || 'Nepoznato'}`);

    tr.innerHTML = `
      <td>${item.Id}</td>
      <td>${item.Opis}</td>
      <td>${formatDate(item.Pocetak)}</td>
      <td>${formatDate(item.Kraj)}</td>
      <td><button class="link-btn" data-id="${item.Id}">${item.BrojStavki}</button></td>
      <td><span class="status-pill ${item.Status}">${item.Status}</span></td>
      <td class="action-cell akcija-cell ${USER_ROLE === 'Uprava' ? '' : 'hidden'}">
        <button class="primary" data-action="open" data-id="${item.Id}">✏️ Uredi</button>
      </td>
    `;

    const stavkeBtn = tr.querySelector('button.link-btn');
    stavkeBtn.addEventListener('click', () => openStavkeModal(item.Id));

    const actionBtn = tr.querySelector('[data-action="open"]');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => openStavkeModal(item.Id));
    }

    zaglavljaBody.appendChild(tr);
  });

  if (USER_ROLE !== 'Uprava') {
    akcijaHeader.classList.add('hidden');
  }
}

async function openStavkeModal(zaglavljeId) {
  activeZaglavljeId = zaglavljeId;
  const res = await fetch(`/api/vip-zaglavlja/${zaglavljeId}/stavke`);
  currentStavke = await res.json();
  renderStavke();
  stavkeModal.classList.remove('hidden');
}

function renderStavke() {
  stavkeBody.innerHTML = '';
  currentStavke.forEach((stavka) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${stavka.Id}</td>
      <td>${stavka.SifraArtikla}</td>
      <td>${stavka.NazivArtikla}</td>
      <td><input type="number" min="0" value="${stavka.Kolicina}" data-id="${stavka.Id}" /></td>
      <td>${stavka.Prodavnica}</td>
      <td class="success-mark">✔</td>
    `;
    stavkeBody.appendChild(tr);
  });
}

function closeModal() {
  stavkeModal.classList.add('hidden');
  activeZaglavljeId = null;
  currentStavke = [];
}

async function saveStavke() {
  if (!activeZaglavljeId) return;
  const inputs = Array.from(stavkeBody.querySelectorAll('input'));
  const updates = inputs.map((input) => ({
    Id: Number(input.dataset.id),
    Kolicina: Number(input.value),
  }));

  await fetch(`/api/vip-zaglavlja/${activeZaglavljeId}/stavke`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  await fetchZaglavlja();
  closeModal();
}

function discardChanges() {
  if (!activeZaglavljeId) return;
  openStavkeModal(activeZaglavljeId);
}

closeModalBtn.addEventListener('click', closeModal);
saveStavkeBtn.addEventListener('click', saveStavke);
discardStavkeBtn.addEventListener('click', discardChanges);
stavkeModal.addEventListener('click', (event) => {
  if (event.target === stavkeModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !stavkeModal.classList.contains('hidden')) {
    closeModal();
  }
});

fetchZaglavlja();
