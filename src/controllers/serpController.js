const express = require('express');
const router = express.Router();
const serpService = require('../services/serpService');

// SERP分析エンドポイント
router.get('/analyze', async (req, res) => {
  try {
    const { query, country, count } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const serpData = await serpService.fetchBraveSERP(query, country, count);
    const analysis = serpService.analyzeSERP(serpData);
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// キーワードリサーチエンドポイント
router.get('/keywords', async (req, res) => {
  try {
    const { seed } = req.query;
    
    if (!seed) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }
    
    const keywords = await serpService.researchKeywords(seed);
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 競合分析エンドポイント
router.get('/competitors', async (req, res) => {
  try {
    const { keyword, domain } = req.query;
    
    if (!keyword || !domain) {
      return res.status(400).json({ 
        error: 'Both keyword and domain parameters are required' 
      });
    }
    
    const competitors = await serpService.analyzeCompetitors(keyword, domain);
    res.json({ competitors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;