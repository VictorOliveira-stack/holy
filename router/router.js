const express = require("express")
const app = express()
const path = require("path")
const router = express.Router()
const db = require("../db.js")


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



module.exports = router