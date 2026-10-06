const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav=document.querySelector('#maps'),tree=document.querySelector('#tree');
let maps=[],active=0;
function render(){
 nav.innerHTML=maps.map((map,i)=>`<button type="button" data-map="${i}" aria-pressed="${i===active}">${escape(map.title)}</button>`).join('');
 const map=maps[active];
 tree.innerHTML=`<div class="root-node"><h2>${escape(map.title)}</h2><p>${escape(map.subtitle)}</p><span class="label">${map.nodes.length} connected ideas</span></div><div class="branches">${map.nodes.map((n,i)=>`<details class="branch" ${i===0?'open':''}><summary>${escape(n.title)}</summary><div class="content"><p><span class="label">The simple idea</span>${escape(n.definition)}</p><p><span class="label">Example</span>${escape(n.example)}</p>${n.compare?`<p class="comparison"><span class="label">Connect / compare</span>${escape(n.compare)}</p>`:''}<p class="reference">${n.lab==='lab1'?'I2208':'I3304'} · Part ${escape(n.part)} · PDF page ${n.page}</p><a class="practice" href="./${n.lab}/?topic=${encodeURIComponent(n.topic)}&amp;level=All#setup">Practice ${escape(n.topic)} · ${n.lab==='lab1'?'Lab 1':'Lab 2'} ↗</a></div></details>`).join('')}</div>`;
}
nav.addEventListener('click',event=>{const button=event.target.closest('[data-map]');if(!button)return;active=Number(button.dataset.map);render();nav.querySelector(`[data-map="${active}"]`).focus();});
document.querySelector('#expand').onclick=()=>tree.querySelectorAll('details').forEach(d=>d.open=true);
document.querySelector('#collapse').onclick=()=>tree.querySelectorAll('details').forEach(d=>d.open=false);
document.querySelector('#theme').onclick=()=>{const light=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=light?'light':'dark';document.querySelector('#theme').textContent=light?'Dark theme':'Light theme';};
try{const response=await fetch('./concept-maps.json');if(!response.ok)throw Error();maps=await response.json();render();}catch{tree.innerHTML='<p>The maps could not load. Refresh this page or open it through the website.</p>';}
