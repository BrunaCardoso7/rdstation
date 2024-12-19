const express = require('express');
const axios = require('axios');
const app = express();

// Configurações do RD Station
const CLIENT_ID = '2270ef90-ee25-4482-8750-64470868fe13';
const CLIENT_SECRET = 'a6fa5ce552e342ee856ecbd992d807de';
const REDIRECT_URI = 'https://rdstation.onrender.com/callback';

// Endpoint para receber o code e trocar pelo access token
app.get('/callback', async (req, res) => {
    const code = req.query.code; // Captura o código enviado pelo RD Station
    if (!code) {
        return res.status(400).send('Código de autorização não encontrado!');
    }

    try {
        // Troca o code pelo token
        const response = await axios.post('https://api.rd.services/auth/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI
        });

        // Resposta da API do RD Station
        const { access_token, refresh_token, expires_in } = response.data;

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        // Armazene os tokens em um banco de dados ou retorne ao cliente
        res.json({
            message: 'Token obtido com sucesso!',
            access_token,
            refresh_token,
            expires_in
        });
    } catch (error) {
        console.error('Erro ao obter o token:', error.response.data);
        res.status(500).json({ error: 'Erro ao obter o token de acesso.' });
    }
});

// Porta do servidor
app.listen(3000, () => {
    console.log('API de autenticação rodando na porta 3000');
});
