(()=>{'use strict';
const records=window.TOWN_TIME_RECORDS||[];
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const fileUrl=(file,width=1400)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g,'_'))}?width=${width}`;
const filePage=file=>`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g,'_'))}`;
const byId=id=>records.find(record=>record.id===id);
let filter='photo',year=2025,selected='castle-2025',map=null,markers=new Map(),mapTimer=null,mapLoaded=false;

function visible(){return records.filter(record=>record.type===filter&&record.year<=year).sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title));}
function ensureSelection(){const list=visible();if(!list.some(record=>record.id===selected))selected=list[0]?.id||null;return list;}

function render(){
  const list=ensureSelection();
  $('yearOutput').value=year;
  $('resultCount').textContent=`${list.length} ${filter==='photo'?'dated photograph'+(list.length===1?'':'s'):'historical stor'+(list.length===1?'y':'ies')} up to ${year}`;
  $('mapHeading').textContent=`${list.length} ${filter==='photo'?'dated photograph'+(list.length===1?'':'s'):'historical stor'+(list.length===1?'y':'ies')}`;
  $('recordStrip').innerHTML=list.length?list.map(record=>`<button class="record-card ${record.id===selected?'active':''}" type="button" data-record="${esc(record.id)}">${record.file?`<img loading="lazy" src="${fileUrl(record.file,160)}" alt="">`:'<span class="story-thumb">STORY</span>'}<span><small>${esc(record.dateLabel)}</small><b>${esc(record.title)}</b></span></button>`).join(''):'<p>No records are dated this early. Move the timeline forward.</p>';
  $('recordStrip').querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.record,true)));
  renderSelected(list);
  updateMarkers(list);
}

function renderSelected(list){
  const record=byId(selected);
  if(!record){$('recordTitle').textContent='No records in this period';return;}
  const isPhoto=record.type==='photo';
  const hero=$('heroImage'),fallback=$('photoFallback'),stage=document.querySelector('.photo-stage');
  stage.classList.toggle('story-mode',!isPhoto);
  $('kindLabel').textContent=isPhoto?'VERIFIED DATED PHOTOGRAPH':'HISTORICAL STORY · NO PERIOD PHOTO';
  $('kindLabel').className=`record-kind ${isPhoto?'photo-kind':'story-kind'}`;
  $('photoCount').textContent=`${String(list.findIndex(item=>item.id===record.id)+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
  $('recordYear').textContent=record.year;
  $('recordDate').textContent=`${record.dateLabel} · ${record.category}`;
  $('recordTitle').textContent=record.title;
  $('recordLocation').textContent=`⌖ ${record.location}`;
  $('recordSummary').textContent=record.summary;
  $('recordCredit').textContent=isPhoto?`${record.artist} · ${record.licence} · ${record.accuracy}`:`Source: ${record.sourceName} · ${record.accuracy}`;
  $('compareButton').hidden=!record.compare;
  $('sourceLink').href=isPhoto?filePage(record.file):record.source;
  hero.onload=()=>{fallback.hidden=true;hero.style.opacity='1'};
  hero.onerror=()=>{hero.style.opacity='0';fallback.hidden=false};
  if(isPhoto){fallback.hidden=true;hero.style.opacity='.3';hero.src=fileUrl(record.file);hero.alt=`${record.title}, ${record.dateLabel}`;}else{hero.removeAttribute('src');hero.alt='';fallback.hidden=true;}
  const index=list.findIndex(item=>item.id===record.id);
  $('previousButton').disabled=list.length<2;$('nextButton').disabled=list.length<2;
  $('previousButton').onclick=()=>select(list[(index-1+list.length)%list.length].id,true);
  $('nextButton').onclick=()=>select(list[(index+1)%list.length].id,true);
  if(mapLoaded&&Number.isFinite(record.lon))map.easeTo({center:[record.lon,record.lat],duration:650,zoom:Math.max(map.getZoom(),14)});
}

function select(id,scroll=false){selected=id;render();if(scroll)$('recordStrip').querySelector('.active')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}

function updateMarkers(list){
  if(!mapLoaded)return;
  const ids=new Set(list.map(record=>record.id));
  markers.forEach((marker,id)=>{if(!ids.has(id)){marker.remove();markers.delete(id);}});
  list.forEach(record=>{
    if(!markers.has(record.id)){
      const element=document.createElement('button');element.type='button';element.className=`marker ${record.type}`;element.title=`${record.dateLabel}: ${record.title}`;element.setAttribute('aria-label',element.title);element.addEventListener('click',event=>{event.stopPropagation();select(record.id,true)});
      markers.set(record.id,new maplibregl.Marker({element}).setLngLat([record.lon,record.lat]).addTo(map));
    }
    markers.get(record.id).getElement().classList.toggle('active',record.id===selected);
  });
}

function mapFailed(){
  clearTimeout(mapTimer);mapLoaded=false;$('mapFallback').hidden=false;$('map').style.visibility='hidden';
  try{map?.remove()}catch{}map=null;markers.clear();
}
function initMap(){
  $('mapFallback').hidden=true;$('map').style.visibility='visible';
  if(!window.maplibregl){mapFailed();return;}
  try{
    map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:[-1.3744,52.5412],zoom:13.6,attributionControl:false,maxZoom:18});
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
    map.addControl(new maplibregl.AttributionControl({compact:true,customAttribution:'Archive locations: Town:Time'}),'bottom-right');
    mapTimer=setTimeout(()=>{if(!mapLoaded)mapFailed()},15000);
    map.on('load',()=>{clearTimeout(mapTimer);mapLoaded=true;updateMarkers(visible())});
    let seriousErrors=0;
    map.on('error',event=>{const message=String(event?.error?.message||'');if(/style|source|sprite|glyph|network|fetch/i.test(message)&&++seriousErrors>5&&!mapLoaded)mapFailed()});
  }catch(error){console.warn('Map unavailable',error);mapFailed();}
}

