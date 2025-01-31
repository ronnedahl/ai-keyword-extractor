
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { db } from './firebaseConfig.js';
import cors from 'cors';
import { addGoogleDocsEndpoint } from './googleDocsIntegration.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Lägg till Google Docs endpoint
addGoogleDocsEndpoint(app);

app.post('/keywords', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Extract the main keywords from the following text: ${text}`
                }
            ],
            max_tokens: 50,
        });
        const keywords = response.choices[0].message.content.trim();
       
        const docRef = await db.collection('keywords').add({
            text: text,
            keywords: keywords,
            createdAt: new Date()
        });
        res.json({ keywords, id: docRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Ta bort fetch-anropet härifrån - det hör inte hemma i server-koden
// Använd istället Postman eller ett separat script för att testa API:et

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});