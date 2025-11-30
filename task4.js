const latin = [
  "Consuetudo est altera natura",
  "Nota bene",
  "Nulla calamitas sola",
  "Per aspera ad astra"
];
const russian = [
  "Привычка - вторая натура",
  "Заметьте хорошо!",
  "Беда не приходит одна",
  "Через тернии к звёздам"
];

let usedIndex = [];
function getRandomIndex() {
  if (usedIndex.length === latin.length) 
    return -1;
  let index;
  do {
    index = Math.floor(Math.random() * latin.length);
  } 
  while (usedIndex.includes(index));
  usedIndex.push(index);
  return index;
}

let tableClick = 0;
document.getElementById('add-row').onclick = function() {
  const tbody = document.querySelector('#sent-table tbody');
  const index = getRandomIndex();
  if (index === -1) {
    alert("Фразы закончились");
    return;
  }
  tableClick++;
  const tr = document.createElement('tr');

  if (tableClick % 2 === 1){
    tr.className = 'class1';
  }
  else {
    tr.className = 'class2';
  }
  
  const td1 = document.createElement('td');
  td1.textContent = latin[index];
  const td2 = document.createElement('td');
  td2.textContent = russian[index];
  tr.appendChild(td1);
  tr.appendChild(td2);
  tbody.appendChild(tr);
};

document.getElementById('recolor-table').onclick = function() {
  const trs = document.querySelectorAll('#sent-table tbody tr');
  trs.forEach((tr, i) => {
    if ((i + 1) % 2 === 0) 
      tr.classList.add('bold');
  });
};


let linesClick = 0;
document.getElementById('add-lines').onclick = function() {
  const index = getRandomIndex();
  if (index === -1) {
    alert("Фразы закончились");
    return;
  }
  linesClick++;
  const div = document.getElementById('rand');
  const p = document.createElement('p');
  p.innerHTML = "<span class='underline'>n=" + (linesClick - 1) + "</span> " + "<span class='italic'>" + latin[index] + "</span> " + russian[index];
  
  if (linesClick % 2 === 1){
    p.className = 'class1';
  }
  else {
    p.className = 'class2';
  }
  div.appendChild(p);
};

document.getElementById('recolor-lines').onclick = function() {
  const lines = document.querySelectorAll('#rand p');
  lines.forEach((p, i) => {
    if ((i + 1) % 2 === 0) {
      p.classList.add('bold');
    }
  });
};


let listClick = 0;
document.getElementById('add-list-item').onclick = function() {
  const index = getRandomIndex();
  if (index === -1) {
    alert("Фразы закончились");
    return;
  }
  listClick++;
  const ol = document.getElementById('nested-list');
  const li = document.createElement('li');
  li.textContent = latin[index]; 

  const ul = document.createElement('ul');
  const subli = document.createElement('li');
  subli.textContent = russian[index];

  ul.appendChild(subli);
  li.appendChild(ul);
  
  if (listClick % 2 === 1){
    li.className = 'class1';
  }
  else {
    li.className = 'class2';
  }
  ol.appendChild(li);
};

document.getElementById('recolor-list').onclick = function() {
  const listItems = document.querySelectorAll('#nested-list > li');
  listItems.forEach((li, i) => {
    if ((i + 1) % 2 === 0) {
      li.classList.add('bold');
    }
  });
};