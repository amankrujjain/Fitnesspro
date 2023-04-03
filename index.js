const express = require("express")
const hbs = require("hbs")
const path = require("path")
const bodyparser = require("body-parser")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const app = express()
// app.set("views","./views")   //app.set("views","folder path of view")
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,"./views/public")))
hbs.registerPartials(path.join(__dirname,"./views/partials"))//this line is used to set path of partials

var encoder = bodyparser.urlencoded()
const from = process.env.MAILSENDER
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:from,
        pass:process.env.PASSWORD
    }
})

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/gallery",(req,res)=>{
    res.render("gallery")
})
app.get("/contact",(req,res)=>{
    res.render("contact",{show:false})
})
app.post("/contact",encoder,(req,res)=>{
    mailOption = {
        from:from,
        to:from,
        subject:"Query Received!!! : Team Fitness Pro",
        text : `
            Name :  ${req.body.name}
            Email :  ${req.body.email}
            Phone :  ${req.body.phone}
            Subject :  ${req.body.subject}
            Message :  ${req.body.message}
        `
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error);
    })
    mailOption = {
        from:from,
        to:req.body.email,
        subject:"Thanks to Share Your Query With US !!! : Team Fitness Pro",
        text : `
                    Thank to Share Your Query
                    Our Team Member Will Contact You Soon!!!
                    Team : Fitness Pro
                    Noida
                `
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error);
    })
    res.render("contact",{show:true})
})
app.listen(process.env.PORT||8000,()=>console.log("Server is Running at Port 8000"))

