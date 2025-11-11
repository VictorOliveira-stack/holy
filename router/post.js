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
//insert
router.post("/postpost", async (req, res)=>{
    //id = "ola"
    const titulo = req.body.titulo
    const texto = req.body.texto 
    const autor = req.body.autor

    const sql =  `INSERT INTO posts (titulo, texto , autor) VALUES ($1, $2, $3);`
    const values = [titulo, texto, autor]

    try {
        const executeSql = await db.query(sql, values)

        /*res.status(201).send({
            message: "Post inserido com sucesso!",
            id_inserido: executeSql.insertId
        });*/
    } catch (error) {
        console.error('Erro ao inserir o post:', error.stack);
        
        res.status(500).send({
            message: "Erro no servidor ao inserir o post.",
            error: error.message
        });
    }

    res.redirect("/")

})

//posts para editar/deletar e renderizar fora da home
    //renderiza fora da home
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
                    <td>
                        <form action="/editando/${row.id}" method="GET">
                            <input type="submit" value="Editar">
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
        //res.status(500).send("Erro interno do servidor.");
    }
    
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
              //res.redirect("/")
              //res.redirect(path.join(__dirname, "views", "index.html"))

        })

      
    } catch (error) {
         console.error("❌ Erro ao renderizar:", error);
         res.status(500).send("Erro ao deletar post.");
    }

    res.redirect("/pageditar")
    //res.redirect("/")
    //res.redirect(path.join(__dirname, "views", "index.html"))
})

//get editando
//get o arquivo  editanto.html
/*router.get("/editando/:id", async(req, res)=>{
    

    try {
        const id = req.params.id;
        const sql = 'SELECT id, titulo, texto, autor FROM posts WHERE id = $1';
        const values = [id];

        const result = await db.query(sql, values);
        if(result.rows.length === 0){
            return res.status(404).send('Post não encontrado.');
        }
        //res.sendFile(path.join(__dirname, "..", "views", "editando.html"))
        //res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("❌ Erro ao buscar o post para edição:", error);
        res.status(500).send("Erro ao buscar post.");
    }

    res.sendFile(path.join(__dirname, "..", "views", "editando.html"))
})*/

router.get("/editando/:id", async(req, res)=>{
    try {
        const fs = require('fs')

        const id = req.params.id
        const sql = 'SELECT id, titulo, texto, autor FROM posts WHERE id = $1';
        const values = [id]

        const result = await db.query(sql, values)
        if (result.rows.length === 0) {
            return res.status(404).send('Post não encontrado.');
        }

        const post = result.rows[0]

        const filePath = path.join(__dirname, "..", "views", "editando.html");

        let htmlContent = fs.readFileSync(filePath, 'utf8');

        htmlContent = htmlContent.replace('[ID_POST]', post.id)
        htmlContent = htmlContent.replace('/update/:id', `/update/${post.id}`)
        htmlContent = htmlContent.replace('[titulo]', post.titulo || "")
        htmlContent = htmlContent.replace('[TEXTO_ATUAL]', post.texto || "")
        htmlContent = htmlContent.replace('[autor]', post.autor || '')


        res.status(200).send(htmlContent);

    } catch (error) {
        console.error("❌ Erro ao buscar/renderizar post:", error);
        res.status(500).send("Erro ao buscar post para edição.");
    }


})


//update
/*router.post("/update/:id",(req, res)=>{

})*/

router.post("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { titulo, texto, autor } = req.body; 
    
    // Você pode usar o ID do req.params.id ou o id oculto do req.body.id
    // Usaremos o ID do parâmetro por segurança.

    const sql = `UPDATE posts SET titulo = $1, texto = $2, autor = $3 WHERE id = $4;`;
    const values = [titulo, texto, autor, id];

    try {
        const result = await db.query(sql, values);

        if (result.rowCount === 0) {
             console.log(`⚠️ Post com ID ${id} não encontrado para atualização.`);
             return res.status(404).send('Post não encontrado para atualização.');
        }

        console.log(`✅ Post com ID ${id} atualizado com sucesso.`);
        res.redirect("/"); // Redireciona para a página principal após o sucesso

    } catch (error) {
        console.error('❌ Erro ao atualizar o post:', error.stack);
        res.status(500).send({
            message: "Erro no servidor ao atualizar o post.",
            error: error.message
        });
    }
});


//crud posts

module.exports = router
