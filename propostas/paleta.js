// Paleta e modo sobre a proposta: ?paleta=sobria|atual|nova&modo=claro|escuro, lembrados entre as propostas.
// Roda no <head> para não piscar; a barra de troca ganha os botões quando a página carrega.
(function(){
  var root=document.documentElement, q=new URLSearchParams(location.search);
  var OP={paleta:[['sobria','Sóbria'],['atual','Atual'],['nova','Nova']],modo:[['claro','Claro'],['escuro','Escuro']]};
  var PADRAO={paleta:'nova',modo:'claro'}, SEM={paleta:'sobria',modo:'claro'}, ROT={paleta:'Paleta',modo:'Modo'}, v={};
  function valido(k,x){return OP[k].some(function(o){return o[0]===x})}
  function ler(k){
    var x=q.get(k);
    if(!valido(k,x)){try{x=localStorage.getItem('sabia-'+k)}catch(e){}}
    return valido(k,x)?x:PADRAO[k];
  }
  function aplicar(k,x){
    v[k]=x;
    if(x===SEM[k]) root.removeAttribute('data-'+k); else root.setAttribute('data-'+k,x);
    try{localStorage.setItem('sabia-'+k,x)}catch(e){}
    document.querySelectorAll('.proposta [data-k="'+k+'"]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===x))});
  }
  for(var k in OP) aplicar(k,ler(k));
  document.addEventListener('DOMContentLoaded',function(){
    var nav=document.querySelector('.proposta'); if(!nav) return;
    for(var k in OP){
      var s=document.createElement('span'); s.className='paletas';
      s.innerHTML='<b>'+ROT[k]+'</b>'+OP[k].map(function(o){return '<button type="button" data-k="'+k+'" data-v="'+o[0]+'">'+o[1]+'</button>'}).join('');
      nav.appendChild(s);
    }
    nav.addEventListener('click',function(e){var b=e.target.closest('[data-k]'); if(b) aplicar(b.dataset.k,b.dataset.v)});
    for(var j in OP) aplicar(j,v[j]);
  });
})();
