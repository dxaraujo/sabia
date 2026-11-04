// Seletor de tema do site: Sóbria - Sabiá (padrão) ou Sabiá. Roda no <head> para não piscar; a escolha fica no
// localStorage com a mesma chave das propostas (sabia-paleta).
(function(){
  var root=document.documentElement, OP=[['sobria-sabia','Sóbria'],['sabia','Sabiá']], v='sobria-sabia';
  try{var s=localStorage.getItem('sabia-paleta'); if(OP.some(function(o){return o[0]===s})) v=s}catch(e){}
  function aplicar(x){
    v=x;
    if(x==='sabia'){root.removeAttribute('data-sobria');root.setAttribute('data-paleta','sabia')}
    else{root.removeAttribute('data-paleta');root.setAttribute('data-sobria',x)}
    try{localStorage.setItem('sabia-paleta',x)}catch(e){}
    document.querySelectorAll('#temas [data-v]').forEach(function(b){b.setAttribute('aria-checked',String(b.dataset.v===x))});
  }
  aplicar(v);
  document.addEventListener('DOMContentLoaded',function(){
    var top=document.querySelector('.wrap>.top'); if(!top) return;
    var d=document.createElement('div'); d.className='tema';
    d.innerHTML='<button type="button" class="tema-btn" popovertarget="temas" aria-label="Tema" title="Tema">'
      +'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg></button>'
      +'<div id="temas" popover role="menu" aria-label="Tema">'+OP.map(function(o){return '<button type="button" role="menuitemradio" data-v="'+o[0]+'"><i class="'+o[0]+'"></i>'+o[1]+'</button>'}).join('')+'</div>';
    top.appendChild(d);
    var m=d.querySelector('#temas'), btn=d.querySelector('.tema-btn');
    // popover fica na camada do topo; posição absoluta no documento, alinhada à direita do botão
    m.addEventListener('beforetoggle',function(e){if(e.newState!=='open') return; var r=btn.getBoundingClientRect();
      m.style.top=(r.bottom+window.scrollY+6)+'px'; m.style.right=(document.documentElement.clientWidth-r.right)+'px'});
    m.addEventListener('click',function(e){var b=e.target.closest('[data-v]'); if(b){aplicar(b.dataset.v); m.hidePopover()}});
    aplicar(v);
  });
})();
