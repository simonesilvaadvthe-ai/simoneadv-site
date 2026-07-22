const header=document.querySelector('.header');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>8));
const menuBtn=document.querySelector('.menu-btn'),menu=document.querySelector('.menu');menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
const care=[
['01','Escuta.','Antes de analisar documentos, ouvimos a sua história.<br><br>Porque nenhum processo começa no papel.<br><br>Começa na vida.'],
['02','Clareza.','Explicamos o cenário, as possibilidades e os próximos passos em uma linguagem que você compreende.'],
['03','Estratégia.','Cada orientação considera sua história, seus objetivos e o momento que você está vivendo.'],
['04','Segurança.','Apresentamos os caminhos possíveis com transparência, para que você possa decidir com tranquilidade.'],
['05','Respeito.','Cada pessoa é recebida com dignidade, atenção e cuidado durante toda a jornada.']];
const n=document.querySelector('#care-number'),t=document.querySelector('#care-title'),p=document.querySelector('#care-text');document.querySelectorAll('.care-nav button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.care-nav .active')?.classList.remove('active');b.classList.add('active');const x=care[+b.dataset.index];n.textContent=x[0];t.textContent=x[1];p.innerHTML=x[2]}));
document.querySelectorAll('.accordion details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.accordion details[open]').forEach(o=>{if(o!==d)o.open=false})}));
