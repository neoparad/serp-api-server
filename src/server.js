const { McpServer } = require('mcp');
const { fetchBraveSERP, analyzeSERP, researchKeywords, analyzeCompetitors } = require('./services/serpService');

// MCPサーバーを初期化
const server = new McpServer();

// ツール定義
server.defineTools({
  analyze_serp: {
    description: "Analyze a SERP (Search Engine Results Page) for a given query",
    parameters: {
      query: {
        type: "string",
        description: "Search query to analyze"
      },
      country: {
        type: "string",
        description: "Country code (e.g., US, JP)",
        default: "US"
      },
      count: {
        type: "number",
        description: "Number of results to analyze",
        default: 10
      }
    },
    handler: async (params) => {
      try {
        const serpData = await fetchBraveSERP(params.query, params.country, params.count);
        const analysis = analyzeSERP(serpData);
        return { analysis };
      } catch (error) {
        console.error('Error in analyze_serp:', error);
        throw new Error(`Failed to analyze SERP: ${error.message}`);
      }
    }
  },
  
  research_keywords: {
    description: "Research keywords related to a given topic or seed keyword",
    parameters: {
      seed: {
        type: "string",
        description: "Seed keyword to research"
      }
    },
    handler: async (params) => {
      try {
        const keywords = await researchKeywords(params.seed);
        return { keywords };
      } catch (error) {
        console.error('Error in research_keywords:', error);
        throw new Error(`Failed to research keywords: ${error.message}`);
      }
    }
  },
  
  analyze_competitors: {
    description: "Analyze competitors for a given keyword or domain",
    parameters: {
      keyword: {
        type: "string",
        description: "Keyword to analyze competitors for"
      },
      domain: {
        type: "string",
        description: "Your domain to exclude from competitors"
      }
    },
    handler: async (params) => {
      try {
        const competitors = await analyzeCompetitors(params.keyword, params.domain);
        return { competitors };
      } catch (error) {
        console.error('Error in analyze_competitors:', error);
        throw new Error(`Failed to analyze competitors: ${error.message}`);
      }
    }
  }
});

// サーバー起動
server.start().catch(err => {
  console.error('Error starting MCP server:', err);
  process.exit(1);
});

console.log('SERP API MCP Server initialized and waiting for requests...');
