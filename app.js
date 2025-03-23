import express from "express";
import { engine } from "express-handlebars";
import router from "./routes/admin.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const admin = router;
const app = express();
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import Postagens from "./models/Postagem.js";
const Postagem = mongoose.model("postagens");
import Categoria from "./models/Categoria.js";
const Categorias = mongoose.model("categorias");
import usuarios from "./routes/usuario.js"
import passport from "passport";
import auth from "./config/auth.js"
import connectDB from "./connectMongo.js";
auth(passport)

//config
//sessao
app.use(session({
  secret: "curso de node",
  resave: true,
  saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
//midleware
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg= req.flash("error_msg")
  res.locals.error=req.flash("error")
  res.locals.user = req.user || null
  next()
})  
//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//Public
app.use(express.static(path.join(__dirname, "public")));

connectDB()

//rotas
app.get("/", (req, res) => {
  Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
    res.render("index", {postagens:postagens})
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro ao carregar os posts " + err)
    res.redirect("/404")
  })
});

app.get("/404" ,(req ,res)=>{
  res.send("Erro 404!")
})

app.get('/postagem/:slug', (req, res)=>{
  Postagem.findOne({ slug: req.params.slug }).lean().then((postagem)=>{
      if(postagem){
          res.render('postagem/index', {postagem:postagem})
      }else{
          req.flash('error_msg', "Essa postagem não existe")
          res.redirect('/')
      }
  }).catch((err) => {
      req.flash('error_msg','Houve um erro interno' + err)
      res.redirect('/')
  })
})

app.get("/categorias",(req,res)=>{
  Categorias.find().lean().then((categorias)=>{
    res.render("categorias/index",{categorias:categorias})
  }).catch(()=>{
    req.flash("error_mag","houve um erro interno ao listar as categorias")
    res.redirect("/")
  })
})

app.get("/categorias/:slug", (req,res)=>{
  Categorias.findOne({slug:req.params.slug}).lean().then((categoria)=>{
    if(categoria){
      Postagem.find({categoria:categoria._id}).lean().then((postagens)=>{
        res.render("categorias/postagens",{postagens:postagens, categoria:categoria})
      }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar os posts")
        res.redirect("/")
      })
    }else
    {
      req.flash("error_msg","Esta categoria não existe")
    }
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro interno ao carregar a categoria")
    res.redirect("/")
  })
})


const PORT = process.env.PORT || 8081;
const HOST = '0.0.0.0'; // Bind to all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});