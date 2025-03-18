/**
 * ヘルパー関数コレクション
 */

// URLからドメインを抽出
function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}

// テキストからキーワードを抽出
function extractKeywords(text) {
  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !isStopWord(word));
}

// 一般的なストップワードかどうかを確認
function isStopWord(word) {
  const stopWords = ['and', 'the', 'for', 'with', 'this', 'that', 'from', 'have', 'has', 'had', 'not', 'are', 'were', 'was', 'will', 'would', 'could', 'should', 'can', 'what', 'when', 'where', 'who', 'how', 'why', 'which', 'there', 'here', 'their', 'they', 'them', 'your', 'yours', 'our', 'ours'];
  return stopWords.includes(word.toLowerCase());
}

// 配列の平均値を計算
function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// オブジェクトを値で並べ替え、上位N個を取得
function sortObjectByValues(obj, limit = 10) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
}

// テキストから2〜3語のフレーズを抽出
function extractPhrases(text) {
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2 && !isStopWord(w));
  
  const phrases = [];
  
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
    
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  
  return phrases;
}

module.exports = {
  extractDomain,
  extractKeywords,
  isStopWord,
  calculateAverage,
  sortObjectByValues,
  extractPhrases
};