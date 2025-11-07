const express = require("express")
const router = express.Router()
const db = require("../db")
const path = require("path")
const fs = require('fs').promises;

router.use(express.json())
router.use(express.urlencoded({extended: true}))


//login rota
router.get("/login",(req, res)=>{
    res.sendFile(path.join(__dirname,"..", "views/login.html"))
})

//posts rota
router.get("/posts",(req, res)=>{
    res.sendFile(path.join(__dirname,"..", "views//posts.html"))
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

//posts editar e renderizar
router.get("/pageditar", async (req,res)=>{

    console.log("🚀 GET /postar chamado!");
    try {
        const sqlQuery = 'SELECT id, titulo, texto, autor FROM posts';
        const resultt = await db.query(sqlQuery);
        const resultss = resultt.rows || resultt;

        let tableRows = "";
        resultss.forEach(row => {

            console.log("ID Sendo Usado:", row.id);
            console.log('Dados da linha:', row);

            tableRows += `
                <tr>
                    <th>${row.titulo}</th>
                    <td>${row.texto}</td> 
                    <td>${row.autor}</td> 
                    <td>
                        <form action="/deletpost/${row.id}" method="POST">
                            <input type="submit" value="Deletar">
                        </form>
                    </td>
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


//Delete
router.post("/deletpost/:id", (req, res)=>{
    

    try {
        const id = req.params.id
        const sql = 'DELETE FROM posts WHERE id = $1 '
        const sqlId = [id]

         db.query(sql, sqlId, (err, result)=>{
            if(err){
                console.log("erro ao deletar",err)
            }

            if(result.affectedRows === 0 ){
                 console.log(result)
                return res.status(400).send('Não foi possivel talvez não há esse post')
               
            }

              console.log(`✅ Post com ID ${id} excluído com sucesso.`);

              //res.redirect("/pageditar")
              res.redirect("/")

        })

      
    } catch (error) {
         console.error("❌ Erro ao renderizar:", error);
         res.status(500).send("Erro ao deletar post.");
    }

})




module.exports = router
