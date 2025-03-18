const axios = require('axios');
const cheerio = require('cheerio');
const helpers = require('../utils/helpers');

class SerpService {
  // Brave検索APIを使用したSERP取得
  async fetchBraveSERP(query, country = 'US', count = 10) {
    try {
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': process.env.BRAVE_API_KEY
        },
        params: {
          q: query,
          country: country,
          count: count
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Brave SERP:', error.message);
      throw new Error('Failed to fetch search results from Brave');
    }
  }
  
  // SERP結果の解析
  analyzeSERP(serpData) {
    if (!serpData || !serpData.web || !serpData.web.results) {
      throw new Error('Invalid SERP data structure');
    }
    
    const results = serpData.web.results;
    
    // 結果の分析
    const analysis = {
      totalResults: results.length,
      domains: {},
      titleLengths: [],
      descriptionLengths: [],
      topKeywords: {},
    };
    
    // 各結果を処理
    results.forEach(result => {
      // ドメイン分析
      const domain = helpers.extractDomain(result.url);
      analysis.domains[domain] = (analysis.domains[domain] || 0) + 1;
      
      // タイトルと説明の長さ
      analysis.titleLengths.push(result.title.length);
      if (result.description) {
        analysis.descriptionLengths.push(result.description.length);
      }
      
      // キーワード抽出（簡易版）
      const words = helpers.extractKeywords(result.title + ' ' + (result.description || ''));
      
      words.forEach(word => {
        analysis.topKeywords[word] = (analysis.topKeywords[word] || 0) + 1;
      });
    });
    
    // 平均値の計算
    analysis.avgTitleLength = helpers.calculateAverage(analysis.titleLengths);
    analysis.avgDescriptionLength = helpers.calculateAverage(analysis.descriptionLengths);
    
    // トップキーワードの並べ替え
    analysis.topKeywords = helpers.sortObjectByValues(analysis.topKeywords, 20);
    
    return analysis;
  }
  
  // 競合分析
  async analyzeCompetitors(keyword, domain) {
    const serpData = await this.fetchBraveSERP(keyword);
    const competitors = {};
    
    if (serpData && serpData.web && serpData.web.results) {
      serpData.web.results.forEach((result, index) => {
        const resultDomain = helpers.extractDomain(result.url);
        
        // 対象ドメイン以外を競合として処理
        if (resultDomain !== domain) {
          if (!competitors[resultDomain]) {
            competitors[resultDomain] = {
              positions: [],
              titles: [],
              descriptions: []
            };
          }
          
          competitors[resultDomain].positions.push(index + 1);
          competitors[resultDomain].titles.push(result.title);
          if (result.description) {
            competitors[resultDomain].descriptions.push(result.description);
          }
        }
      });
    }
    
    return competitors;
  }
  
  // キーワードリサーチ
  async researchKeywords(seed) {
    // Brave Search API経由でキーワード候補を取得
    const response = await this.fetchBraveSERP(seed);
    const keywords = new Set();
    
    // 関連検索クエリの抽出
    if (response.related_searches) {
      response.related_searches.forEach(item => {
        keywords.add(item.query);
      });
    }
    
    // タイトルと説明からキーワード候補を抽出
    if (response.web && response.web.results) {
      response.web.results.forEach(result => {
        const text = `${result.title} ${result.description || ''}`;
        
        // キーワードフレーズを抽出
        helpers.extractPhrases(text).forEach(phrase => {
          keywords.add(phrase);
        });
      });
    }
    
    return Array.from(keywords);
  }
}

module.exports = new SerpService();