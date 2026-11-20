import app from './app.js';
import { config } from './config.js';

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`[BlindSpot Agri API Server] Listening on http://localhost:${PORT}`);
  console.log(`[Mode] ${config.demoMode ? 'DEMO MODE' : 'LIVE / VERIFIED DATA'}`);
});
