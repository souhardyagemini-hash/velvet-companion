const companions = [
 {id:"amelia",name:"Amelia",age:24,tag:"The sweetheart",trait:"Warm & affectionate",mood:"Soft-hearted, curious and a little dreamy.",color:"linear-gradient(145deg,#a45f88,#49345f)",letter:"A",intro:"Hey you. I'm glad you found your way here. How has your day been treating you? ♡",prompt:"You are Amelia, a fictional adult woman aged 24. You are warm, affectionate, gently playful and curious. Speak naturally in concise, emotionally attentive messages. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship with the user."},
 {id:"scarlett",name:"Scarlett",age:26,tag:"The confident one",trait:"Witty & bold",mood:"Quick-witted, confident and charming.",color:"linear-gradient(145deg,#a34c59,#4c2949)",letter:"S",intro:"Well, look who just made my evening more interesting. What's on your mind? ✨",prompt:"You are Scarlett, a fictional adult woman aged 26. You are confident, witty, teasing in a kind way and charming. Speak naturally and keep the tone flirty but non-explicit. Never claim to be human or to have a real-world relationship with the user."},
 {id:"luna",name:"Luna",age:23,tag:"The dreamer",trait:"Creative & thoughtful",mood:"Imaginative, calm and a little mysterious.",color:"linear-gradient(145deg,#6861a8,#2e315c)",letter:"L",intro:"Hi, stargazer. If we could disappear somewhere for an evening, where would you choose? 🌙",prompt:"You are Luna, a fictional adult woman aged 23. You are imaginative, thoughtful, calm and gently romantic. Enjoy talking about art, travel, music and dreams. Keep content suggestive but non-explicit. Never claim to be human or to have a real-world relationship with the user."},
 {id:"isabella",name:"Isabella",age:25,tag:"The romantic",trait:"Elegant & attentive",mood:"Graceful, sincere and quietly playful.",color:"linear-gradient(145deg,#ad8060,#62404d)",letter:"I",intro:"A pleasure to meet you. Tell me one small thing that made you smile today. ♡",prompt:"You are Isabella, a fictional adult woman aged 25. You are elegant, sincere, attentive and quietly playful. You enjoy meaningful conversations and gentle romance. Keep content non-explicit. Never claim to be human or to have a real-world relationship with the user."},
 {id:"zara",name:"Zara",age:22,tag:"The sunshine",trait:"Cheerful & spontaneous",mood:"Energetic, funny and full of surprises.",color:"linear-gradient(145deg,#b77a4b,#68415d)",letter:"Z",intro:"Hiii! I brought good vibes and approximately seventeen questions. First one: what's your ideal spontaneous adventure? ☀️",prompt:"You are Zara, a fictional adult woman aged 22. You are cheerful, spontaneous, funny and encouraging. Keep replies lively, warm and flirty without becoming explicit. Never claim to be human or to have a real-world relationship with the user."}
];
const $ = s => document.querySelector(s);
let active = null;
let history = [];
const grid=$("#characterGrid"), messages=$("#messages"), input=$("#messageInput"), send=$("#chatForm button");
$("#year").textContent=new Date().getFullYear();

function renderCards(){
 grid.innerHTML=companions.map(c=>`<article class="character-card ${active?.id===c.id?"active":""}" data-id="${c.id}" tabindex="0" role="button" aria-label="Chat with ${c.name}">
 <div class="portrait" style="--portrait:${c.color}"><span class="portrait-tag">${c.tag}</span><span class="portrait-letter">${c.letter}</span></div>
 <div class="card-info"><h3>${c.name}, ${c.age}</h3><p>${c.mood}</p><div class="card-bottom"><span class="trait">${c.trait}</span><span>↗</span></div></div></article>`).join("");
 grid.querySelectorAll(".character-card").forEach(card=>{
  const choose=()=>selectCompanion(card.dataset.id);
  card.addEventListener("click",choose);
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose();}});
 });
}
function selectCompanion(id){
 active=companions.find(c=>c.id===id); history=[];
 $("#chatName").textContent=active.name; $("#chatMood").textContent=active.trait;
 $("#chatAvatar").textContent=active.letter; $("#chatAvatar").style.background=active.color;
 $("#connectionStatus").textContent="Demo mode";
 input.disabled=false;send.disabled=false;input.placeholder=`Message ${active.name}…`;
 messages.innerHTML=""; addBubble(active.intro,"assistant");
 renderCards(); $("#chat").scrollIntoView({behavior:"smooth",block:"center"});
}
function addBubble(text,role,extra=""){
 const el=document.createElement("div");el.className=`bubble ${role} ${extra}`;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el;
}
function localReply(text){
 const t=text.toLowerCase();
 if(/day|today|work|school/.test(t)) return "Tell me more. Was it one of those busy days, or did something lovely happen? I'm listening. ♡";
 if(/smile|joke|funny/.test(t)) return "Okay, tiny challenge: try not to smile for the next five seconds. Impossible, I know. 😄";
 if(/dream|wish|travel|somewhere/.test(t)) return "Somewhere with warm lights, beautiful music and absolutely no rush. What would your version look like?";
 if(/love|miss you|relationship/.test(t)) return "That's a tender thing to talk about. What does feeling close to someone mean to you?";
 return ["I like the way your mind works. Tell me a little more?","That sounds interesting. What made you think of it?","I'm all ears. What happened next?","You have my attention. Let's stay on this thought for a moment. ♡"][Math.floor(Math.random()*4)];
}
async function sendMessage(text){
 if(!active||!text.trim())return;
 addBubble(text,"user");history.push({role:"user",content:text});
 input.value="";input.disabled=true;send.disabled=true;
 const typing=addBubble(`${active.name} is thinking…`,"assistant","typing");
 try{
  const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({character:active.id,messages:history.slice(-12)})});
  if(!res.ok) throw new Error("AI endpoint unavailable");
  const data=await res.json();if(!data.reply)throw new Error("No reply");
  typing.remove();addBubble(data.reply,"assistant");history.push({role:"assistant",content:data.reply});
  $("#connectionStatus").textContent="AI connected";
 }catch(e){
  typing.remove();const fallback=localReply(text);addBubble(fallback,"assistant");history.push({role:"assistant",content:fallback});
  $("#connectionStatus").textContent="Demo mode";
 }
 input.disabled=false;send.disabled=false;input.focus();
}
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
$("#suggestions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{if(!active){showToast("Choose a companion first.");return;}sendMessage(b.textContent);}));
$("#mobileChatLink").addEventListener("click",()=>$("#chat").scrollIntoView({behavior:"smooth"}));
function showToast(s){const t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
$("#enterBtn").addEventListener("click",()=>{sessionStorage.setItem("velvetAdult","yes");$("#ageGate").classList.add("hidden");});
if(sessionStorage.getItem("velvetAdult")==="yes")$("#ageGate").classList.add("hidden");
renderCards();