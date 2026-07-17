(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion){
    revealEls.forEach(el=>el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(el=>io.observe(el));
  }

  /* ---- trail progress (left edge) ---- */
  const fill = document.getElementById('trailFill');
  const marker = document.getElementById('trailMarker');
  function updateTrail(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
    if(fill) fill.style.height = pct + '%';
    if(marker) marker.style.top = pct + '%';
  }
  let ticking = false;
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(()=>{ updateTrail(); ticking = false; });
      ticking = true;
    }
  });
  updateTrail();

  /* ---- nav active link ---- */
  const navLinks = document.querySelectorAll('nav a[data-nav]');
  const sections = ['viaje','lugar','heroes-clase','referencias'].map(id=>document.getElementById(id)).filter(Boolean);
  if(sections.length){
    const navIo = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          navLinks.forEach(a=>a.classList.remove('active'));
          const match = document.querySelector('nav a[data-nav="'+entry.target.id+'"]');
          if(match) match.classList.add('active');
        }
      });
    },{threshold:0, rootMargin:'-45% 0px -45% 0px'});
    sections.forEach(s=>navIo.observe(s));
  }

  /* ---- cursor glow (desktop only) ---- */
  if(!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow = document.getElementById('cursorGlow');
    let gx=0, gy=0, tx=0, ty=0;
    window.addEventListener('mousemove', (e)=>{
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('show');
    });
    function animateGlow(){
      gx += (tx-gx)*0.15; gy += (ty-gy)*0.15;
      glow.style.transform = 'translate('+(gx-190)+'px,'+(gy-190)+'px)';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* hero mountain parallax */
    const hero = document.getElementById('heroSection');
    const m1 = document.querySelector('.hero-mountains .m1');
    const m2 = document.querySelector('.hero-mountains .m2');
    if(hero){
      hero.addEventListener('mousemove', (e)=>{
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width - 0.5;
        if(m1) m1.style.transform = 'translateX(' + (x*14) + 'px)';
        if(m2) m2.style.transform = 'translateX(' + (x*-22) + 'px)';
      });
    }

    /* tilt on cards */
    function attachTilt(el, intensity){
      el.addEventListener('mousemove', (e)=>{
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width - 0.5;
        const y = (e.clientY - r.top)/r.height - 0.5;
        el.style.transform = 'perspective(700px) rotateX('+(-y*intensity).toFixed(2)+'deg) rotateY('+(x*intensity).toFixed(2)+'deg)';
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
    }
    document.querySelectorAll('.mini-card').forEach(el=>attachTilt(el,7));
    document.querySelectorAll('.hero-slot').forEach(el=>attachTilt(el,4));
  }

  /* ---- life story accordion ---- */
  document.querySelectorAll('.life-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.life-item');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.querySelector('span').parentNode.firstChild.textContent = open ? 'Cerrar capítulo ' : 'Descubrir este capítulo ';
    });
  });

  /* ---- playlist play toggle ---- */
  document.querySelectorAll('[data-track]').forEach(track=>{
    track.addEventListener('click', ()=>{
      const wasPlaying = track.classList.contains('playing');
      document.querySelectorAll('[data-track]').forEach(t=>{
        t.classList.remove('playing');
        t.querySelector('.play-btn').textContent = '▶';
      });
      if(!wasPlaying){
        track.classList.add('playing');
        track.querySelector('.play-btn').textContent = '❚❚';
      }
    });
  });
})();
