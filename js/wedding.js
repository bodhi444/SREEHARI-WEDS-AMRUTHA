'use strict';

/* ══════════════════════════════════════════
   KERALA WEDDING — JAVASCRIPT
   Sreehari & Amrutha  ·  5 September 2026
══════════════════════════════════════════ */

const WEDDING_DATE = new Date('2026-09-05T10:30:00+05:30');

// ── DOM ──────────────────────────────────
const splash       = document.getElementById('splash');
const details      = document.getElementById('details');
const swipeTrack   = document.getElementById('swipeTrack');
const swipeThumb   = document.getElementById('swipeThumb');
const swipeLabel   = document.getElementById('swipeLabel');
const swipeFill    = document.getElementById('swipeFill');
const bgMusic      = document.getElementById('bgMusic');
const musicPill    = document.getElementById('musicPill');
const musicPillDet = document.getElementById('musicPillDetails');
const TRACKS = ['audio/ullam-paadum-wedding-song.mp3'];

let musicStarted = false, musicMuted = false, musicTrackIdx = 0;

/* ════════════════════════════════════════
   1. PETAL RAIN GENERATOR
════════════════════════════════════════ */
(function initPetalRain() {
  const container = document.getElementById('petalRain');
  if (!container) return;

  const PETAL_COUNT = 18;
  const COLORS = [
    ['rgba(209,77,140,0.80)', 'rgba(180,50,100,0.40)'],
    ['rgba(220,100,150,0.75)', 'rgba(160,40,90,0.35)'],
    ['rgba(230,130,100,0.70)', 'rgba(200,80,60,0.30)'],
    ['rgba(255,200,100,0.65)', 'rgba(200,150,50,0.30)'],
  ];

  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'rain-petal';
    const c = COLORS[i % COLORS.length];
    const size = 7 + Math.random() * 8;
    const left = Math.random() * 100;
    const dur  = 5 + Math.random() * 8;
    const del  = Math.random() * 10;
    p.style.cssText = `
      left:${left}%;
      width:${size}px; height:${size * 1.4}px;
      background:radial-gradient(ellipse at 35% 35%, ${c[0]}, ${c[1]});
      animation-duration:${dur}s;
      animation-delay:-${del}s;
      border-radius:${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    `;
    container.appendChild(p);
  }
})();

/* ════════════════════════════════════════
   2. GOLD PARTICLE GENERATOR
════════════════════════════════════════ */
(function initGoldParticles() {
  const container = document.getElementById('goldParticles');
  if (!container) return;

  const COUNT = 24;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'g-particle';
    const size = 2 + Math.random() * 3;
    const left = Math.random() * 100;
    const dur  = 6 + Math.random() * 10;
    const del  = Math.random() * 12;
    const bot  = Math.random() * 100;
    p.style.cssText = `
      left:${left}%;
      bottom:${bot}%;
      width:${size}px; height:${size}px;
      animation-duration:${dur}s;
      animation-delay:-${del}s;
    `;
    container.appendChild(p);
  }
})();

/* ════════════════════════════════════════
   3. AUDIO UNLOCK (iOS Safari)
════════════════════════════════════════ */
(function unlockAudio() {
  if (!bgMusic) return;
  function unlock() {
    bgMusic.muted = true;
    bgMusic.play().then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.muted = false;
    }).catch(() => {});
    document.removeEventListener('touchstart', unlock, true);
    document.removeEventListener('mousedown',  unlock, true);
  }
  document.addEventListener('touchstart', unlock, { capture:true, once:true, passive:true });
  document.addEventListener('mousedown',  unlock, { capture:true, once:true });
})();

/* ════════════════════════════════════════
   4. COUNTDOWN TIMER
════════════════════════════════════════ */
const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');
const cdSecs  = document.getElementById('cd-secs');

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }
function animDigit(el, v) {
  if (!el || el.textContent === v) return;
  el.classList.remove('flip'); void el.offsetWidth;
  el.textContent = v; el.classList.add('flip');
}
function tick() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) { [cdDays,cdHours,cdMins,cdSecs].forEach(e => animDigit(e,'00')); return; }
  const s = Math.floor(diff/1000);
  animDigit(cdDays,  pad(Math.floor(s/86400)));
  animDigit(cdHours, pad(Math.floor((s%86400)/3600)));
  animDigit(cdMins,  pad(Math.floor((s%3600)/60)));
  animDigit(cdSecs,  pad(s%60));
}
tick(); setInterval(tick, 1000);

