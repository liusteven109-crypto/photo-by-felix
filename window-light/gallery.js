'use strict';
const categoryNames={landscape:'风景',human:'人文',light:'光影',portrait:'人像'};
const dialog=document.querySelector('.lightbox');
const largeImage=document.querySelector('#light-image');
const loading=document.querySelector('#light-loading');
let pool=PHOTOS,currentIndex=0,touchStart=null;
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
  const selected=PHOTOS.find(p=>p.id===link.dataset.photo);
  pool=PHOTOS.filter(p=>p.chapter===selected.chapter);
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
const chapters=[...document.querySelectorAll('.exhibition-chapter')];
const chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
let scrollFrame=0;
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?window.scrollY/max:0})`;let active=chapters[0];for(const chapter of chapters){if(chapter.getBoundingClientRect().top<=150)active=chapter;}chapterLinks.forEach(link=>{if(link.hash==='#'+active.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});scrollFrame=0;}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();

