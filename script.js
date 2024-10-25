document.addEventListener("DOMContentLoaded", () => {
    setupDarkModeToggle();
    loadStockData();
    loadCryptoData();
    setupCurrencyExchange();
    loadFinancialNews();
});

// Toggle Dark Mode
function setupDarkModeToggle() {
    const toggleButton = document.getElementById("theme-toggle");
    toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}

// Load Stock Market Data (Alpha Vantage API)
async function loadStockData() {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const symbol = 'AAPL';  // Example: Apple Inc.
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const stockPrices = [];
    const timestamps = [];
    for (let time in data["Time Series (5min)"]) {
        timestamps.push(time);
        stockPrices.push(data["Time Series (5min)"][time]["1. open"]);
    }

    new Chart(document.getElementById('stockChart'), {
        type: 'line',
        data: {
            labels: timestamps.reverse(),
            datasets: [{
                label: `Stock Price of ${symbol}`,
                data: stockPrices.reverse(),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        }
    });
}

// Load Cryptocurrency Data (CoinGecko API)
async function loadCryptoData() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

    const response = await fetch(url);
    const data = await response.json();

    const cryptoLabels = ['Bitcoin', 'Ethereum'];
    const cryptoPrices = [data.bitcoin.usd, data.ethereum.usd];

    new Chart(document.getElementById('cryptoChart'), {
        type: 'doughnut',
        data: {
            labels: cryptoLabels,
            datasets: [{
                label: 'Cryptocurrency Prices (USD)',
                data: cryptoPrices,
                backgroundColor: ['#FF9900', '#3C3C3D'],
            }]
        }
    });
}

// Currency Exchange Rates (ExchangeRate-API)
async function setupCurrencyExchange() {
    const url = 'https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD';
    const response = await fetch(url);
    const data = await response.json();

    const currencySelect1 = document.getElementById("currency1");
    const currencySelect2 = document.getElementById("currency2");

    for (let currency in data.conversion_rates) {
        const option1 = document.createElement("option");
        option1.value = currency;
        option1.text = currency;
        currencySelect1.add(option1);

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.text = currency;
        currencySelect2.add(option2);
    }

    currencySelect1.addEventListener("change", () => displayExchangeRate(data));
    currencySelect2.addEventListener("change", () => displayExchangeRate(data));
}

function displayExchangeRate(data) {
    const currency1 = document.getElementById("currency1").value;
    const currency2 = document.getElementById("currency2").value;
    const rate = data.conversion_rates[currency2] / data.conversion_rates[currency1];
    document.getElementById("exchange-rate").innerText = `1 ${currency1} = ${rate.toFixed(4)} ${currency2}`;
}

// Load Financial News (NewsAPI)
async function loadFinancialNews() {
    const apiKey = 'YOUR_NEWS_API_KEY';
    const url = `https://newsapi.org/v2/everything?q=finance&language=en&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = '';
    data.articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("news-article");
        articleDiv.innerHTML = `<h3>${article.title}</h3><p>${article.description}</p>`;
        newsContainer.appendChild(articleDiv);
    });
}
