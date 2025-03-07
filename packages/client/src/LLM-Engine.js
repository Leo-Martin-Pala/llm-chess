export class LlmEngine {
    boardApi;
    bestMove;

    constructor(boardApi) {
        this.boardApi = boardApi;
        this.bestMove = null;
    }

    async sendPosition(position, model) {
        await this.fetchAiMove(position, model);
    }

    async fetchAiMove(position, model) {

        console.log('Sending position to backend:', position);

        const response = await fetch('http://localhost:3000/api/ai-move', { // Adjust URL if your server is different
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fen: position,
                model: model
            }) // Send FEN to backend
        });


        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching AI move from backend:', response.status, response.statusText, "(", errorData.error, ")");
            throw new Error('Error fetching AI move from backend');
        }

        const data = await response.json();
        if (data && data.aiMove) {
            console.log('Received AI move from backend:', data.aiMove);
            this.handleAiMoveResponse(data.aiMove);
        } else {
            console.error('Invalid response from backend:', data);
            throw new Error('Invalid response from backend');
        }
    }

    handleAiMoveResponse(aiMove) {
        this.bestMove = aiMove;
        if (aiMove && this.boardApi.getTurnColor() === 'black') {
            this.boardApi.move(aiMove);
        }
    }
}