'use strict';
const categoryNames={travel:'旅途',portrait:'人像',life:'日常',window:'窗光'};
const gallery=document.querySelector('#gallery');
const filters=[...document.querySelectorAll('[data-filter]')];
const dialog=document.querySelector('.lightbox');
const largeImage=document.querySelector('#light-image');
const loading=document.querySelector('#light-loading');
const featuredIds=['02','19','20','21','22','23','07','01','03','09','04'];
const orderedPhotos=[...gallery.querySelectorAll('.photo-link')].map(link=>PHOTOS.find(p=>p.id===link.dataset.photo));
const matches=(p,filter)=>filter==='all'||(filter==='featured'?featuredIds.includes(p.id):filter==='window'?p.collection==='window':p.category===filter);
let activeFilter='featured', pool=orderedPhotos.filter(p=>matches(p,'featured')), currentIndex=0, touchStart=null;
function layoutCards(){let index=0;gallery.querySelectorAll('.work-card').forEach(card=>{if(!card.hidden)card.dataset.position=String(index++%6);});}
layoutCards();
filters.forEach(button=>button.addEventListener('click',()=>{
  activeFilter=button.dataset.filter;
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const count=PHOTOS.filter(p=>matches(p,activeFilter)).length;
  gallery.querySelectorAll('.work-card').forEach(card=>{card.hidden=activeFilter==='featured'?card.dataset.featured!=='true':activeFilter==='window'?card.dataset.collection!=='window':activeFilter!=='all'&&card.dataset.category!==activeFilter;card.classList.remove('reveal-pending');});
  document.querySelector('#filter-status').textContent=`${activeFilter==='all'?'':(activeFilter==='featured'?'精选':categoryNames[activeFilter])+' · '}${count} 件作品`;
  layoutCards();
}));
function showPhoto(index){
  currentIndex=(index+pool.length)%pool.length;
  const photo=pool[currentIndex];
  loading.hidden=false;loading.textContent='正在加载照片…';
  largeImage.alt=photo.description;
  largeImage.src=photo.src;
  document.querySelector('#light-title').textContent=photo.title;
  document.querySelector('#light-description').textContent=categoryNames[photo.category]+' / '+photo.description;
  document.querySelector('#light-counter').textContent=`${String(currentIndex+1).padStart(2,'0')} / ${String(pool.length).padStart(2,'0')}`;
}
largeImage.addEventListener('load',()=>loading.hidden=true);
largeImage.addEventListener('error',()=>{loading.hidden=false;loading.textContent='照片暂时无法加载，请稍后重试。';});
document.querySelectorAll('.photo-link').forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  pool=orderedPhotos.filter(p=>matches(p,activeFilter));
  if(!pool.some(p=>p.id===link.dataset.photo))pool=orderedPhotos;
  showPhoto(pool.findIndex(p=>p.id===link.dataset.photo));
  dialog.showModal();document.body.classList.add('viewing');
}));
document.querySelector('#light-close').addEventListener('click',()=>dialog.close());
document.querySelector('#light-prev').addEventListener('click',()=>showPhoto(currentIndex-1));
document.querySelector('#light-next').addEventListener('click',()=>showPhoto(currentIndex+1));
dialog.addEventListener('close',()=>{document.body.classList.remove('viewing');touchStart=null;});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(currentIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(currentIndex-1);}});
dialog.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touchStart={x:event.clientX,y:event.clientY};});
dialog.addEventListener('pointerup',event=>{if(!touchStart||event.pointerType!=='touch')return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(currentIndex+(dx<0?1:-1));});
dialog.addEventListener('pointercancel',()=>touchStart=null);

const fullscreenButton=document.querySelector('#light-fullscreen');
if(!document.fullscreenEnabled)fullscreenButton.hidden=true;
fullscreenButton.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.requestFullscreen();}catch{fullscreenButton.hidden=true;}});
document.addEventListener('fullscreenchange',()=>{fullscreenButton.textContent=document.fullscreenElement?'退出全屏 ⛶':'全屏 ⛶';});
dialog.addEventListener('close',()=>{if(document.fullscreenElement===dialog)document.exitFullscreen().catch(()=>{});});
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reduceMotion.matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target);}});},{threshold:.08});
  gallery.querySelectorAll('.work-card:not([hidden])').forEach(card=>{card.classList.add('reveal-pending');observer.observe(card);});
}
let scrollFrame=0;
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?window.scrollY/max:0})`;scrollFrame=0;}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();
