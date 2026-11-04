// Tema do site: paleta Sóbria - Sabiá (padrão) ou Sabiá, e modo claro ou escuro (padrão: o do sistema).
// Roda no <head> para não piscar; as escolhas ficam no localStorage (sabia-paleta, sabia-modo);
// sabia-modo só existe quando difere do sistema.
(function(){
  var root=document.documentElement, OP=[['sobria-sabia','Sóbria'],['sabia','Sabiá']];
  var SOL='<svg class="sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var LUA='<svg class="lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  var PALETA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>';
  function ler(k){try{return localStorage.getItem('sabia-'+k)}catch(e){}}
  function gravar(k,x){try{localStorage.setItem('sabia-'+k,x)}catch(e){}}
  var paleta=OP.some(function(o){return o[0]===ler('paleta')})?ler('paleta'):'sobria-sabia';
  var SO=matchMedia('(prefers-color-scheme: dark)');
  function doSistema(){return SO.matches?'escuro':'claro'}
  var modo=ler('modo'); if(modo!=='claro'&&modo!=='escuro') modo=doSistema();

  function aplicarPaleta(x){
    paleta=x;
    if(x==='sabia'){root.removeAttribute('data-sobria');root.setAttribute('data-paleta','sabia')}
    else{root.removeAttribute('data-paleta');root.setAttribute('data-sobria',x)}
    document.querySelectorAll('#temas [data-v]').forEach(function(b){b.setAttribute('aria-checked',String(b.dataset.v===x))});
  }
  function aplicarModo(x){
    modo=x;
    if(x==='escuro') root.setAttribute('data-modo','escuro'); else root.removeAttribute('data-modo');
    var s=document.querySelector('.modo-sw'); if(s) s.setAttribute('aria-checked',String(x==='escuro'));
  }
  aplicarPaleta(paleta); aplicarModo(modo);
  // sem escolha gravada, acompanha o sistema ao vivo
  SO.addEventListener('change',function(){if(!ler('modo')) aplicarModo(doSistema())});

  document.addEventListener('DOMContentLoaded',function(){
    var top=document.querySelector('.wrap>.top'); if(!top) return;
    var d=document.createElement('div'); d.className='tema';
    d.innerHTML='<button type="button" class="modo-sw" role="switch" aria-label="Modo escuro" title="Claro ou escuro">'
      +'<span class="trilha">'+SOL+LUA+'</span><span class="botao">'+SOL+LUA+'</span></button>'
      +'<button type="button" class="tema-btn" popovertarget="temas" aria-label="Paleta" title="Paleta">'+PALETA+'</button>'
      +'<div id="temas" popover role="menu" aria-label="Paleta">'+OP.map(function(o){return '<button type="button" role="menuitemradio" data-v="'+o[0]+'"><i class="'+o[0]+'"></i>'+o[1]+'</button>'}).join('')+'</div>';
    top.appendChild(d);
    var m=d.querySelector('#temas'), btn=d.querySelector('.tema-btn');
    // popover fica na camada do topo; posição absoluta no documento, alinhada à direita do botão
    m.addEventListener('beforetoggle',function(e){if(e.newState!=='open') return; var r=btn.getBoundingClientRect();
      m.style.top=(r.bottom+window.scrollY+6)+'px'; m.style.right=(document.documentElement.clientWidth-r.right)+'px'});
    m.addEventListener('click',function(e){var b=e.target.closest('[data-v]'); if(b){aplicarPaleta(b.dataset.v); gravar('paleta',paleta); m.hidePopover()}});
    d.querySelector('.modo-sw').addEventListener('click',function(){aplicarModo(modo==='escuro'?'claro':'escuro');
      // voltar ao modo do sistema apaga a escolha: o site torna a segui-lo
      if(modo===doSistema()){try{localStorage.removeItem('sabia-modo')}catch(e){}} else gravar('modo',modo)});
    aplicarPaleta(paleta); aplicarModo(modo);
  });
})();
