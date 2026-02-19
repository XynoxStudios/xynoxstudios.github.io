/* Scroll Reveal + Progress */
const sections=document.querySelectorAll(".section");
window.addEventListener("scroll",()=>{
  const trigger=window.innerHeight*.85;
  sections.forEach(sec=>{
    if(sec.getBoundingClientRect().top<trigger){
      sec.classList.add("active");
    }
  });

  const scrollTop=document.documentElement.scrollTop;
  const scrollHeight=document.documentElement.scrollHeight-document.documentElement.clientHeight;
  document.querySelector(".progress").style.width=(scrollTop/scrollHeight)*100+"%";
});

/* Cursor */
const cursor=document.querySelector(".cursor");
document.addEventListener("mousemove",e=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
});

/* Particles Background */
const canvas=document.getElementById("particles");
if(canvas){
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  let particles=[];
  for(let i=0;i<120;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      size:Math.random()*2,
      speedY:Math.random()*0.5+0.2
    });
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(106,0,255,.5)";
    particles.forEach(p=>{
      p.y+=p.speedY;
      if(p.y>canvas.height)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// INSANESMP tile hover particles
document.querySelectorAll(".smp-tile").forEach(tile=>{
  const canvas = tile.querySelector(".smp-particles");
  const ctx = canvas.getContext("2d");
  canvas.width = tile.offsetWidth;
  canvas.height = tile.offsetHeight;

  let particles = [];
  for(let i=0;i<50;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      size:Math.random()*2+1,
      speedX:(Math.random()-0.5)*1,
      speedY:(Math.random()-0.5)*1,
      opacity: Math.random()
    });
  }

  let animating = false;

  function animateParticles(){
    if(!animating) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.speedX;
      p.y += p.speedY;

      if(p.x<0) p.x=canvas.width;
      if(p.x>canvas.width) p.x=0;
      if(p.y<0) p.y=canvas.height;
      if(p.y>canvas.height) p.y=0;

      ctx.fillStyle = `rgba(255,0,127,${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  tile.addEventListener("mouseenter", ()=>{
    animating = true;
    animateParticles();
  });

  tile.addEventListener("mouseleave", ()=>{
    animating = false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });

  // Update canvas size on resize
  window.addEventListener("resize", ()=>{
    canvas.width = tile.offsetWidth;
    canvas.height = tile.offsetHeight;
  });
});
