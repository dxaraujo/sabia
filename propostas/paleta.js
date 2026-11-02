// Paleta e modo sobre a proposta: ?paleta=sobria|atual|…&modo=claro|escuro, lembrados entre as propostas.
// Roda no <head> para não piscar; a barra de troca ganha os botões quando a página carrega.
(function(){
  var root=document.documentElement, q=new URLSearchParams(location.search);
  var OP={paleta:[["sobria", "Sóbria"], ["sobria-sabia", "Sóbria - Sabiá"], ["atual", "Atual"], ["sabia", "Sabiá"], ["arctic", "Arctic Innovation"], ["botanical", "Botanical Tech"], ["digital", "Digital Spectrum"], ["mineral", "Mineral Balance"], ["aurora", "Aurora Spectrum"], ["v-pastel", "Pastel / Suave"], ["v-neon", "Neon / Alta saturação"], ["v-corporativa", "Corporativa / Sóbria"], ["v-retro", "Retrô / Vintage"], ["v-minimalista", "Minimalista"], ["i-nebula", "Nebula Tech"], ["i-horizon", "AI Horizon"], ["i-quantum", "Quantum Flow"], ["i-infinity", "Infinity Gradient"], ["i-aurora", "Tech Aurora"]],modo:[['claro','Claro'],['escuro','Escuro']]};
  var GRUPO={"sobria": "base", "sobria-sabia": "base", "atual": "base", "sabia": "base", "arctic": "Similares à atual · Direções", "botanical": "Similares à atual · Direções", "digital": "Similares à atual · Direções", "mineral": "Similares à atual · Direções", "aurora": "Similares à atual · Direções", "v-pastel": "Similares à atual · Variações da atual", "v-neon": "Similares à atual · Variações da atual", "v-corporativa": "Similares à atual · Variações da atual", "v-retro": "Similares à atual · Variações da atual", "v-minimalista": "Similares à atual · Variações da atual", "i-nebula": "Similares à atual · Paletas de IA", "i-horizon": "Similares à atual · Paletas de IA", "i-quantum": "Similares à atual · Paletas de IA", "i-infinity": "Similares à atual · Paletas de IA", "i-aurora": "Similares à atual · Paletas de IA"};
  var PADRAO={paleta:'sobria',modo:'claro'}, SEM={paleta:'sobria',modo:'claro'}, ROT={paleta:'Paleta',modo:'Modo'}, v={};
  function valido(k,x){return OP[k].some(function(o){return o[0]===x})}
  function ler(k){
    var x=q.get(k);
    if(!valido(k,x)){try{x=localStorage.getItem('sabia-'+k)}catch(e){}}
    return valido(k,x)?x:PADRAO[k];
  }
  function aplicar(k,x){
    v[k]=x;
    if(k==='paleta'&&x.indexOf('sobria')===0){
      // sóbria e variantes: sem as regras de paleta viva; a variante só troca tokens (data-sobria)
      root.removeAttribute('data-paleta');
      if(x==='sobria') root.removeAttribute('data-sobria'); else root.setAttribute('data-sobria',x);
    } else {
      if(k==='paleta') root.removeAttribute('data-sobria');
      if(x===SEM[k]) root.removeAttribute('data-'+k); else root.setAttribute('data-'+k,x);
    }
    try{localStorage.setItem('sabia-'+k,x)}catch(e){}
    document.querySelectorAll('.proposta [data-k="'+k+'"]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===x))});
  }
  for(var k in OP) aplicar(k,ler(k));
  document.addEventListener('DOMContentLoaded',function(){
    var nav=document.querySelector('.proposta'); if(!nav) return;
    // paleta numa lista suspensa agrupada (são muitas); modo em botões
    var sp=document.createElement('span'); sp.className='paletas';
    var grupos={}; OP.paleta.forEach(function(o){(grupos[GRUPO[o[0]]]=grupos[GRUPO[o[0]]]||[]).push(o)});
    sp.innerHTML='<b>Paleta</b><select aria-label="Paleta">'+Object.keys(grupos).map(function(g){return '<optgroup label="'+g+'">'+grupos[g].map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>'}).join('')+'</optgroup>'}).join('')+'</select>';
    nav.appendChild(sp);
    var sel=sp.querySelector('select'); sel.value=v.paleta; sel.addEventListener('change',function(){aplicar('paleta',sel.value)});
    var sm=document.createElement('span'); sm.className='paletas';
    sm.innerHTML='<b>'+ROT.modo+'</b>'+OP.modo.map(function(o){return '<button type="button" data-k="modo" data-v="'+o[0]+'">'+o[1]+'</button>'}).join('');
    nav.appendChild(sm);
    nav.addEventListener('click',function(e){
      var b=e.target.closest('[data-k]'); if(b) aplicar(b.dataset.k,b.dataset.v);
      if(e.target.closest('a')) salvarRolagem();
    });
    for(var j in OP) aplicar(j,v[j]);
  });

  // Rolagem entre propostas: as alturas mudam de um tema para outro, então guarda a seção do topo da tela e quanto dela
  // já passou, e volta ao mesmo ponto relativo na outra página.
  var MARCOS='.sign.hero,section[id],footer';
  function salvarRolagem(){
    var els=document.querySelectorAll(MARCOS), y=window.scrollY, m={i:-1,f:0};
    for(var i=els.length-1;i>=0;i--){
      var t=els[i].getBoundingClientRect().top+y;
      if(t<=y+1){m={i:i,f:Math.min(1,(y-t)/els[i].offsetHeight)};break}
    }
    try{sessionStorage.setItem('sabia-rolagem',JSON.stringify(m))}catch(e){}
  }
  function restaurarRolagem(){
    var m; try{m=JSON.parse(sessionStorage.getItem('sabia-rolagem'));sessionStorage.removeItem('sabia-rolagem')}catch(e){}
    if(!m||m.i<0) return;
    var el=document.querySelectorAll(MARCOS)[m.i]; if(!el) return;
    window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY+m.f*el.offsetHeight);
  }
  // espera fontes e mapa assentarem, senão a posição calculada muda logo depois
  window.addEventListener('load',function(){(document.fonts?document.fonts.ready:Promise.resolve()).then(restaurarRolagem)});
})();
