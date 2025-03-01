import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import Categoria from "../models/Categoria.js";
const Categorias = mongoose.model("categorias");
import Postagens from "../models/Postagem.js";
const Postagem = mongoose.model("postagens");
import  eAdmin  from "../helpers/eAdmin.js";

router.get("/", eAdmin, (req, res) => {
  res.render("admin/index");
});
router.get("/posts", eAdmin, (req, res) => {
  res.send("pagina posts adm");
});

router.get("/categorias", eAdmin, (req, res) => {
  Categorias.find()
    .sort({ date: "desc" })
    .lean()
    .then((Categorias) => {
      res.render("admin/categorias", { Categorias: Categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao citar categorias");
      res.redirect("/admin");
    });
});

router.get("/categorias/add", eAdmin, (req, res) => {
  res.render("admin/categoriasadd");
});

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
  Categorias.findOne({ _id: req.params.id })
    .lean()
    .then((Categoria) => {
      res.render("admin/editcategorias", { Categoria: Categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Esta categoria não existe");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", eAdmin, (req, res) => {
  let errosedit = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    errosedit.push({ texto: "Nome invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errosedit.push({ texto: "Slug invalido" });
  }

  if (errosedit.length > 0) {
    res.render("admin/categorias/edit", { erros: erros });
  } else {
    Categorias.findOne({ _id: req.body.id })
      .then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria
          .save()
          .then(() => {
            req.flash("success_msg", "Categoria editada com sucesso");
            res.redirect("/admin/categorias");
          })
          .catch(() => {
            req.flash(
              "error_msg",
              "houve um erro interno ao salvar a edição da categoria"
            );
            res.redirect("/admin/categorias");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "houve um erro ao editar a categoria");
        res.redirect("/admin/categorias");
      });
  }
});

router.post("/categorias/nova", eAdmin, (req, res) => {
  let erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug invalido" });
  }

  if (erros.length > 0) {
    res.render("admin/categoriasadd", { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };

    new Categorias(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao salvar a categoria, tente novamente"
        );
        console.log("erro: " + err);
      });
  }
});

router.post("/categorias/deletar", eAdmin, (req, res) => {
  Categorias.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria");
      res.redirect("/admin/categorias");
    });
});

router.get("/postagens", eAdmin, (req, res) => {
  Postagem.find()
    .lean()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/postagens", { postagens: postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao registrar as postagens");
      res.redirect("/admin");
    });
});

router.get("/postagens/add", eAdmin, (req, res) => {
  Categorias.find()
    .lean()
    .then((categorias) => {
      res.render("admin/postagensadd", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulario");
      res.redirect("/admin");
    });
});

router.post("/postagens/nova", eAdmin, (req, res) => {
  let erros = [];

  if (req.body.categoria == 0) {
    erros.push({ texto: "Categoria invalida, registre uma categoria" });
  }

  if (
    !req.body.titulo ||
    typeof req.body.titulo == undefined ||
    req.body.titulo == null
  ) {
    erros.push({ texto: "Titulo invalido" });
  }

  if (
    !req.body.categoria ||
    typeof req.body.categoria == undefined ||
    req.body.categoria == null
  ) {
    erros.push({ texto: "Categoria invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug invalido" });
  }

  if (
    !req.body.descricao ||
    typeof req.body.descricao == undefined ||
    req.body.descricao == null
  ) {
    erros.push({ texto: "Descricao invalido" });
  }

  if (
    !req.body.conteudo ||
    typeof req.body.conteudo == undefined ||
    req.body.conteudo == null
  ) {
    erros.push({ texto: "Conteudo invalido" });
  }

  if (erros.length > 0) {
    res.render("admin/postagensadd", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    };

    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso");
        res.redirect("/admin/postagens");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro durante o salvamento da postagem"
        );
        res.redirect("/admin/postagens");
      });
  }
});

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.params.id }).lean()
    .then((postagem) => {
      Categorias.find()
        .lean()
        .then((categorias) => {
          res.render("admin/editpostagens" ,{categorias:categorias, postagem:postagem});
        })
        .catch((err) => {
          req.flash(
            "error_msg",
            "houve um erro  ao listar as categorias " + err
          );
          res.redirect("/admin/postagens");
        });
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Houve um erro ao carregar o formulario de edição " + err
      );
      res.redirect("/admin/postagens");
    });
});

router.post("/postagens/edit", eAdmin, (req,res)=>{
  Postagem.findOne({_id: req.body.id}).then((postagem)=>{
    postagem.titulo=req.body.titulo
    postagem.slug=req.body.slug
    postagem.conteudo=req.body.conteudo
    postagem.descricao=req.body.descricao
    postagem.categoria=req.body.categoria

    postagem.save()
      .then(() => {
        req.flash("success_msg", "Postagem editada com sucesso");
        res.redirect("/admin/postagens");
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a postagem: " + err);
        res.redirect("/admin/postagens");
      });
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro ao salvar a edição "+ err)
    res.redirect("/admin/postagens")
  })
})

router.get("/postagens/deletar/:id", eAdmin, (req,res)=>{
  Postagem.deleteOne({_id:req.params.id}).then(()=>{
    req.flash("success_msg","Postagem deletada com sucesso")
    res.redirect("/admin/postagens")
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro interno " +err)
    res.redirect("/admin/postagens")
  })
})

export default router;
