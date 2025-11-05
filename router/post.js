const express = require("express")
const router = express.Router()
const db = require("../db")

router.use(express.json())
router.use(express.urlencoded({extended: true}))


//crud posts
router.post("/postpost", async (req, res)=>{
    //id = "ola"
    const titulo = req.body.titulo
    const texto = req.body.texto 
    const autor = req.body.autor

    const sql =  `INSERT INTO posts (titulo, texto , autor) VALUES ($1, $2, $3);`
    const values = [titulo, texto, autor]

    try {
        const executeSql = await db.query(sql, values)

        res.status(201).send({
            message: "Post inserido com sucesso!",
            id_inserido: executeSql.insertId
        });
    } catch (error) {
        console.error('Erro ao inserir o post:', error.stack);
        
        res.status(500).send({
            message: "Erro no servidor ao inserir o post.",
            error: error.message
        });
    }


})



module.exports = router
