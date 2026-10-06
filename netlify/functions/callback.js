const crypto=require("crypto");
const GUILD=process.env.DISCORD_GUILD_ID||"1547346058051584172";
const secret=()=>process.env.SESSION_SECRET;
const sign=(payload)=>{const body=Buffer.from(JSON.stringify(payload)).toString("base64url");const sig=crypto.createHmac("sha256",secret()).update(body).digest("base64url");return body+"."+sig};
exports.handler=async(event)=>{
 try{
  const q=event.queryStringParameters||{};if(!q.code)return{statusCode:400,body:"Missing OAuth code."};
  const token=await fetch("https://discord.com/api/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:process.env.DISCORD_CLIENT_ID,client_secret:process.env.DISCORD_CLIENT_SECRET,grant_type:"authorization_code",code:q.code,redirect_uri:process.env.DISCORD_REDIRECT_URI})}).then(r=>r.json());
  if(!token.access_token)throw new Error("Discord OAuth exchange failed");
  const user=await fetch("https://discord.com/api/users/@me",{headers:{Authorization:`Bearer ${token.access_token}`}}).then(r=>r.json());
  const member=await fetch(`https://discord.com/api/users/@me/guilds/${GUILD}/member`,{headers:{Authorization:`Bearer ${token.access_token}`}}).then(r=>r.ok?r.json():null);
  if(!member)return{statusCode:302,headers:{Location:"/?error=not_member"}};
  const session=sign({u:{id:user.id,username:user.username,global_name:user.global_name,avatar:user.avatar},roles:member.roles||[],exp:Date.now()+86400000});
  return{statusCode:302,headers:{Location:"/", "Set-Cookie":`session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`},body:""};
 }catch(e){return{statusCode:500,body:"Discord sign-in failed."}}
};