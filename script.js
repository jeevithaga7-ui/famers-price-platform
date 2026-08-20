/* =========================================
   FARMCONNECT JAVASCRIPT
========================================= */


/* =========================================
   MARKET DATABASE
========================================= */

const marketData = {

    Tomato: [
        {
            name: "Kadur Market",
            price: 22,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 24,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 27,
            distance: 200,
            transport: 5000
        }
    ],

    Onion: [
        {
            name: "Kadur Market",
            price: 28,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 31,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 35,
            distance: 200,
            transport: 5000
        }
    ],

    Potato: [
        {
            name: "Kadur Market",
            price: 19,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 21,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 25,
            distance: 200,
            transport: 5000
        }
    ],

    Rice: [
        {
            name: "Kadur Market",
            price: 42,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 45,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 49,
            distance: 200,
            transport: 5000
        }
    ],

    Maize: [
        {
            name: "Kadur Market",
            price: 23,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 25,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 28,
            distance: 200,
            transport: 5000
        }
    ],

    Carrot: [
        {
            name: "Kadur Market",
            price: 30,
            distance: 8,
            transport: 500
        },
        {
            name: "Chikkamagaluru Market",
            price: 34,
            distance: 35,
            transport: 1200
        },
        {
            name: "Bengaluru Market",
            price: 39,
            distance: 200,
            transport: 5000
        }
    ]

};


/* =========================================
   PRICE TREND DATA
========================================= */

const trendData = {

    Tomato: [18, 19, 20, 21, 20, 22, 22],

    Onion: [24, 25, 26, 27, 26, 29, 28],

    Potato: [20, 21, 20, 19, 18, 20, 19],

    Rice: [38, 39, 40, 41, 42, 43, 42],

    Maize: [20, 21, 22, 22, 24, 23, 23],

    Carrot: [25, 27, 28, 29, 31, 30, 30]

};


/* =========================================
   PRICE CHANGE
========================================= */

const trendPercentage = {

    Tomato: "+8.2%",

    Onion: "+4.5%",

    Potato: "-2.1%",

    Rice: "+3.8%",

    Maize: "+6.4%",

    Carrot: "+5.7%"

};


/* =========================================
   SEARCH PRICES
========================================= */

function searchPrices() {

    const crop = document.getElementById("cropSelect").value;

    const location =
        document.getElementById("locationInput").value || "Your Location";

    const quantity =
        Number(document.getElementById("quantityInput").value) || 100;

    const markets = marketData[crop];

    document.getElementById("resultTitle").textContent =
        `${crop} prices near ${location}`;


    /*
        Find best market based on NET income
    */

    let bestMarket = null;
    let bestNetIncome = -Infinity;


    markets.forEach(market => {

        const gross = market.price * quantity;

        const net = gross - market.transport;

        if (net > bestNetIncome) {

            bestNetIncome = net;

            bestMarket = market;

        }

    });


    const marketGrid =
        document.getElementById("marketGrid");

    marketGrid.innerHTML = "";


    markets.forEach(market => {

        const gross =
            market.price * quantity;

        const net =
            gross - market.transport;

        const isBest =
            market.name === bestMarket.name;


        const card =
            document.createElement("div");

        card.className =
            "market-card" +
            (isBest ? " best" : "");


        card.innerHTML = `

            <h3>
                ${isBest ? "⭐ " : "📍 "}
                ${market.name}
            </h3>

            <div class="market-price">
                ₹${market.price}
                <span>/kg</span>
            </div>

            <div class="market-info">

                <span>
                    📍 ${market.distance} km
                </span>

                <span>
                    🚚 ₹${market.transport}
                </span>

            </div>

            <div class="market-profit">

                Estimated net:
                ₹${net.toLocaleString("en-IN")}

            </div>

        `;


        marketGrid.appendChild(card);

    });


    /*
        Recommendation
    */

    document.getElementById("recommendationText").textContent =

        `${bestMarket.name} offers the best estimated return for ` +
        `${quantity} kg of ${crop}. ` +
        `The market price is ₹${bestMarket.price}/kg and ` +
        `estimated net income after transport is ₹${bestNetIncome.toLocaleString("en-IN")}.`;


    document.getElementById("bestBadge").textContent =
        `⭐ ${bestMarket.name}`;


    /*
        Update chart
    */

    updateChart(crop);


    /*
        Update calculator
    */

    document.getElementById("calcCrop").value = crop;

    updateCalculator();

}


