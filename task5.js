let active = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.draggable').forEach(el => {
  el.onmousedown = function(e) {
    active = el;
    const area = document.querySelector('.puzzle-area');
    const rect = area.getBoundingClientRect();
    offset.x = e.clientX - el.offsetLeft - rect.left;
    offset.y = e.clientY - el.offsetTop - rect.top;
    el.style.zIndex = 100;
    el.classList.add('active');
  };
});

document.onmousemove = function(e) {
  if (active) {
    const area = document.querySelector('.puzzle-area');
    const rect = area.getBoundingClientRect();
    let x = e.clientX - rect.left - offset.x;
    let y = e.clientY - rect.top - offset.y;
    x = Math.max(0, Math.min(rect.width - active.offsetWidth, x));
    y = Math.max(0, Math.min(rect.height - active.offsetHeight, y));
    active.style.left = x + 'px';
    active.style.top = y + 'px';
  }
};

document.onmouseup = function() {
  if (active) {
    active.classList.remove('active');
    active.style.zIndex = '';
    active = null;
  }
};

function getCurrentRotation(el) {
  const st = window.getComputedStyle(el, null);
  const tr = st.getPropertyValue("transform");
  if (tr && tr !== 'none') {
    const values = tr.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    if (angle < 0) 
      angle += 360;
    return angle;
  }
  return 0;
}

document.querySelectorAll('.draggable').forEach(el => {
  el.ondblclick = function() {
    let angle = getCurrentRotation(el);
    angle = (angle + 45) % 360;
    el.style.transform = `rotate(${angle}deg)`;
  };
});
