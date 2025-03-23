import express from "express";
import mongoose from "mongoose";
import Usuarios from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import eAdmin from "../helpers/eAdmin.js";

const Usuario = mongoose.model("usuarios");
const router = express.Router();

connectDB()

router.get("/registro", (req, res) => {
  res.render("usuarios/registro");
});

router.post("/registro", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome invalido" });
  }

  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail invalido" });
  }

  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha invalido" });
  }

  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito Curta" });
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As Senhas são diferentes, tente novamente" });
  }

  if (erros.length > 0) {
    res.render("usuarios/registro", { erros: erros });
  } else {
    Usuario.findOne({ email: req.body.email })
      .lean()
      .then((usuario) => {
        if (usuario) {
          req.flash("error_msg", "ja existe uma conta com esse email");
          res.redirect("/usuarios/registro");
        } else {
          const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
          });

          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash(
                  "error_msg",
                  "Houve um erro durante o salvamento do usuario"
                );
                res.redirect("/");
              }
              novoUsuario.senha = hash;
              novoUsuario
                .save()
                .then(() => {
                  req.flash("success_msg", "usuario criado com sucesso");
                  res.redirect("/");
                })
                .catch((err) => {
                  req.flash(
                    "error_msg",
                    "Houve um erro ao registrar o usuario"
                  );
                  res.redirect("/usuarios/registro");
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("usuarios/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successMessage: "Logado com sucesso",
    successRedirect: "/",
    failureMessage: "Email ou senha incorretos",
    failureRedirect: "/usuarios/login",
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err) }
      req.flash('success_msg', 'Deslogado com sucesso')
      res.redirect('/')
    })
})

export default router;
