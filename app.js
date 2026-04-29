// === Дані про жанри ===
const GENRES = {
  fiction:    { label: 'Художня',    bg: '#ede7f6', color: '#4527a0' },
  history:    { label: 'Історія',    bg: '#e0f2f1', color: '#00695c' },
  science:    { label: 'Наука',      bg: '#e3f2fd', color: '#1565c0' },
  poetry:     { label: 'Поезія',     bg: '#fce4ec', color: '#880e4f' },
  philosophy: { label: 'Філософія',  bg: '#fff8e1', color: '#e65100' }
};

// === Каталог книг ===
const books = [
  { id: 1,  title: 'Тіні забутих предків',                 author: 'Михайло Коцюбинський', year: 1911,  genre: 'fiction',    isbn: '978-617-679-100-1', status: 'available', shelf: 'А-12' },
  { id: 2,  title: 'Кобзар',                               author: 'Тарас Шевченко',       year: 1840,  genre: 'poetry',     isbn: '978-617-679-200-8', status: 'available', shelf: 'П-3'  },
  { id: 3,  title: 'Лісова пісня',                         author: 'Леся Українка',        year: 1911,  genre: 'fiction',    isbn: '978-617-679-300-5', status: 'taken',     shelf: 'А-7'  },
  { id: 4,  title: 'Чорна рада',                           author: 'Пантелеймон Куліш',    year: 1857,  genre: 'history',    isbn: '978-617-679-400-2', status: 'available', shelf: 'І-22' },
  { id: 5,  title: 'Місто',                                author: 'Валерʼян Підмогильний',year: 1928,  genre: 'fiction',    isbn: '978-617-679-500-9', status: 'taken',     shelf: 'А-15' },
  { id: 6,  title: 'Україна: Історія',                     author: 'Орест Субтельний',     year: 1988,  genre: 'history',    isbn: '978-617-679-600-6', status: 'available', shelf: 'І-5'  },
  { id: 7,  title: 'Маруся Чурай',                         author: 'Ліна Костенко',        year: 1979,  genre: 'poetry',     isbn: '978-617-679-700-3', status: 'available', shelf: 'П-9'  },
  { id: 8,  title: 'Світ як воля і уявлення',              author: 'Артур Шопенгауер',     year: 1818,  genre: 'philosophy', isbn: '978-617-679-800-0', status: 'taken',     shelf: 'Ф-1'  },
  { id: 9,  title: 'Час смертохристів',                    author: 'Василь Шкляр',         year: 2009,  genre: 'fiction',    isbn: '978-617-679-900-7', status: 'available', shelf: 'А-31' },
  { id: 10, title: 'Теорія всього',                        author: 'Стівен Гокінґ',        year: 2002,  genre: 'science',    isbn: '978-617-679-110-0', status: 'available', shelf: 'Н-4'  },
  { id: 11, title: 'Записки українського самашедшого',     author: 'Ліна Костенко',        year: 2010,  genre: 'fiction',    isbn: '978-617-679-120-9', status: 'taken',     shelf: 'А-9'  },
  { id: 12, title: 'Конфуцій. Судження і бесіди',          author: 'Конфуцій',             year: -479,  genre: 'philosophy', isbn: '978-617-679-130-8', status: 'available', shelf: 'Ф-7'  }
];

let filtered = [...books];

// === Оновлення статистики ===
function updateStats() {
  document.getElementById('s-total').textContent = books.length;
  document.getElementById('s-avail').textContent = books.filter(b => b.status === 'available').length;
  document.getElementById('s-taken').textContent = books.filter(b => b.status === 'taken').length;
  document.getElementById('s-found').textContent = filtered.length;
}

// === Відображення карток ===
function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  grid.innerHTML = '';

  if (!filtered.length) {
    empty.style.display = 'block';
    updateStats();
    return;
  }

  empty.style.display = 'none';

  filtered.forEach(function(b) {
    const gn = GENRES[b.genre];
    const yearText = b.year < 0 ? (Math.abs(b.year) + ' до н.е.') : b.year;
    const statusClass = b.status === 'available' ? 'avail' : 'taken';
    const statusText = b.status === 'available' ? 'Доступна' : 'Видана';

    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', b.title + ', ' + b.author);

    card.innerHTML =
      '<span class="card-genre" style="background:' + gn.bg + ';color:' + gn.color + '">' + gn.label + '</span>' +
      '<div class="card-title">' + b.title + '</div>' +
      '<div class="card-author">' + b.author + '</div>' +
      '<div class="card-meta">' +
        '<span>' + yearText + ' р.</span>' +
        '<span class="badge ' + statusClass + '">' + statusText + '</span>' +
      '</div>';

    card.addEventListener('click', function() { openModal(b.id); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { openModal(b.id); }
    });

    grid.appendChild(card);
  });

  updateStats();
}

// === Фільтрація ===
function applyFilters() {
  const q = document.getElementById('search').value.toLowerCase();
  const genre = document.getElementById('genre-filter').value;
  const status = document.getElementById('status-filter').value;

  filtered = books.filter(function(b) {
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchG = !genre || b.genre === genre;
    const matchS = !status || b.status === status;
    return matchQ && matchG && matchS;
  });

  renderGrid();
}

// === Відкрити модальне вікно ===
function openModal(id) {
  const b = books.find(function(x) { return x.id === id; });
  const gn = GENRES[b.genre];
  const yearText = b.year < 0 ? (Math.abs(b.year) + ' до н.е.') : b.year;
  const statusClass = b.status === 'available' ? 'avail' : 'taken';
  const statusText = b.status === 'available' ? 'Доступна' : 'Видана';

  document.getElementById('m-title').textContent = b.title;
  document.getElementById('m-author').textContent = b.author;

  document.getElementById('m-rows').innerHTML =
    '<tr><td>Жанр</td><td><span class="card-genre" style="background:' + gn.bg + ';color:' + gn.color + '">' + gn.label + '</span></td></tr>' +
    '<tr><td>Рік видання</td><td>' + yearText + '</td></tr>' +
    '<tr><td>ISBN</td><td>' + b.isbn + '</td></tr>' +
    '<tr><td>Полиця</td><td>' + b.shelf + '</td></tr>' +
    '<tr><td>Статус</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td></tr>';

  const btn = document.getElementById('m-action');
  btn.textContent = b.status === 'available' ? 'Позначити як видану' : 'Повернути до бібліотеки';

  btn.onclick = function() {
    b.status = b.status === 'available' ? 'taken' : 'available';
    applyFilters();
    openModal(id);
  };

  document.getElementById('modal-bg').classList.add('open');
}

// === Закрити модальне вікно ===
document.getElementById('close-modal').addEventListener('click', function() {
  document.getElementById('modal-bg').classList.remove('open');
});

document.getElementById('modal-bg').addEventListener('click', function(e) {
  if (e.target === document.getElementById('modal-bg')) {
    document.getElementById('modal-bg').classList.remove('open');
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('modal-bg').classList.remove('open');
  }
});

// === Слухачі фільтрів ===
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('genre-filter').addEventListener('change', applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);

// === Ініціалізація ===
applyFilters();