/* ════════════════════════════════════════
   5. SWIPE-TO-OPEN
════════════════════════════════════════ */
(function initSwipe() {
  if (!swipeTrack || !swipeThumb) return;
  let dragging=false, startX=0, curX=0, trackW, thumbW, maxT;

  function geom() {
    trackW=swipeTrack.offsetWidth; thumbW=swipeThumb.offsetWidth; maxT=trackW-thumbW-16;
  }
  function setX(x) {
    x=Math.max(0,Math.min(x,maxT)); curX=x;
    const p=x/maxT;
    swipeThumb.style.transform=`translateY(-50%) translateX(${x}px)`;
    swipeLabel.style.opacity=String(Math.max(0,1-p*2));
    swipeFill.style.width=`${p*100}%`;
    swipeTrack.style.border=`1px solid rgba(200,155,60,${0.35+p*0.5})`;
  }
  function dragStart(cx){ geom(); dragging=true; startX=cx-curX; swipeThumb.style.transition='none'; swipeFill.style.transition='none'; swipeTrack.style.cursor='grabbing'; }
  function dragMove(cx){ if(!dragging)return; setX(cx-startX); }
  function dragEnd(){
    if(!dragging)return; dragging=false; swipeTrack.style.cursor='';
    if(curX/maxT>=0.78) complete(); else snapBack();
  }
  function snapBack(){
    swipeThumb.style.transition='transform .45s var(--ease,cubic-bezier(.32,.72,0,1))';
    swipeFill.style.transition='width .45s var(--ease,cubic-bezier(.32,.72,0,1))';
    swipeLabel.style.transition='opacity .3s'; setX(0); curX=0; swipeLabel.style.opacity='1';
  }
  function complete(){
    geom(); swipeThumb.style.transition='transform .3s var(--ease,cubic-bezier(.32,.72,0,1))';
    swipeFill.style.transition='width .3s ease'; setX(maxT);
    swipeTrack.classList.add('done'); swipeLabel.style.opacity='0'; swipeLabel.style.paddingLeft='0';
    setTimeout(()=>{ swipeLabel.textContent='See you there! ✓'; swipeLabel.style.opacity='1'; },250);

    if(bgMusic && !musicStarted){
      bgMusic.volume=0;
      bgMusic.play().then(()=>{
        musicStarted=true; musicMuted=false; updateMusicUI(); fadeVol(0,0.55,2000);
      }).catch(()=>{});
    }
    setTimeout(revealDetails,700);
  }
  swipeThumb.addEventListener('touchstart',e=>{e.preventDefault();dragStart(e.touches[0].clientX);},{passive:false});
  document.addEventListener('touchmove',e=>{if(dragging){e.preventDefault();dragMove(e.touches[0].clientX);}},{passive:false});
  document.addEventListener('touchend',()=>dragEnd());
  swipeThumb.addEventListener('mousedown',e=>{e.preventDefault();dragStart(e.clientX);});
  document.addEventListener('mousemove',e=>{if(dragging)dragMove(e.clientX);});
  document.addEventListener('mouseup',()=>dragEnd());
  window.addEventListener('resize',()=>{if(!swipeTrack.classList.contains('done'))curX=0;});
})();

/* ════════════════════════════════════════
   6. PAGE REVEAL + SCROLL-TRIGGERED REVEALS
════════════════════════════════════════ */
function revealDetails() {
  details.classList.add('revealed');
  details.removeAttribute('aria-hidden');
  splash.classList.add('exit');
  setTimeout(()=>{ splash.style.visibility='hidden'; },900);
  initScrollReveal();
}

function initScrollReveal() {
  const items = details.querySelectorAll('.reveal-up');

  // Check if already in view (top section)
  items.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('revealed');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal-up'))
          : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: details,
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  items.forEach(el => { if (!el.classList.contains('revealed')) observer.observe(el); });
}

/* ════════════════════════════════════════
   7. BACKGROUND MUSIC
════════════════════════════════════════ */
function fadeVol(from, to, ms) {
  const steps=40, interval=ms/steps, delta=(to-from)/steps;
  let cur=from;
  const t=setInterval(()=>{
    cur=Math.max(0,Math.min(1,cur+delta));
    bgMusic.volume=cur;
    if((delta>0&&cur>=to)||(delta<0&&cur<=to))clearInterval(t);
  },interval);
}
function playNext() {
  if(!bgMusic||TRACKS.length<2)return;
  musicTrackIdx=(musicTrackIdx+1)%TRACKS.length;
  bgMusic.src=TRACKS[musicTrackIdx]; bgMusic.load(); bgMusic.play().catch(()=>{});
}
function toggleMusic() {
  if(!bgMusic)return;
  if(!musicStarted){
    bgMusic.volume=0;
    bgMusic.play().then(()=>{
      musicStarted=true; musicMuted=false; updateMusicUI(); fadeVol(0,0.55,1000);
    }).catch(()=>{});
    return;
  }
  musicMuted=!musicMuted; bgMusic.muted=musicMuted; updateMusicUI();
}
function updateMusicUI(){
  const on=musicStarted&&!musicMuted;
  [musicPill,musicPillDet].filter(Boolean).forEach(p=>{
    p.classList.toggle('playing',on);
    p.setAttribute('aria-label', on?'Mute music':'Play Mangal Vadya');
  });
}
if(musicPill)    musicPill.addEventListener('click',toggleMusic);
if(musicPillDet) musicPillDet.addEventListener('click',toggleMusic);
if(bgMusic)      bgMusic.addEventListener('ended',playNext);

