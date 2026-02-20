
const sections = document.querySelectorAll(".section");
window.addEventListener("scroll", () => {
  const trigger = window.innerHeight * 0.85;
  sections.forEach(sec => {
    if(sec.getBoundingClientRect().top < trigger){
      sec.classList.add("active");
    }
  });

  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progressBar = document.querySelector(".progress");
  if(progressBar){
    progressBar.style.width = (scrollTop / scrollHeight) * 100 + "%";
  }
});


const canvas = document.getElementById("particles");
if(canvas){
  const ctx = canvas.getContext("2d");

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];
  for(let i = 0; i < 150; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random()
    });
  }

  function animateParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if(p.x < 0) p.x = canvas.width;
      if(p.x > canvas.width) p.x = 0;
      if(p.y < 0) p.y = canvas.height;
      if(p.y > canvas.height) p.y = 0;

      ctx.fillStyle = `rgba(255,0,127,${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}
