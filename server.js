require('dotenv').config();
const express=require('express');
const path=require('path');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const Database=require('better-sqlite3');

const app=express();
const PORT=process.env.PORT||3000;
const db=new Database(process.env.DB_FILE||'e-investment.db');

db.exec(`CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
)`);

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

function mailer(){
  if(!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT||587),
    secure:String(process.env.SMTP_SECURE||'false')==='true',
    auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
  });
}

app.post('/api/register',async(req,res)=>{
  try{
    const {name,email,phone,password}=req.body||{};
    if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required.'});
    if(password.length<8) return res.status(400).json({message:'Password must be at least 8 characters.'});
    const normalized=email.trim().toLowerCase();
    const exists=db.prepare('SELECT id FROM users WHERE email=?').get(normalized);
    if(exists) return res.status(409).json({message:'An account with this email already exists.'});
    const hash=await bcrypt.hash(password,12);
    const createdAt=new Date().toISOString();
    db.prepare('INSERT INTO users(name,email,phone,password_hash,created_at) VALUES(?,?,?,?,?)')
      .run(name.trim(),normalized,phone?.trim()||'',hash,createdAt);

    const transport=mailer();
    if(transport){
      await transport.sendMail({
        from:process.env.MAIL_FROM||process.env.SMTP_USER,
        to:process.env.NOTIFY_EMAIL||'Pappymozzy@gmail.com',
        subject:`New E Investment registration: ${name.trim()}`,
        text:`A new E Investment account was registered.\n\nName: ${name.trim()}\nEmail: ${normalized}\nPhone: ${phone?.trim()||'Not provided'}\nRegistered: ${createdAt}\n`
      });
    }else{
      console.warn('SMTP is not configured. Registration was saved, but no notification email was sent.');
    }
    res.json({ok:true,message:'Registration successful. Welcome to E Investment.'});
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Registration could not be completed.'});
  }
});

app.post('/api/login',async(req,res)=>{
  try{
    const {email,password}=req.body||{};
    const user=db.prepare('SELECT * FROM users WHERE email=?').get((email||'').trim().toLowerCase());
    if(!user || !(await bcrypt.compare(password||'',user.password_hash)))
      return res.status(401).json({message:'Invalid email or password.'});
    res.json({ok:true,message:`Welcome back, ${user.name}.`});
  }catch(err){res.status(500).json({message:'Login could not be completed.'});}
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`E Investment running on http://localhost:${PORT}`));
