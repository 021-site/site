let ALL=[],CAT='همه',CART=JSON.parse(localStorage.getItem('cart')||'[]');
const fa=n=>Number(n||0).toLocaleString('fa-IR')+' تومان';
async function init(){ try{ const r=await fetch('data.json'); const d=await r.json();
document.querySelectorAll('.site-name').forEach(e=>e.textContent=d.site.name);
if(document.getElementById('heroTitle')){ heroTitle.textContent=d.hero.title; heroSubtitle.textContent=d.hero.subtitle; heroBadge.textContent=d.hero.badge; heroCta.textContent=d.hero.ctaText; }
if(document.getElementById('footAbout')) footAbout.textContent=d.site.aboutShort;
if(document.getElementById('footPhone')) footPhone.textContent=d.site.phone+' | '+d.site.address;
if(document.getElementById('footAddr')) footAddr.textContent='اینستاگرام: '+d.site.instagram;
if(document.getElementById('aboutTitle')){ aboutTitle.textContent=d.about.title; aboutText.textContent=d.about.text; aboutFeatures.innerHTML=d.about.features.map(f=>'<div>✨ '+f+'</div>').join(''); }
if(document.getElementById('cPhone')){ cPhone.textContent=d.site.phone; cAddr.textContent=d.site.address; cInsta.textContent=d.site.instagram; }
if(document.getElementById('productsGrid')){ ALL=d.products; renderCats(); renderProducts(); }
}catch(e){ console.log(e); } updateCart(); bindUI(); }
function renderCats(){ const cats=['همه',...new Set(ALL.map(p=>p.cat||'عمومی'))]; document.getElementById('cats').innerHTML=cats.map(c=>`<button class="${c===CAT?'active':''}" onclick="setCat('${c}')">${c}</button>`).join(''); }
function setCat(c){ CAT=c; renderCats(); renderProducts(); }
function renderProducts(){ const q=(document.getElementById('searchInput')?.value||'').trim(); let list=ALL.filter(p=>(CAT==='همه'||p.cat===CAT)&&(p.name.includes(q)||q===''));
document.getElementById('productCount').textContent=list.length+' محصول';
document.getElementById('productsGrid').innerHTML=list.map(p=>`<div class="card">${p.badge?`<span class="badge">${p.badge}</span>`:''}<img loading="lazy" src="${p.img}"><div class="card-body"><span class="cat">${p.cat||''}</span><h3>${p.name}</h3><div class="price-row"><span class="price">${fa(p.price)}</span>${p.oldPrice?`<span class="old">${fa(p.oldPrice)}</span>`:''}</div><button class="add-btn" onclick="addCart(${p.id})">افزودن به سبد +</button></div></div>`).join('')||'<p>محصولی پیدا نشد!</p>'; }
function addCart(id){ const p=ALL.find(x=>x.id==id); const f=CART.find(x=>x.id==id); if(f)f.qty++; else CART.push({id:p.id,name:p.name,price:p.price,img:p.img,qty:1}); localStorage.setItem('cart',JSON.stringify(CART)); updateCart(); toast('به سبد اضافه شد ✅'); document.getElementById('cartDrawer')?.classList.add('open'); }
function updateCart(){ const c=document.getElementById('cartCount'); if(c)c.textContent=CART.reduce((s,i)=>s+i.qty,0).toLocaleString('fa-IR');
const box=document.getElementById('cartItems'); if(!box)return; box.innerHTML=CART.map((i,x)=>`<div class="cart-item"><img src="${i.img}"><div style="flex:1"><b style="font-size:13px">${i.name}</b><div style="font-size:12px;color:#64748b">${fa(i.price)} × ${i.qty}</div></div><button onclick="rmCart(${x})" style="border:none;background:none;cursor:pointer">✕</button></div>`).join('')||'<p style="text-align:center;color:#94a3b8">سبد خالی است</p>';
document.getElementById('cartTotal').textContent=fa(CART.reduce((s,i)=>s+i.price*i.qty,0)); }
function rmCart(x){ CART.splice(x,1); localStorage.setItem('cart',JSON.stringify(CART)); updateCart(); }
function toast(t){ const el=document.getElementById('toast'); if(!el)return; el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }
function bindUI(){ document.getElementById('cartBtn')?.addEventListener('click',()=>document.getElementById('cartDrawer').classList.add('open')); document.getElementById('closeCart')?.addEventListener('click',()=>document.getElementById('cartDrawer').classList.remove('open')); document.getElementById('searchInput')?.addEventListener('input',renderProducts); document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('mobileMenu').classList.toggle('show'));
const f=document.getElementById('contactForm'); if(f)f.onsubmit=e=>{ e.preventDefault(); const arr=JSON.parse(localStorage.getItem('msgs')||'[]'); arr.push(Object.fromEntries(new FormData(f))); localStorage.setItem('msgs',JSON.stringify(arr)); document.getElementById('formOk').textContent='✅ پیام شما ثبت شد! به‌زودی تماس می‌گیریم.'; f.reset(); toast('پیام ارسال شد ✅'); }; }
document.addEventListener('DOMContentLoaded',init);