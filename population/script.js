const populationData = {
    Global: { years: [2000, 2005, 2010, 2015, 2020, 2024], population: [6.1, 6.5, 6.9, 7.3, 7.8, 8.0] },
    India: { years: [2000, 2005, 2010, 2015, 2020, 2024], population: [1.05, 1.14, 1.22, 1.31, 1.38, 1.43] },
    "Sri Lanka": { years: [2000, 2005, 2010, 2015, 2020, 2024], population: [0.18, 0.19, 0.2, 0.21, 0.22, 0.23] },
    USA: { years: [2000, 2005, 2010, 2015, 2020, 2024], population: [0.28, 0.29, 0.31, 0.32, 0.33, 0.34] },
};
const ctx = document.getElementById('populationChart').getContext('2d');
let populationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: populationData.Global.years,
        datasets: [{
            label: 'Global Population (in billions)',
            data: populationData.Global.population,
            borderColor: 'blue',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { title: { display: true, text: 'Year' } },
            y: { title: { display: true, text: 'Population (in billions)' } }
        }
    }
});

// Update Chart on Country Selection
document.getElementById('country-select').addEventListener('change', (event) => {
    const selectedCountry = event.target.value;
    const data = populationData[selectedCountry];
    populationChart.data.labels = data.years;
    populationChart.data.datasets[0].data = data.population;
    populationChart.data.datasets[0].label = `${selectedCountry} Population (in billions)`;
    populationChart.update();
});
