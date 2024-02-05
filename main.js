document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('resultContainer');

    searchInput.addEventListener('input', debounce(handleSearch, 300));

    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            resultContainer.innerHTML = '';
            return;
        }

        fetch('https://covid-api.com/api/reports')
            .then(response => response.json())
            .then(data => displayResults(data.data, searchTerm))  // Use data.data to access the array of reports
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayResults(data, searchTerm) {
        resultContainer.innerHTML = '';

        const filteredData = data.filter(report => report.region.name.toLowerCase().includes(searchTerm));

        if (filteredData.length === 0) {
            resultContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        filteredData.forEach(report => {
            const card = document.createElement('div');
            card.classList.add('card');

            const date = document.createElement('p');
            date.textContent = `Date: ${report.date}`;

            const confirmed = document.createElement('p');
            confirmed.textContent = `Confirmed: ${report.confirmed}`;

            const deaths = document.createElement('p');
            deaths.textContent = `Deaths: ${report.deaths}`;

            const recovered = document.createElement('p');
            recovered.textContent = `Recovered: ${report.recovered}`;

            card.appendChild(date);
            card.appendChild(confirmed);
            card.appendChild(deaths);
            card.appendChild(recovered);

            resultContainer.appendChild(card);
        });
    }

    // Simple debounce function to reduce the frequency of AJAX requests
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});
