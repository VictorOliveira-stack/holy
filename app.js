require("dotenv").config();

const express = require("express")
const app = express()
const port = 3000
const path = require("path")
const db = require("./db.js");
const fs = require('fs').promises;


app.use(express.json())
app.use(express.urlencoded({extended: true}))


//middlewheres

const router = require("./router/router.js")//router entre paginas
    app.use("/", router)

const posts = require("./router/post.js")
    app.use("/", posts)



    app.get("/", async (req, res)=>{

        try {
            const sqlQuery = 'SELECT titulo, texto, autor FROM posts';
            const result = await db.query(sqlQuery);
    
            const results = result.rows || result; // compatível com pg ou mysql
            console.log("✅ Resultados do banco:", results);
    
            let tableRows = "";
            results.forEach(row => {
                tableRows += `
                    <tr>
                        <th>${row.titulo}</th> 
                        <td>${row.texto}</td> 
                        <td>${row.autor}</td> 
                    </tr>
                `;
            });
    
            const htmlFilePath = path.join(__dirname, "views", "index.html");//esse ta sendo usado agora para rendeizar o index e rota "/" e renderizar o que vem do db
            console.log("📄 Lendo arquivo:", htmlFilePath);
    
            const htmlTemplate = await fs.readFile(htmlFilePath, 'utf8');
    
         
    
            // usar regex pra garantir substituição mesmo com espaços
            const renderizarHtml = htmlTemplate.replace(/\*\*##sql_data_rows##\*\*/g, tableRows);
    
            res.setHeader('Content-Type', 'text/html');
            res.send(renderizarHtml);
    
            res.sendFile(path.join(__dirname, "..", "views/index.html"))
    
        }catch (error) {
           console.error('❌ Erro ao renderizar:', error);
            res.status(500).send('Erro interno do servidor.');
        }
    
            
    })

    



app.listen(port||80, ()=>{
    console.log(`olá rodando ${port}`)
})
