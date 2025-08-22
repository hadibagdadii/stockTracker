import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Search, Plus, BarChart3, List, Moon, Sun, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';

// Sample watchlist symbols
const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'UBER'];

const StockDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState(['AAPL', 'MSFT', 'TSLA', 'NVDA', 'META', 'NFLX']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [marketData, setMarketData] = useState({
    sp500: { price: 4185.47, change: 12.38, changePercent: 0.30 },
    nasdaq: { price: 12843.81, change: -24.67, changePercent: -0.19 },
    dow: { price: 33976.61, change: 156.82, changePercent: 0.46 },
    vix: { price: 18.45, change: 0.73, changePercent: 4.12 }
  });

  // Chart data for analytics
  const [chartData, setChartData] = useState({
    priceHistory: [
      { date: 'Jul 24', AAPL: 175, MSFT: 370, TSLA: 245, NVDA: 860 },
      { date: 'Jul 25', AAPL: 172, MSFT: 368, TSLA: 250, NVDA: 855 },
      { date: 'Jul 26', AAPL: 174, MSFT: 371, TSLA: 248, NVDA: 865 },
      { date: 'Jul 27', AAPL: 176, MSFT: 369, TSLA: 252, NVDA: 870 },
      { date: 'Jul 28', AAPL: 173, MSFT: 372, TSLA: 246, NVDA: 868 },
      { date: 'Jul 29', AAPL: 175, MSFT: 374, TSLA: 249, NVDA: 875 }
    ],
    volumeData: [
      { symbol: 'AAPL', volume: 45200000 },
      { symbol: 'MSFT', volume: 32100000 },
      { symbol: 'TSLA', volume: 52600000 },
      { symbol: 'NVDA', volume: 35600000 },
      { symbol: 'META', volume: 19500000 },
      { symbol: 'GOOGL', volume: 28500000 }
    ],
    sectorAllocation: [
      { name: 'Technology', value: 65, count: 6 },
      { name: 'Consumer Discretionary', value: 20, count: 2 },
      { name: 'Communication Services', value: 15, count: 1 }
    ]
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Search for stocks using Alpha Vantage Symbol Search
  const searchStocks = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // For demo purposes, let's create a comprehensive mock search that includes many real stocks
      const mockSearchResults = {
        'JPM': [{ symbol: 'JPM', name: 'JPMorgan Chase & Co', type: 'Equity', region: 'United States', currency: 'USD' }],
        'DIS': [{ symbol: 'DIS', name: 'The Walt Disney Company', type: 'Equity', region: 'United States', currency: 'USD' }],
        'DISNEY': [{ symbol: 'DIS', name: 'The Walt Disney Company', type: 'Equity', region: 'United States', currency: 'USD' }],
        'COCA': [{ symbol: 'KO', name: 'The Coca-Cola Company', type: 'Equity', region: 'United States', currency: 'USD' }],
        'AMAZON': [{ symbol: 'AMZN', name: 'Amazon.com Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'MICROSOFT': [{ symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'GOOGLE': [{ symbol: 'GOOGL', name: 'Alphabet Inc Class A', type: 'Equity', region: 'United States', currency: 'USD' }],
        'WALMART': [{ symbol: 'WMT', name: 'Walmart Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'JOHNSON': [{ symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Equity', region: 'United States', currency: 'USD' }],
        'VISA': [{ symbol: 'V', name: 'Visa Inc Class A', type: 'Equity', region: 'United States', currency: 'USD' }],
        'MASTERCARD': [{ symbol: 'MA', name: 'Mastercard Inc Class A', type: 'Equity', region: 'United States', currency: 'USD' }],
        'BERKSHIRE': [{ symbol: 'BRK.B', name: 'Berkshire Hathaway Inc Class B', type: 'Equity', region: 'United States', currency: 'USD' }],
        'PROCTER': [{ symbol: 'PG', name: 'Procter & Gamble Co', type: 'Equity', region: 'United States', currency: 'USD' }],
        'EXXON': [{ symbol: 'XOM', name: 'Exxon Mobil Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'INTEL': [{ symbol: 'INTC', name: 'Intel Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'CISCO': [{ symbol: 'CSCO', name: 'Cisco Systems Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'PFIZER': [{ symbol: 'PFE', name: 'Pfizer Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'VERIZON': [{ symbol: 'VZ', name: 'Verizon Communications Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'NIKE': [{ symbol: 'NKE', name: 'Nike Inc Class B', type: 'Equity', region: 'United States', currency: 'USD' }],
        'MCDONALD': [{ symbol: 'MCD', name: 'McDonald\'s Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'STARBUCKS': [{ symbol: 'SBUX', name: 'Starbucks Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'SPOTIFY': [{ symbol: 'SPOT', name: 'Spotify Technology S.A.', type: 'Equity', region: 'United States', currency: 'USD' }],
        'ZOOM': [{ symbol: 'ZM', name: 'Zoom Video Communications Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'PAYPAL': [{ symbol: 'PYPL', name: 'PayPal Holdings Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'SHOPIFY': [{ symbol: 'SHOP', name: 'Shopify Inc Class A', type: 'Equity', region: 'Canada', currency: 'CAD' }],
        'SQUARE': [{ symbol: 'SQ', name: 'Block Inc Class A', type: 'Equity', region: 'United States', currency: 'USD' }],
        'TWITTER': [{ symbol: 'TWTR', name: 'Twitter Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'SALESFORCE': [{ symbol: 'CRM', name: 'Salesforce Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'ORACLE': [{ symbol: 'ORCL', name: 'Oracle Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'IBM': [{ symbol: 'IBM', name: 'International Business Machines Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'AMD': [{ symbol: 'AMD', name: 'Advanced Micro Devices Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'HOME': [{ symbol: 'HD', name: 'The Home Depot Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'LOWES': [{ symbol: 'LOW', name: 'Lowe\'s Companies Inc', type: 'Equity', region: 'United States', currency: 'USD' }],
        'TARGET': [{ symbol: 'TGT', name: 'Target Corporation', type: 'Equity', region: 'United States', currency: 'USD' }],
        'COSTCO': [{ symbol: 'COST', name: 'Costco Wholesale Corporation', type: 'Equity', region: 'United States', currency: 'USD' }]
      };

      // Find matching results
      const upperQuery = query.toUpperCase();
      let results = [];
      
      // Direct symbol match
      if (mockSearchResults[upperQuery]) {
        results = mockSearchResults[upperQuery];
      } else {
        // Search by partial matches
        Object.entries(mockSearchResults).forEach(([key, stocks]) => {
          if (key.includes(upperQuery) || stocks[0].symbol.includes(upperQuery) || stocks[0].name.toUpperCase().includes(upperQuery)) {
            results.push(...stocks);
          }
        });
      }
      
      // Remove duplicates
      results = results.filter((stock, index, self) => 
        index === self.findIndex(s => s.symbol === stock.symbol)
      );
      
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
      setShowSearchResults(true);
      
      console.log('Search results for:', query, results); // Debug log
      
      // Uncomment below for real API call (may hit rate limits)
      /*
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data.bestMatches) {
        const results = data.bestMatches.slice(0, 10).map(match => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          currency: match['8. currency']
        }));
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
      */
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Add a new stock to the dashboard
  const addStockToDashboard = async (symbol, name) => {
    setLoading(true);
    try {
      // Check if stock already exists
      if (stocks.find(stock => stock.symbol === symbol)) {
        setError(`${symbol} is already in your dashboard`);
        setLoading(false);
        return;
      }

      // For demo purposes, we'll create mock data for new stocks
      // In production, you'd fetch real data from Alpha Vantage
      const newStock = {
        symbol: symbol,
        name: name || `${symbol} Corp.`,
        price: (Math.random() * 200 + 50).toFixed(2),
        change: ((Math.random() - 0.5) * 10).toFixed(2),
        changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
        volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
        sector: 'Technology'
      };

      setStocks(prevStocks => [...prevStocks, newStock]);
      setSearchTerm('');
      setSearchResults([]);
      setShowSearchResults(false);
      setError('');
    } catch (err) {
      setError('Failed to add stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data using Alpha Vantage
  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: symbol,
          name: getCompanyName(symbol),
          price: parseFloat(quote['05. price']).toFixed(2),
          change: parseFloat(quote['09. change']).toFixed(2),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
          volume: parseInt(quote['06. volume']).toLocaleString(),
          sector: getSector(symbol)
        };
      }
      throw new Error('Invalid API response');
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
      return null;
    }
  };

  // Helper functions for demo data
  const getCompanyName = (symbol) => {
    const names = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corp.',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corp.',
      'NFLX': 'Netflix Inc.',
      'UBER': 'Uber Technologies'
    };
    return names[symbol] || `${symbol} Corp.`;
  };

  const getSector = (symbol) => {
    const sectors = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'TSLA': 'Consumer Discretionary',
      'META': 'Technology',
      'NVDA': 'Technology',
      'NFLX': 'Communication Services',
      'UBER': 'Technology'
    };
    return sectors[symbol] || 'Technology';
  };

  // Load stock data
  const loadStockData = async (symbols = DEFAULT_SYMBOLS) => {
    setLoading(true);
    setError('');
    
    try {
      // Use demo data to avoid API rate limits
      const demoData = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.31, changePercent: 1.33, volume: '45.2M', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 374.51, change: 5.23, changePercent: 1.42, volume: '32.1M', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.45, changePercent: -1.04, volume: '28.5M', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.86, change: 3.12, changePercent: 2.18, volume: '41.7M', sector: 'Consumer Discretionary' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.87, change: -7.23, changePercent: -2.82, volume: '52.6M', sector: 'Consumer Discretionary' },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 318.75, change: 4.12, changePercent: 1.31, volume: '19.5M', sector: 'Technology' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.54, changePercent: 1.45, volume: '35.6M', sector: 'Technology' },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 421.32, change: -3.87, changePercent: -0.91, volume: '8.2M', sector: 'Communication Services' },
        { symbol: 'UBER', name: 'Uber Technologies', price: 56.23, change: -1.42, changePercent: -2.46, volume: '18.7M', sector: 'Technology' }
      ];
      
      setStocks(demoData);
    } catch (err) {
      setError('Failed to load stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchStocks(searchTerm);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  // Show either filtered existing stocks OR search results
  const displayStocks = showSearchResults && searchResults.length > 0 
    ? [] // Don't show existing stocks when search results are displayed
    : stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));
  const gainers = stocks.filter(stock => parseFloat(stock.changePercent) > 0).length;
  const losers = stocks.filter(stock => parseFloat(stock.changePercent) < 0).length;

  const StockRow = ({ stock, showAddButton = true }) => (
    <tr key={stock.symbol} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className={`font-semibold text-blue-600 ${darkMode ? 'text-blue-400' : ''}`}>{stock.symbol}</span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stock.name}</span>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stock.sector}</span>
        </div>
      </td>
      <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ${stock.price}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className={`font-semibold ${parseFloat(stock.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(stock.change) >= 0 ? '+' : ''}${stock.change}
          </span>
          {parseFloat(stock.changePercent) >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          parseFloat(stock.changePercent) >= 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {parseFloat(stock.changePercent) >= 0 ? '+' : ''}{stock.changePercent}%
        </span>
      </td>
      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {stock.volume}
      </td>
      <td className="px-6 py-4">
        {showAddButton && (
          <button
            onClick={() => addToWatchlist(stock.symbol)}
            disabled={watchlist.includes(stock.symbol)}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              watchlist.includes(stock.symbol)
                ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-50 hover:bg-blue-100'} text-blue-600 hover:text-blue-700`
            }`}
          >
            <Plus className="w-4 h-4 mr-1" />
            {watchlist.includes(stock.symbol) ? 'Added' : 'Add'}
          </button>
        )}
      </td>
    </tr>
  );

  const MarketCard = ({ title, value, change, changePercent, isPositive }) => (
    <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{changePercent}%)
            </span>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 ml-1 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 ml-1 text-red-600" />
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          {isPositive ? (
            <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          ) : (
            <TrendingDown className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Market Overview */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Market Overview</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Real-time market data and analysis</p>
          </div>
          <button
            onClick={() => loadStockData()}
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              loading 
                ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MarketCard 
            title="S&P 500" 
            value={marketData.sp500.price} 
            change={marketData.sp500.change} 
            changePercent={marketData.sp500.changePercent} 
            isPositive={marketData.sp500.changePercent > 0} 
          />
          <MarketCard 
            title="NASDAQ" 
            value={marketData.nasdaq.price} 
            change={marketData.nasdaq.change} 
            changePercent={marketData.nasdaq.changePercent} 
            isPositive={marketData.nasdaq.changePercent > 0} 
          />
          <MarketCard 
            title="Dow Jones" 
            value={marketData.dow.price} 
            change={marketData.dow.change} 
            changePercent={marketData.dow.changePercent} 
            isPositive={marketData.dow.changePercent > 0} 
          />
          <MarketCard 
            title="VIX" 
            value={marketData.vix.price} 
            change={marketData.vix.change} 
            changePercent={marketData.vix.changePercent} 
            isPositive={marketData.vix.changePercent > 0} 
          />
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Stocks</p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stocks.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gainers</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{gainers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Losers</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{losers}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Performance Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stock Performance</h2>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search any stock symbol (e.g., AAPL, TSLA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-80 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            {isSearching && (
              <RefreshCw className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg z-50 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className={`px-3 py-2 text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} - Click to add to dashboard
                </div>
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.symbol}-${index}`}
                    onClick={() => addStockToDashboard(result.symbol, result.name)}
                    className={`px-4 py-3 cursor-pointer border-b transition-colors ${
                      darkMode 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${index === searchResults.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`font-semibold text-blue-600 ${darkMode ? 'text-blue-400' : ''}`}>
                          {result.symbol}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {result.name.length > 50 ? `${result.name.substring(0, 50)}...` : result.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {result.type} • {result.region} • {result.currency}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Plus className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Click to add</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchResults.length === 0 && searchTerm.length > 2 && !isSearching && (
              <div className={`absolute top-full left-0 right-0 mt-1 p-4 text-center rounded-lg border shadow-lg z-50 ${
                darkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-500'
              }`}>
                No stocks found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className={`shadow-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Symbol
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Price
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Change
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Change %
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Volume
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                {displayStocks.length === 0 && !showSearchResults ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? `No stocks found matching "${searchTerm}". Try searching in the box above to find new stocks!` : 'No stocks available'}
                    </td>
                  </tr>
                ) : (
                  displayStocks.map(stock => (
                    <StockRow key={stock.symbol} stock={stock} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderWatchlist = () => (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Watchlist</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Track your favorite stocks</p>
      </div>

      <div className={`shadow-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Symbol
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Price
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Change
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Change %
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Volume
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Remove
              </th>
            </tr>
          </thead>
          <tbody className={darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
            {watchlistStocks.map(stock => (
              <tr key={stock.symbol} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`font-semibold text-blue-600 ${darkMode ? 'text-blue-400' : ''}`}>{stock.symbol}</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stock.name}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stock.sector}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${stock.price}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${parseFloat(stock.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(stock.change) >= 0 ? '+' : ''}${stock.change}
                    </span>
                    {parseFloat(stock.changePercent) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(stock.changePercent) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(stock.changePercent) >= 0 ? '+' : ''}{stock.changePercent}%
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stock.volume}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className={`text-red-600 hover:text-red-800 text-sm font-medium transition-colors ${darkMode ? 'hover:text-red-400' : ''}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Advanced market analysis and insights</p>
      </div>

      {/* Price Performance Chart */}
      <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Price Performance (Last 6 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="date" 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Line type="monotone" dataKey="AAPL" stroke="#3B82F6" strokeWidth={2} name="Apple" />
              <Line type="monotone" dataKey="MSFT" stroke="#10B981" strokeWidth={2} name="Microsoft" />
              <Line type="monotone" dataKey="TSLA" stroke="#F59E0B" strokeWidth={2} name="Tesla" />
              <Line type="monotone" dataKey="NVDA" stroke="#EF4444" strokeWidth={2} name="NVIDIA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Analysis and Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trading Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="symbol" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                  formatter={(value) => [`${(value / 1000000).toFixed(1)}M`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Pie Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Portfolio Allocation by Sector</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.sectorAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelStyle={{ fontSize: '12px', fill: darkMode ? '#FFFFFF' : '#000000' }}
                >
                  {chartData.sectorAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {chartData.sectorAllocation.map((sector, index) => (
              <div key={sector.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {sector.name}
                  </span>
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {sector.count} stocks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Performers</h3>
          <div className="space-y-3">
            {stocks
              .sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent))
              .slice(0, 5)
              .map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</span>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-semibold">+{stock.changePercent}%</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>${stock.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Losers</h3>
          <div className="space-y-3">
            {stocks
              .sort((a, b) => parseFloat(a.changePercent) - parseFloat(b.changePercent))
              .slice(0, 5)
              .map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${'bg-red-100 text-red-800'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</span>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-semibold">{stock.changePercent}%</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>${stock.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Market Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stocks.length}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Stocks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{gainers}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gainers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{losers}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Losers</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {watchlist.length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Watchlist</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation Header */}
      <nav className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  StockTracker Pro
                </span>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'dashboard'
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('watchlist')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'watchlist'
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Watchlist
                </button>
                <button
                  onClick={() => setCurrentPage('analytics')}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'analytics'
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                H
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 py-3">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 'dashboard'
                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                  : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('watchlist')}
              className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 'watchlist'
                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                  : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              Watchlist
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 'analytics'
                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`
                  : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last Updated Info */}
        <div className="mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Page Content */}
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'watchlist' && renderWatchlist()}
        {currentPage === 'analytics' && renderAnalytics()}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2025 StockTracker Pro. Built with React & Tailwind CSS.
            </p>
            <div className="flex space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Powered by Alpha Vantage API
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StockDashboard;