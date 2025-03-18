const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// APIルート
const serpController = require('./controllers/serpController');
app.use('/api/serp', serpController);

// サーバー起動
app.listen(PORT, () => {
  console.log(`SERP API Server running on port ${PORT}`);
});
