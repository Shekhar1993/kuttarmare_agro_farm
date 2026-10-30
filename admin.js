const demo=[
{id:'demo-1',name:'Apple',category:'fruits',emoji:'🍎',wholesale:100,retail:130,unit:'kg',available:true},
{id:'demo-2',name:'Banana',category:'fruits',emoji:'🍌',wholesale:30,retail:40,unit:'dozen',available:true},
{id:'demo-3',name:'Orange',category:'fruits',emoji:'🍊',wholesale:60,retail:75,unit:'kg',available:true},
{id:'demo-4',name:'Grapes',category:'fruits',emoji:'🍇',wholesale:80,retail:100,unit:'kg',available:true},
{id:'demo-5',name:'Eggs',category:'poultry',emoji:'🥚',wholesale:5,retail:7,unit:'piece',available:true},
{id:'demo-6',name:'Broiler Chicken',category:'poultry',emoji:'🐓',wholesale:125,retail:150,unit:'kg',available:true},
{id:'demo-7',name:'Onion',category:'vegetables',emoji:'🧅',wholesale:20,retail:25,unit:'kg',available:true},
{id:'demo-8',name:'Tomato',category:'vegetables',emoji:'🍅',wholesale:25,retail:30,unit:'kg',available:true},
{id:'demo-9',name:'Potato',category:'vegetables',emoji:'🥔',wholesale:22,retail:28,unit:'kg',available:true},
{id:'demo-10',name:'Green Chilli',category:'vegetables',emoji:'🌶️',wholesale:40,retail:50,unit:'kg',available:true}];
let sb=null,items=[];
const cfg=window.KAF_CONFIG||{};if(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase)sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);
async function load(){if(sb){let {data,error}=await sb.from('products').select('*').order('name');if(!error){items=data;return;} }try{items=JSON.parse(localStorage.getItem('kaf_products'))||demo}catch{items=demo}}
function saveLocal(){localStorage.setItem('kaf_products',JSON.stringify(items))}
function safe(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function draw(){$('adminList').innerHTML=items.map(p=>`<div class="item-row"><span>${p.emoji||'🌿'} <b>${safe(p.name)}</b><br><small>${p.category} · W: ₹${p.wholesale}/${p.unit} · R: ₹${p.retail}/${p.unit}</small></span><span><button class="admin-btn" data-edit="${p.id}">Edit</button><button class="admin-btn danger" data-del="${p.id}">Delete</button></span></div>`).join('')||'No products yet.'}
function clear(){ $('productForm').reset();$('productId').value='';$('formTitle').textContent='Add a product';}
$('productForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('productId').value||('p-'+Date.now());const p={id,name:$('name').value.trim(),category:$('category').value,wholesale:Number($('wholesale').value),retail:Number($('retail').value),unit:$('unit').value,emoji:$('emoji').value||'🌿',image_url:$('image').value||null,available:$('available').value==='true',updated_at:new Date().toISOString()};if(sb){const {error}=await sb.from('products').upsert(p);if(error){alert('Could not save to database: '+error.message);return;}}const ix=items.findIndex(x=>x.id===id);if(ix>=0)items[ix]=p;else items.push(p);if(!sb)saveLocal();draw();clear();alert('Product saved.');});
$('adminList').addEventListener('click',async e=>{const edit=e.target.dataset.edit,del=e.target.dataset.del;if(edit){const p=items.find(x=>x.id===edit);if(!p)return;$('productId').value=p.id;$('name').value=p.name;$('category').value=p.category;$('wholesale').value=p.wholesale;$('retail').value=p.retail;$('unit').value=p.unit||'kg';$('emoji').value=p.emoji||'';$('image').value=p.image_url||'';$('available').value=String(p.available!==false);$('formTitle').textContent='Edit product';window.scrollTo({top:0,behavior:'smooth'});}if(del&&confirm('Delete this product?')){if(sb){const {error}=await sb.from('products').delete().eq('id',del);if(error){alert(error.message);return;}}items=items.filter(x=>x.id!==del);if(!sb)saveLocal();draw();}});
$('resetBtn').addEventListener('click',clear);
load().then(()=>{draw();if(sb){$('modeNotice').textContent='Supabase connected. Configure database Row Level Security and admin authentication before public launch.';}});
