const $=s=>document.querySelector(s);
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3200)};
async function api(path,opts){const r=await fetch(path,{credentials:"include",...opts});if(!r.ok)throw new Error(await r.text());return r.json()}
function login(){window.location.href="/api/auth"}
async function load(){
  try{
    const data=await api("/api/server-data");
    $("#memberCount").textContent=data.guild?.approximate_member_count?.toLocaleString()||"—";
    $("#onlineCount").textContent=data.guild?.approximate_presence_count?.toLocaleString()||"—";
    $("#announcementsGrid").innerHTML=(data.announcements||[]).map(x=>`<article class="announcement"><div class="date">${x.channel||"SERVER"} · ${new Date(x.timestamp).toLocaleDateString()}</div><h3>${esc(x.title||"Server update")}</h3><p>${esc(x.content||"New activity in the Basement.")}</p></article>`).join("")||empty("No announcements yet.");
    if(data.rules?.length){$("#rulesGrid").innerHTML=data.rules.map((x,i)=>`<div class="rule"><span>${String(i+1).padStart(2,"0")}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.content)}</p></div></div>`).join("")}
  }catch(e){$("#announcementsGrid").innerHTML=empty("Announcements will appear here once the Discord bot is connected.")}
  try{const me=await api("/api/me");if(me.authenticated)renderUser(me)}catch{}
}
function renderUser(me){
  $("#authArea").innerHTML=`<button class="btn btn-discord" id="logoutBtn">Logout · ${esc(me.user.global_name||me.user.username)}</button>`;
  $("#logoutBtn").onclick=async()=>{await fetch("/api/logout",{method:"POST"});location.reload()};
  $("#heroLogin").textContent="Open member area ↓";$("#heroLogin").onclick=()=>$("#account").scrollIntoView({behavior:"smooth"});
  $("#accountPanel").innerHTML=`<div class="locked-icon">✓</div><div><strong>${esc(me.user.global_name||me.user.username)}</strong><span>${(me.roles||[]).map(esc).join(" · ")||"Member"}</span></div><button class="btn btn-primary small" id="accountLogout">Logout</button>`;
  $("#accountLogout").onclick=async()=>{await fetch("/api/logout",{method:"POST"});location.reload()};
  $("#roleCount").textContent=me.roles?.length||0;
}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]||c))}
function empty(t){return `<div class="announcement"><p>${esc(t)}</p></div>`}
$("#loginBtn").onclick=login;$("#heroLogin").onclick=login;$("#accountLogin").onclick=login;
$("#claimBtn").onclick=async()=>{try{const r=await api("/api/claim",{method:"POST"});toast(r.message||"Claim recorded.")}catch{toast("Sign in with Discord to claim a VIP giveaway.")}};
load();
