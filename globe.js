const radians = Math.PI / 180;
const destinations = {
  marrakech: { lat: 31.63, lon: -7.98, label: 'Marrakech, Maroc' },
  tokyo: { lat: 35.68, lon: 139.69, label: 'Tokyo, Japon' },
  lisbon: { lat: 38.72, lon: -9.14, label: 'Lisbonne, Portugal' }
};

export async function initGlobe() {
  const canvas = document.querySelector('#globe');
  const context = canvas.getContext('2d');
  const stage = canvas.parentElement;
  if (!context) { document.querySelector('.globe-fallback').hidden = false; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let data;
  try {
    const response = await fetch('assets/globe.json');
    if (!response.ok) throw new Error('Globe unavailable');
    data = await response.json();
  } catch { canvas.hidden = true; document.querySelector('.globe-fallback').hidden = false; return; }
  const dots = data.dots.map(([lon, lat]) => sphere(lon, lat));
  const borders = data.borders.map(ring => ring.map(([lon, lat]) => sphere(lon, lat)));
  let width = 0, height = 0, radius = 0;
  let longitude = -9, latitude = 17, target = null;
  let selected = destinations.marrakech;
  let paused = reduced.matches, dragging = false, pointer = null, visible = true;
  let frame = 0, previous = 0, lastInteraction = performance.now();
  const motion = document.querySelector('#globe-motion');

  function sphere(lon, lat) {
    const phi = lat * radians, theta = lon * radians;
    return [Math.cos(phi) * Math.sin(theta), Math.sin(phi), Math.cos(phi) * Math.cos(theta)];
  }
  function project(point, sinLon, cosLon, sinLat, cosLat) {
    const x = point[0] * cosLon - point[2] * sinLon;
    const depth = point[0] * sinLon + point[2] * cosLon;
    const y = point[1] * cosLat - depth * sinLat;
    const z = point[1] * sinLat + depth * cosLat;
    return [width / 2 + x * radius, height / 2 - y * radius, z];
  }
  function draw(now = 0) {
    const delta = Math.min((now - previous) / 1000, .05); previous = now;
    if (!width || !visible) return;
    if (target && !dragging) {
      const factor = reduced.matches ? 1 : .09;
      longitude += (((target.lon - longitude + 540) % 360) - 180) * factor;
      latitude += (target.lat - latitude) * factor;
      if (Math.abs(latitude - target.lat) < .02 && Math.abs((((target.lon - longitude + 540) % 360) - 180)) < .02) target = null;
    } else if (!paused && !dragging && now - lastInteraction > 2500) longitude += delta * 2.4;
    longitude = ((longitude + 540) % 360) - 180;
    context.clearRect(0, 0, width, height);
    const sinLon = Math.sin(longitude * radians), cosLon = Math.cos(longitude * radians), sinLat = Math.sin(latitude * radians), cosLat = Math.cos(latitude * radians);
    const p = point => project(point, sinLon, cosLon, sinLat, cosLat);
    const glow = context.createRadialGradient(width / 2, height / 2, radius * .85, width / 2, height / 2, radius * 1.2);
    glow.addColorStop(0, '#78bc5d00'); glow.addColorStop(.45, '#8edc6c0d'); glow.addColorStop(1, '#8edc6c00');
    context.fillStyle = glow; context.beginPath(); context.arc(width / 2, height / 2, radius * 1.2, 0, Math.PI * 2); context.fill();
    const sea = context.createRadialGradient(width * .39, height * .3, 0, width / 2, height / 2, radius);
    sea.addColorStop(0, '#1c3220'); sea.addColorStop(.72, '#0c1e13'); sea.addColorStop(1, '#0a150e');
    context.fillStyle = sea; context.beginPath(); context.arc(width / 2, height / 2, radius, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#6b95503b'; context.lineWidth = .6;
    function line(points) {
      context.beginPath(); let drawing = false;
      for (const point of points) {
        const [x, y, z] = p(point);
        if (z < .015) { drawing = false; continue; }
        if (!drawing) { context.moveTo(x, y); drawing = true; } else context.lineTo(x, y);
      }
      context.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = []; for (let lon = -180; lon <= 180; lon += 4) points.push(sphere(lon, lat)); line(points);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const points = []; for (let lat = -90; lat <= 90; lat += 4) points.push(sphere(lon, lat)); line(points);
    }
    for (const dot of dots) {
      const [x, y, z] = p(dot);
      if (z < .02) continue;
      context.fillStyle = `rgba(174,207,114,${.25 + z * .6})`;
      const size = Math.max(.55, radius / 220 * (.6 + z * .55));
      context.fillRect(x, y, size, size);
    }
    context.strokeStyle = '#a8ca7d80'; context.lineWidth = .65;
    for (const border of borders) line(border);
    // A true geographic point on the visible hemisphere, not a decorative marker.
    const [x, y, z] = p(sphere(selected.lon, selected.lat));
    if (z > .04) {
      context.strokeStyle = '#b6f7bd66'; context.lineWidth = 1; context.beginPath(); context.arc(x,y,10,0,Math.PI*2); context.stroke();
      context.fillStyle = '#dbffe1'; context.beginPath(); context.arc(x,y,3,0,Math.PI*2); context.fill();
    }
    context.strokeStyle = '#8cab623f'; context.lineWidth = 1; context.beginPath(); context.arc(width / 2,height / 2,radius,0,Math.PI*2); context.stroke();
  }
  function animate(now) {
    if (now - previous > 32) draw(now);
    frame = requestAnimationFrame(animate);
  }
  const resize = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width; height = entry.contentRect.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    radius = Math.min(width * .405, height * .44); draw(performance.now());
  });
  resize.observe(stage);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '80px' }); visibility.observe(stage);
  motion.addEventListener('click', () => {
    paused = !paused; motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', paused ? 'Reprendre la rotation du globe' : 'Mettre la rotation du globe en pause');
    motion.querySelector('img').src = paused ? 'assets/player-play.svg' : 'assets/player-pause.svg';
  });
  function syncMotion() { paused = reduced.matches; motion.setAttribute('aria-pressed', String(paused)); motion.setAttribute('aria-label', paused ? 'Reprendre la rotation du globe' : 'Mettre la rotation du globe en pause'); motion.querySelector('img').src = paused ? 'assets/player-play.svg' : 'assets/player-pause.svg'; }
  syncMotion(); reduced.addEventListener('change', syncMotion);
  document.querySelectorAll('[data-destination]').forEach(button => button.addEventListener('click', () => {
    selected = destinations[button.dataset.destination]; target = { lat: selected.lat - 8, lon: selected.lon - 10 }; lastInteraction = performance.now();
    document.querySelector('#globe-place').textContent = selected.label;
    document.querySelectorAll('[data-destination]').forEach(other => other.setAttribute('aria-pressed', String(button === other)));
  }));
  canvas.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') return; dragging = true; pointer = [event.clientX,event.clientY]; canvas.setPointerCapture(event.pointerId); target = null; });
  canvas.addEventListener('pointermove', event => { if (!dragging || !pointer) return; longitude -= (event.clientX-pointer[0]) * .35; latitude = Math.max(-65,Math.min(65,latitude+(event.clientY-pointer[1])*.3)); pointer = [event.clientX,event.clientY]; lastInteraction = performance.now(); });
  const end = () => { dragging = false; pointer = null; lastInteraction = performance.now(); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  frame = requestAnimationFrame(animate);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); reduced.removeEventListener('change', syncMotion); }, { once: true });
}
