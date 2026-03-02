const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

const API_URL = 'https://restcountries.com/v3.1/name/';
const ALPHA_URL = 'https://restcountries.com/v3.1/alpha/';

loadingSpinner.classList.add('hidden');
errorMessage.classList.add('hidden');

searchBtn.addEventListener('click', () => {
const country = countryInput.value.trim();
if (country) {
searchCountry(country);
}
});

countryInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
const country = countryInput.value.trim();
if (country) {
searchCountry(country);
}
}
});

async function searchCountry(countryName) {
loadingSpinner.classList.remove('hidden');

countryInfo.innerHTML = '';
borderingCountries.innerHTML = '';
errorMessage.classList.add('hidden');

try {
const response = await fetch(`${API_URL}${encodeURIComponent(countryName)}`);

if (!response.ok) {
throw new Error('Country not found');
}

const data = await response.json();
const country = data[0];

countryInfo.innerHTML = `
<h2>${country.name.common}</h2>
<img src="${country.flags.svg}" alt="${country.name.common} flag" class="country-flag">
<div class="country-details">
<p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
<p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
<p><strong>Region:</strong> ${country.region}</p>
</div>
`;

if (country.borders && country.borders.length > 0) {
const borderPromises = country.borders.map(code =>
fetch(`${ALPHA_URL}${code}`).then(res => res.json())
);

const borderCountries = await Promise.all(borderPromises);

borderCountries.forEach(borderData => {
const border = borderData[0];
const borderDiv = document.createElement('div');
borderDiv.className = 'border-country-card';
borderDiv.innerHTML = `
<img src="${border.flags.svg}" alt="${border.name.common} flag" class="border-flag">
<p>${border.name.common}</p>
`;
borderingCountries.appendChild(borderDiv);
});
} else {
borderingCountries.innerHTML = '<p>No bordering countries</p>';
}

} catch (error) {
errorMessage.textContent = `Error: ${error.message}. Please try another country.`;
errorMessage.classList.remove('hidden');
} finally {
loadingSpinner.classList.add('hidden');
}
}