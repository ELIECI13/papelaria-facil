const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const KEYS={products:'pf_products',sales:'pf_sales',theme:'pf_theme'};
let products=load(KEYS.products,[]),sales=load(KEYS.sales,[]),cart=[];
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200)}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}

$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.tab-panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.tab).classList.add('active')}));
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem(KEYS.theme,t);$('#themeBtn').textContent=t==='dark'?'Tema claro':'Tema escuro'}
setTheme(localStorage.getItem(KEYS.theme)||'light');$('#themeBtn').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');

function render(){renderProducts();renderSaleSelect();renderCart();renderHistory();renderStats()}
function renderStats(){
 $('#statProducts').textContent=products.length;
 $('#statStock').textContent=products.reduce((a,p)=>a+p.stock,0);
 $('#statLow').textContent=products.filter(p=>p.stock<=p.min).length;
 $('#statSales').textContent=money(sales.reduce((a,s)=>a+s.total,0));
}
function margin(p){return p.price>0?((p.price-p.cost)/p.price)*100:0}
function renderProducts(){
 const q=$('#searchProduct').value.trim().toLowerCase(),filter=$('#stockFilter').value;
 const list=products.filter(p=>p.name.toLowerCase().includes(q)).filter(p=>filter==='low'?p.stock<=p.min:filter==='out'?p.stock===0:true);
 $('#productRows').innerHTML=list.map(p=>`<tr><td><strong>${esc(p.name)}</strong>${p.stock<=p.min?`<br><span class="badge ${p.stock===0?'out':'low'}">${p.stock===0?'sem estoque':'estoque baixo'}</span>`:''}</td><td>${money(p.cost)}</td><td>${money(p.price)}</td><td>${margin(p).toFixed(1).replace('.',',')}%</td><td>${p.stock}</td><td><div class="row-actions"><button class="mini" onclick="editProduct('${p.id}')">Editar</button><button class="mini danger" onclick="deleteProduct('${p.id}')">Excluir</button></div></td></tr>`).join('');
 $('#productEmpty').hidden=list.length>0;
}
$('#searchProduct').oninput=renderProducts;$('#stockFilter').onchange=renderProducts;
const dlg=$('#productDialog');
function openProduct(p=null){$('#productForm').reset();$('#productId').value=p?.id||'';$('#dialogTitle').textContent=p?'Editar produto':'Novo produto';$('#productName').value=p?.name||'';$('#productCost').value=p?.cost??'';$('#productPrice').value=p?.price??'';$('#productStock').value=p?.stock??0;$('#productMin').value=p?.min??5;previewMargin();dlg.showModal()}
$('#newProductBtn').onclick=()=>openProduct();$('#closeDialog').onclick=$('#cancelDialog').onclick=()=>dlg.close();
function previewMargin(){const cost=Number($('#productCost').value),price=Number($('#productPrice').value);$('#marginPreview').textContent=price>0?`Margem bruta sobre a venda: ${(((price-cost)/price)*100).toFixed(1).replace('.',',')}%`:'Margem: —'}
$('#productCost').oninput=$('#productPrice').oninput=previewMargin;
$('#productForm').addEventListener('submit',e=>{e.preventDefault();const p={id:$('#productId').value||uid(),name:$('#productName').value.trim(),cost:Number($('#productCost').value),price:Number($('#productPrice').value),stock:Math.floor(Number($('#productStock').value)),min:Math.floor(Number($('#productMin').value))};if(!p.name||[p.cost,p.price,p.stock,p.min].some(v=>!Number.isFinite(v)||v<0)){toast('Confira os dados do produto.');return}const i=products.findIndex(x=>x.id===p.id);if(i>=0)products[i]=p;else products.push(p);save(KEYS.products,products);dlg.close();render();toast(i>=0?'Produto atualizado.':'Produto cadastrado.')});
window.editProduct=id=>openProduct(products.find(p=>p.id===id));
window.deleteProduct=id=>{const p=products.find(x=>x.id===id);if(!p||!confirm(`Excluir ${p.name}?`))return;products=products.filter(x=>x.id!==id);cart=cart.filter(x=>x.id!==id);save(KEYS.products,products);render();toast('Produto excluído.')};

