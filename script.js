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
