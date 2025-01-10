import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurations
const BASE_API_URL = "https://api.langflow.astra.datastax.com";
const LANGFLOW_ID = "7bf70436-b4ef-46e9-ac71-a79c55927694";
const FLOW_ID = "43c68ebb-271d-4306-b1f6-841940d93bbb";
const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN || "AstraCS:dpExdUJuemceNirosexcCkIv:63f9c17d444cecffdded0c8683003c615647f5d3b58210f670ccaeb37c8de783";

// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use('/responses', express.static(join(__dirname, 'responses')));

// Default tweaks
const TWEAKS = {
  "ChatInput-S82Ww": {},
  "GroqModel-SnoEd": {},
  "ParseData-8kKCE": {},
  "Prompt-SUQPw": {},
  "ChatOutput-w64rA": {},
  "AstraDB-OkTyr": {},
  "Google Generative AI Embeddings-fEuKx": {},
  "File-VSYDJ": {},
};

async function runFlow(message, endpoint = FLOW_ID, tweaks = null) {
  const apiUrl = `${BASE_API_URL}/lf/${LANGFLOW_ID}/api/v1/run/${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${APPLICATION_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const payload = {
    input_value: message,
    output_type: 'chat',
    input_type: 'chat',
  };
  if (tweaks) {
    payload.tweaks = tweaks;
  }

  try {
    const response = await axios.post(apiUrl, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error running flow:', error);
    throw error;
  }
}

function formatResponse(response) {
  try {
    return response.outputs[0].outputs[0].results.message.text;
  } catch (error) {
    return "Unable to format response.";
  }
}

// Routes
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      success: false,
      error: 'No message provided' 
    });
  }

  try {
    const response = await runFlow(message, FLOW_ID, TWEAKS);
    const formattedMessage = formatResponse(response);
    
    res.json({
      success: true,
      message: formattedMessage,
      raw: response
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});