function openComparison(){
  const record=byId(selected),other=byId(record?.compare);if(!record||!other)return;
  const earlier=record.year<=other.year?record:other,later=earlier===record?other:record;
  $('compareTitle').textContent=earlier.location;
  $('compareNote').textContent='Two independently dated archive photographs. Drag to compare; viewpoints may not align.';
  $('compareEarlier').src=fileUrl(earlier.file,1800);$('compareEarlier').alt=`${earlier.title}, ${earlier.dateLabel}`;
  $('compareLater').src=fileUrl(later.file,1800);$('compareLater').alt=`${later.title}, ${later.dateLabel}`;
  $('earlierDate').textContent=earlier.year;$('laterDate').textContent=later.year;
  $('compareCredit').innerHTML=`Earlier: ${esc(earlier.artist)} · ${esc(earlier.licence)} · <a href="${filePage(earlier.file)}" target="_blank" rel="noopener">source</a> &nbsp; Later: ${esc(later.artist)} · ${esc(later.licence)} · <a href="${filePage(later.file)}" target="_blank" rel="noopener">source</a>`;
  $('compareRange').value=50;updateCompare(50);$('compareDialog').showModal();
}
function updateCompare(value){$('compareEarlierWrap').style.clipPath=`inset(0 ${100-value}% 0 0)`;$('compareLine').style.left=`${value}%`;}

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>item.classList.toggle('active',item===button));render()}));
$('yearRange').addEventListener('input',event=>{year=Number(event.target.value);render()});
$('latestButton').addEventListener('click',()=>{year=2025;$('yearRange').value=year;render()});
$('compareButton').addEventListener('click',openComparison);
$('compareRange').addEventListener('input',event=>updateCompare(Number(event.target.value)));
$('aboutButton').addEventListener('click',()=>$('aboutDialog').showModal());
$('retryMap').addEventListener('click',initMap);
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()}));
document.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]'))return;if(event.key==='ArrowLeft')$('previousButton').click();if(event.key==='ArrowRight')$('nextButton').click()});
render();initMap();
})();
