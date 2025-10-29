// db.js
// db.js
// IMPORTANTE: Este arquivo deve estar na RAIZ do seu projeto (ao lado do app.js)

require('dotenv').config(); // Carrega as variáveis de ambiente do .env

const { Pool } = require('pg');

// 1. Pega a URL de conexão do Neon
// Por favor, certifique-se que no seu arquivo .env a variável é NEON_DATABASE_URL
const connectionString = process.env.DATABASE_URL; 

// Se a string de conexão estiver faltando, o aplicativo não deve iniciar
if (!connectionString) {
    console.error("❌ ERRO: NEON_DATABASE_URL não foi definida no arquivo .env.");
    process.exit(1);
}

// 2. Configura a Pool de Conexão
const pool = new Pool({
    connectionString: connectionString,
    // O Neon (Postgres) exige SSL para conexões seguras
    ssl: {
        rejectUnauthorized: false
    }
});

// 3. Função de Teste de Conexão (Executada uma vez na inicialização)
async function connectTest() {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        console.log("✅ Conexão com o Neon estabelecida com sucesso!");
        client.release();
    } catch (err) {
        console.error("❌ ERRO ao conectar ou consultar o banco de dados Neon. Verifique o URL no .env:", err.message);
        // Não encerra o processo, mas apenas avisa
    }
}

connectTest();

// 4. Exporta a Pool para ser usada em suas rotas
module.exports = {
    // Função simplificada para executar consultas
    query: (text, params) => pool.query(text, params), 
    pool: pool
};
