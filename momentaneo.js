    //essa rota funcionado, use ela pra renderizar dentro da parte do crud quando for renderizar em outra
    //pag html nao na index
    router.get("/postar", async (req, res) => {
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
                        <td>${row.texto}</td>
                    </tr>
                `;
            });
    
            const htmlFilePath = path.join(__dirname, "..", "views", "posts.html");
            console.log("📄 Lendo arquivo:", htmlFilePath);
    
            const htmlTemplate = await fs.readFile(htmlFilePath, 'utf8');

         
    
             //usar regex pra garantir substituição mesmo com espaços
            const renderizarHtml = htmlTemplate.replace(/\*\*##sql_data_rows##\*\*/g, tableRows);
    
            res.setHeader('Content-Type', 'text/html');
            res.send(renderizarHtml);
    
         }catch (error) {
         console.error('❌ Erro ao renderizar:', error);
         res.status(500).send('Erro interno do servidor.');
       }
   });

   //segundaa tentativa
   router.get("/postar", async (req, res) => {
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

        const htmlFilePath = path.join(__dirname, "..", "views", "posts.html");
        const htmlTemplate = await fs.readFile(htmlFilePath, "utf8");

        const renderizarHtml = htmlTemplate.replace(/\*\*##sql_data_rows##\*\*/g, tableRows);

        res.setHeader("Content-Type", "text/html");
        res.send(renderizarHtml);

    } catch (error) {
        console.error("❌ Erro ao renderizar:", error);
        res.status(500).send("Erro interno do servidor.");
    }
});
