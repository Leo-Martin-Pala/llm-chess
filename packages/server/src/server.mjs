import dotenv from 'dotenv';
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Chess } from 'chess.js';

dotenv.config()

const app = express();
const port = 3000; // Or any port you prefer
const numerOfRetries = 5;
// let modelName = "deepseek r1 distill llama 70b (scaleway)";
const baseUrl = "https://api.leomartin.me/v1";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: baseUrl
});

app.use(cors()); // Enable CORS for frontend access
app.use(bodyParser.json()); // Parse JSON request bodies

app.post('/api/ai-move', async (req, res) => {
    const {fen, model} = req.body; // Expecting FEN string

    let move = null;
    let aiMove;

    for (let i = 0; i < numerOfRetries; i++) { // retries in case of invalid move
        console.log("------------------");
        console.log("model:", model);
        console.log('AI move attempt:', i + 1);
        try {
            let game = new Chess(fen);
            let validMoves = game.moves();

            if (i > 0) {
                aiMove = await getAiMove(fen, model, `You have attempted this ${i} times. Please provide a valid move. Your last invalid move was: ${aiMove}. Valid moves are: ${validMoves.join(', ')}`);
            } else {
                aiMove = await getAiMove(fen, model, `Valid moves are: ${validMoves.join(', ')}`);
            }
            if (!aiMove) {
                console.log('Failed to get AI move');
                continue;
            }
            move = game.move(aiMove);
            if (move !== null) {
                console.log('Ai move is valid');
                break;
            }
        } catch (error) {
            console.error('Error in move attempt:', error);
        }
    }

    if (move === null) {
        return res.status(500).json({error: 'Failed to get a valid AI move'});
    }
    res.json({aiMove: aiMove});
});

const MoveSchema = z.object({
    thinking: z.string(),
    move: z.string(),
});

async function getAiMove(fen, modelName, text = "") {
    console.log("Received FEN:", fen);
    try {
        const completion = await openai.beta.chat.completions.parse({
            model: modelName,
            messages: [
                { role: "system", content: "You are a chess AI. Play the best possible move in the current chess position. Reason through the best possible moves and respond with your choice in SAN notation." },
                { role: "user", content: `Current chess position in FEN notation: ${fen}. ${text}. Please respond with valid json where your thoughts are in the "thinking" tag and your next move in SAN notation is in the "move" tag. DON'T ADD ANYTHING ELSE EXEPT THE CORRECT JSON!` }
            ],
            response_format: zodResponseFormat(MoveSchema, "move_schema"),
        });

        console.log(`Current chess position in FEN notation: ${fen}. ${text}. Please briefly respond with your thoughts and next move in SAN.`)
        const result = completion.choices[0].message.parsed;
        console.log("LLM Move:", result.move);
        console.log("----------");
        console.log("Thinking:", result.thinking);
        console.log("----------");
        return result.move; // Return the move in SAN format

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return null;
    }
}

async function getStructuredMove() {

    console.log(completion.choices[0].message.parsed);
}


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});