/* ════════════════════════════════════════
   8. ICS CALENDAR (iOS Apple Calendar)
════════════════════════════════════════ */
function generateICS() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sreehari & Amrutha Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Sreehari & Amrutha Wedding',
    // Ceremony
    'BEGIN:VEVENT',
    'DTSTART:20260905T050000Z',
    'DTEND:20260905T060000Z',
    'SUMMARY:Sreehari & Amrutha — Wedding Ceremony',
    'LOCATION:Community Hall\\, Sreekandapuram',
    'DESCRIPTION:Muhurtham: 10:30 AM – 11:30 AM\\nSaturday\\, 5th September 2026',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Wedding Ceremony in 1 hour!',
    'END:VALARM',
    'END:VEVENT',
    // Reception
    'BEGIN:VEVENT',
    'DTSTART:20260907T103000Z',
    'DTEND:20260907T163000Z',
    'SUMMARY:Sreehari & Amrutha — Wedding Reception',
    'LOCATION:Surabhi Avenue\\, Perambra',
    'DESCRIPTION:Wedding Reception from 4:00 PM\\nMonday\\, 7th September 2026',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Wedding Reception in 1 hour!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type:'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href=url; a.download='Sreehari-Amrutha-Wedding.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 60000);
}
const icsBtn = document.getElementById('icsDownloadBtn');
if(icsBtn) icsBtn.addEventListener('click', generateICS);

/* ════════════════════════════════════════
   9. DOWNLOAD WEDDING CARD
════════════════════════════════════════ */
async function downloadCard(btn) {
  const CARD_URL = 'assets/wedding-card.jpg';
  const FILENAME = 'Sreehari-Amrutha-WeddingCard.jpg';
  const origHTML = btn.innerHTML;
  btn.innerHTML='<i data-lucide="loader" width="15" height="15" class="spin-icon"></i> Downloading…';
  btn.disabled=true;
  try {
    const res  = await fetch(CARD_URL);
    if(!res.ok) throw new Error('not found');
    const blob = await res.blob();
    const file = new File([blob], FILENAME, { type:blob.type||'image/jpeg' });
    // Try native share on mobile (supports sharing files)
    if(navigator.canShare && navigator.canShare({ files:[file] })) {
      await navigator.share({ files:[file], title:'Sreehari & Amrutha — Wedding Card', text:'You\'re invited! ✨' });
    } else {
      // Fallback: programmatic download via blob URL
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download=FILENAME;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    }
  } catch(e) {
    // Final fallback: open image directly so user can long-press / save
    window.open(CARD_URL, '_blank');
  }
  finally {
    btn.innerHTML=origHTML; btn.disabled=false;
    if(typeof lucide!=='undefined') lucide.createIcons();
  }
}
const dlBtn=document.getElementById('downloadCardBtn');
if(dlBtn) dlBtn.addEventListener('click', ()=>downloadCard(dlBtn));

/* ════════════════════════════════════════
   10. HAPTIC FEEDBACK
════════════════════════════════════════ */
if(swipeThumb) swipeThumb.addEventListener('touchstart', ()=>{ if('vibrate' in navigator)navigator.vibrate(10); }, {passive:true});

/* ════════════════════════════════════════
   11. LUCIDE ICONS
════════════════════════════════════════ */
if(typeof lucide!=='undefined') lucide.createIcons();

/* ════════════════════════════════════════
   12. ACCORDION
════════════════════════════════════════ */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const hdr = item.querySelector('.accordion-header');
    if(!hdr)return;
    hdr.addEventListener('click', ()=>{
      const open=item.classList.contains('open');
      items.forEach(i=>{ i.classList.remove('open'); i.querySelector('.accordion-header')?.setAttribute('aria-expanded','false'); });
      if(!open){ item.classList.add('open'); hdr.setAttribute('aria-expanded','true'); }
    });
  });
})();

/* ════════════════════════════════════════
   13. LAMP FLICKER INTENSIFY ON SCROLL
       (increases glow brightness as user scrolls)
════════════════════════════════════════ */
(function initLampScroll() {
  if(!details)return;
  details.addEventListener('scroll', ()=>{
    const pct = Math.min(details.scrollTop / 400, 1);
    const glows = details.querySelectorAll('.k-lamp-glow');
    glows.forEach(g => { g.style.opacity = String(0.6 + pct * 0.4); });
  }, { passive:true });
})();
