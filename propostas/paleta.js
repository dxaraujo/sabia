// Paleta viva sobre a proposta: ?paleta=sobria|atual|nova, lembrada entre as propostas. Roda no <head> para não piscar.
(function(){
  var ok={sobria:1,atual:1,nova:1}, root=document.documentElement, p=new URLSearchParams(location.search).get('paleta');
  if(!ok[p]){try{p=localStorage.getItem('sabia-paleta')}catch(e){}}
  if(!ok[p]) p='nova';
  function aplicar(v){
    p=v;
    if(v==='sobria') root.removeAttribute('data-paleta'); else root.setAttribute('data-paleta',v);
    try{localStorage.setItem('sabia-paleta',v)}catch(e){}
    document.querySelectorAll('.proposta [data-p]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.p===v))});
  }
  aplicar(p);
  document.addEventListener('DOMContentLoaded',function(){
    var nav=document.querySelector('.proposta'); if(!nav) return;
    var g=document.createElement('span'); g.className='paletas';
    g.innerHTML='<b>Paleta</b>'+[['sobria','Sóbria'],['atual','Atual'],['nova','Nova']].map(function(x){return '<button type="button" data-p="'+x[0]+'">'+x[1]+'</button>'}).join('');
    nav.appendChild(g);
    g.addEventListener('click',function(e){var b=e.target.closest('[data-p]'); if(b) aplicar(b.dataset.p)});
    aplicar(p);
  });
})();
