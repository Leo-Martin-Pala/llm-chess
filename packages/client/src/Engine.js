export class FallbackEngine {
    stockfish;
    boardApi;
    bestMove;
    engineName;

    constructor(boardApi) {
        this.boardApi = boardApi;
        const wasmSupported =
            typeof WebAssembly === 'object' &&
            WebAssembly.validate(
                Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
            );

        this.stockfish = new Worker(
            wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js'
        );

        this.setupListeners();

        this.stockfish.postMessage('uci');
    }

    setupListeners() {
        this.stockfish.addEventListener('message', (data) =>
            this.handleEngineStdout(data)
        );

        this.stockfish.addEventListener('error', (err) => console.error(err));

        this.stockfish.addEventListener('messageerror', (err) =>
            console.error(err)
        );
    }

    handleEngineStdout(data) {
        const uciStringSplitted = (data.data).split(' ');

        if (uciStringSplitted[0] === 'uciok') {
            this.setOption('UCI_AnalyseMode', 'true');
            this.setOption('Analysis Contempt', 'Off');

            this.stockfish.postMessage('ucinewgame');
            this.stockfish.postMessage('isready');
            return;
        }

        if (uciStringSplitted[0] === 'readyok') {
            this.stockfish.postMessage('go movetime 1500');
            return;
        }

        if (uciStringSplitted[0] === 'bestmove' && uciStringSplitted[1]) {
            if (uciStringSplitted[1] !== this.bestMove) {
                this.bestMove = uciStringSplitted[1];
                if (this.boardApi.getTurnColor() === 'black') {
                    this.boardApi.move({
                        from: this.bestMove.slice(0, 2),
                        to: this.bestMove.slice(2, 4),
                    });
                }
            }
        }
    }

    setOption(name, value) {
        this.stockfish.postMessage(`setoption name ${name} value ${value}`);
    }

    sendPosition(position) {
        this.stockfish.postMessage(`position startpos moves ${position}`);
        this.stockfish.postMessage('go movetime 2000');
    }
}