function renderSaleSelect(){const current=$('#saleProduct').value;$('#saleProduct').innerHTML='<option value="">Selecione...</option>'+products.filter(p=>p.stock>0).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${p.id}">${esc(p.name)} — ${money(p.price)} (${p.stock} un.)</option>`).join('');$('#saleProduct').value=current}
$('#addCartBtn').onclick=()=>{const id=$('#saleProduct').value,qty=Math.floor(Number($('#saleQty').value));const p=products.find(x=>x.id===id);if(!p){toast('Selecione um produto.');return}if(!qty||qty<1){toast('Informe uma quantidade válida.');return}const existing=cart.find(x=>x.id===id),totalQty=(existing?.qty||0)+qty;if(totalQty>p.stock){toast(`Estoque disponível: ${p.stock}.`);return}if(existing)existing.qty=totalQty;else cart.push({id:p.id,name:p.name,price:p.price,qty});$('#saleQty').value=1;renderCart()};
function totals(){const subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0),discount=Math.min(100,Math.max(0,Number($('#discount').value)||0)),discountValue=subtotal*discount/100;return{subtotal,discount,discountValue,total:subtotal-discountValue}}
function renderCart(){
 $('#cart').innerHTML=cart.map(i=>`<div class="cart-item"><div><strong>${esc(i.name)}</strong><small>${i.qty} × ${money(i.price)}</small></div><strong>${money(i.qty*i.price)}</strong><button class="mini danger" onclick="removeCart('${i.id}')">Remover</button></div>`).join('');$('#cartEmpty').hidden=cart.length>0;const t=totals();$('#subtotal').textContent=money(t.subtotal);$('#discountValue').textContent=money(t.discountValue);$('#grandTotal').textContent=money(t.total)}
window.removeCart=id=>{cart=cart.filter(x=>x.id!==id);renderCart()};$('#discount').oninput=renderCart;$('#clearCartBtn').onclick=()=>{cart=[];$('#discount').value=0;renderCart()};
$('#finishSaleBtn').onclick=()=>{if(!cart.length){toast('Adicione pelo menos um produto.');return}for(const item of cart){const p=products.find(x=>x.id===item.id);if(!p||p.stock<item.qty){toast(`Estoque insuficiente para ${item.name}.`);return}}const t=totals();cart.forEach(item=>{products.find(p=>p.id===item.id).stock-=item.qty});sales.unshift({id:uid(),date:new Date().toISOString(),items:cart.map(i=>({...i})),subtotal:t.subtotal,discount:t.discount,total:t.total});save(KEYS.products,products);save(KEYS.sales,sales);cart=[];$('#discount').value=0;render();toast('Venda registrada e estoque atualizado.')};

function renderHistory(){
 $('#historyRows').innerHTML=sales.map(s=>`<tr><td>${new Date(s.date).toLocaleString('pt-BR')}</td><td>${s.items.reduce((a,i)=>a+i.qty,0)} un. — ${esc(s.items.map(i=>i.name).join(', '))}</td><td><strong>${money(s.total)}</strong>${s.discount?`<br><small>${s.discount}% desc.</small>`:''}</td><td><button class="mini danger" onclick="deleteSale('${s.id}')">Excluir</button></td></tr>`).join('');$('#historyEmpty').hidden=sales.length>0}
window.deleteSale=id=>{if(!confirm('Excluir este registro? O estoque não será alterado.'))return;sales=sales.filter(s=>s.id!==id);save(KEYS.sales,sales);render();toast('Registro excluído.')};
$('#exportBtn').onclick=()=>{if(!sales.length){toast('Não há vendas para exportar.');return}const rows=[['Data','Itens','Subtotal','Desconto (%)','Total'],...sales.map(s=>[new Date(s.date).toLocaleString('pt-BR'),s.items.map(i=>`${i.name} x${i.qty}`).join(' | '),s.subtotal.toFixed(2),s.discount,s.total.toFixed(2)])];const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`vendas-papelaria-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(a.href)};
render();