const express = require("express")
const path = require("path")
const fs = require('fs').promises;
const router = express.Router()
const db = require("../db.js");
const { Result } = require("pg");



router.use(express.json())
router.use(express.urlencoded({extended: true}))


//login
router.get("/login",(req, res)=>{
    res.sendFile(path.join(__dirname,"..", "views/login.html"))
})
//posts
router.get("/posts",(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "views/posts.html"))
   
})


// ROTA NOVA: Cria a tabela "posts" no banco de dados Neon
router.get("/create-table", async (req, res) => {
    // 1. Definição do comando SQL para criar a tabela
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            texto TEXT,
            autor VARCHAR(100)
        );
    `;

    try {
        // 2. Executa a consulta usando o módulo db
        await db.query(createTableQuery);

        // 3. Responde ao usuário com sucesso
        res.status(200).json({ 
            message: "✅ Tabela 'posts' criada (ou já existia) com sucesso no Neon!" 
        });

    } catch (err) {
        // 4. Em caso de erro
        console.error("❌ ERRO ao criar a tabela 'posts':", err.message);
        res.status(500).json({ 
            error: "Falha ao criar a tabela. Verifique a conexão e permissões do DB.",
            details: err.message
        });
    }
});


//renderizar os posts


    //essa rota funcionado, use ela pra renderizar dentro da parte do crud quando for renderizar em outra
    //pag html nao na index
        /*router.get("/renderizar", async (req, res) => {
            try {
                const sqlQuery = 'SELECT titulo, texto FROM posts';
                const result = await db.query(sqlQuery);
        
                const results = result.rows || result; // compatível com pg ou mysql
                console.log("✅ Resultados do banco:", results);
        
                let tableRows = "";
                results.forEach(row => {
                    tableRows += `
                        <tr>
                            <td>${row.titulo}</td>
                            <td>${row.texto}</td>
                        </tr>
                    `;
                });
        
                const htmlFilePath = path.join(__dirname, "..", "views", "index.html");
                console.log("📄 Lendo arquivo:", htmlFilePath);
        
                const htmlTemplate = await fs.readFile(htmlFilePath, 'utf8');

             
        
                // usar regex pra garantir substituição mesmo com espaços
                const renderizarHtml = htmlTemplate.replace(/\*\*##sql_data_rows##\*\*/ /*g, tableRows);*/
        
                //res.setHeader('Content-Type', 'text/html');
                //res.send(renderizarHtml);
        
           // }catch (error) {
           //    console.error('❌ Erro ao renderizar:', error);
           //     res.status(500).send('Erro interno do servidor.');
         //   }
       // });*/


 




module.exports = router