/* =========================================
   CHART
========================================= */

let priceChart = null;


function updateChart(crop) {

    const prices = trendData[crop];

    const canvas =
        document.getElementById("priceChart");

    if (priceChart) {

        priceChart.destroy();

    }


    priceChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Today"
                ],

                datasets: [

                    {
                        label: `${crop} Price`,

                        data: prices,

                        borderWidth: 3,

                        tension: 0.35,

                        fill: true
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: false,

                        ticks: {

                            callback: function(value) {

                                return "₹" + value;

                            }

                        }

                    }

                }

            }

        });


    document.getElementById("chartCrop").textContent =
        `${crop} Price Trend`;


    document.getElementById("currentPrice").textContent =
        `₹${prices[prices.length - 1]}/kg`;


    document.getElementById("trendPercentage").textContent =
        trendPercentage[crop];

}


/* =========================================
   CALCULATOR
========================================= */

function updateCalculator() {

    const crop =
        document.getElementById("calcCrop").value;


    const quantity =
        Number(
            document.getElementById("calcQuantity").value
        ) || 0;


    const marketName =
        document.getElementById("calcMarket").value;


    const markets =
        marketData[crop];


    let market =
        markets.find(
            item => item.name === marketName
        );


    /*
        If market isn't available,
        use first market
    */

    if (!market) {

        market = markets[0];

    }


    const price =
        market.price;


    const transport =
        market.transport;


    const gross =
        price * quantity;


    const net =
        gross - transport;


    document.getElementById("calcPrice").textContent =
        `₹${price}/kg`;


    document.getElementById("calcQty").textContent =
        `${quantity} kg`;


    document.getElementById("grossIncome").textContent =
        `₹${gross.toLocaleString("en-IN")}`;


    document.getElementById("transportCost").textContent =
        `- ₹${transport.toLocaleString("en-IN")}`;


    document.getElementById("netIncome").textContent =
        `₹${net.toLocaleString("en-IN")}`;

}


/* =========================================
   PRICE REPORT STORAGE
========================================= */

function getReports() {

    const reports =
        localStorage.getItem("farmReports");

    if (!reports) {

        return [];

    }

    return JSON.parse(reports);

}


/* =========================================
   DISPLAY REPORTS
========================================= */

function displayReports() {

    const table =
        document.getElementById("reportsTable");


    table.innerHTML = "";


    const reports =
        getReports();


    /*
        Demo reports
        if user hasn't submitted anything
    */

    if (reports.length === 0) {

        reports.push(

            {
                farmer: "Ramesh",
                crop: "Tomato",
                market: "Kadur Market",
                quantity: 200,
                price: 21,
                quality: "Grade A"
            },

            {
                farmer: "Suresh",
                crop: "Onion",
                market: "Chikkamagaluru Market",
                quantity: 350,
                price: 30,
                quality: "Grade A"
            },

            {
                farmer: "Lakshmi",
                crop: "Potato",
                market: "Kadur Market",
                quantity: 150,
                price: 18,
                quality: "Grade B"
            }

        );

    }


    reports.forEach(report => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>👨‍🌾 ${report.farmer}</td>

            <td>${report.crop}</td>

            <td>${report.market}</td>

            <td>${report.quantity} kg</td>

            <td class="price-cell">
                ₹${report.price}/kg
            </td>

            <td>${report.quality}</td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   SUBMIT PRICE REPORT
========================================= */

document
    .getElementById("reportForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const farmer =
            document.getElementById("farmerName").value;


        const crop =
            document.getElementById("reportCrop").value;


        const market =
            document.getElementById("reportMarket").value;


        const quantity =
            Number(
                document.getElementById("reportQuantity").value
            );


        const price =
            Number(
                document.getElementById("reportPrice").value
            );


        const quality =
            document.getElementById("reportQuality").value;


        const report = {

            farmer,
            crop,
            market,
            quantity,
            price,
            quality

        };


        const reports =
            getReports();


        reports.unshift(report);


        localStorage.setItem(
            "farmReports",
            JSON.stringify(reports)
        );


        displayReports();


        alert(
            "✅ Price report submitted successfully!"
        );


        this.reset();

    });


/* =========================================
   INITIALIZE WEBSITE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        searchPrices();

        displayReports();

        updateCalculator();

    }
);