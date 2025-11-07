const express = require("express")
const router = express.Router()
const db = require("../db")
const path = require("path")
const fs = require('fs').promises;

router.use(express.json())
router.use(express.urlencoded({extended: true}))


//login
router.get("/login",(req, res)=>{
    res.sendFile(path.join(__dirname,"..", "views/login.html"))
})

//posts
router.get("/posts",(req, res)=>{
    res.sendFile(path.join(__dirname,"..", "views//posts.html"))
})

//posts
router.get("/pageditar", async (req,res)=>{

    console.log("🚀 GET /postar chamado!");
    try {
        const sqlQuery = 'SELECT titulo, texto, autor FROM posts';
        const resultt = await db.query(sqlQuery);
        const resultss = resultt.rows || resultt;

        let tableRows = "";
        resultss.forEach(row => {
            tableRows += `
                <tr>
                    <th>${row.titulo}</th> 
                    <td>${row.texto}</td> 
                    <td>${row.autor}</td> 
                </tr>
            `;
        });

        const htmlFilePath = path.join(__dirname, "..", "views", "editar.html");
        const htmlTemplate = await fs.readFile(htmlFilePath, "utf8");

        const renderizarHtml = htmlTemplate.replace(/\*\*##sql_data_rows##\*\*/g, tableRows);

        res.setHeader("Content-Type", "text/html");
        res.send(renderizarHtml);

    } catch (error) {
        console.error("❌ Erro ao renderizar:", error);
        res.status(500).send("Erro interno do servidor.");
    }
    //res.sendFile(path.join(__dirname, "..", "views", "editar.html"))
})



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
