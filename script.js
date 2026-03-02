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
countryInfo.classList.add('hidden');

function showError(text) {
errorMessage.textContent = text;
errorMessage.classList.remove('hidden');
countryInfo.classList.add('hidden');
borderingCountries.innerHTML = '';
}

function hideError() {
errorMessage.classList.add('hidden');
}

function showLoading() {
loadingSpinner.classList.remove('hidden');
hideError();
}

function hideLoading() {
loadingSpinner.classList.add('hidden');
}

function clearResults() {
countryInfo.innerHTML = '';
countryInfo.classList.add('hidden');
borderingCountries.innerHTML = '';
}

function displayCountry(country) {
const name = country.name.common;
const capital = country.capital ? country.capital[0] : 'No capital';
const population = country.population ? country.population.toLocaleString() : 'Unknown';
const region = country.region;
const flag = country.flags.svg;

countryInfo.innerHTML = `
<h2>${name}</h2>
<img src="${flag}" alt="${name} flag" class="country-flag">
<div class="country-details">
<p><strong>Capital:</strong> ${capital}</p>
<p><strong>Population:</strong> ${population}</p>
<p><strong>Region:</strong> ${region}</p>
</div>
`;
countryInfo.classList.remove('hidden');
}

async function displayBorders(borders) {
if (!borders || borders.length === 0) {
borderingCountries.innerHTML = '<p>No bordering countries</p>';
return;
}

borderingCountries.innerHTML = '';

for (let code of borders) {
try {
const response = await fetch(`${ALPHA_URL}${code}`);
const data = await response.json();
const border = data[0];

const card = document.createElement('div');
card.className = 'border-country-card';
card.innerHTML = `
<img src="${border.flags.svg}" alt="${border.name.common} flag" class="border-flag">
<p>${border.name.common}</p>
`;
borderingCountries.appendChild(card);
} catch (error) {
console.log('Error loading border:', code);
}
}
}

async function searchCountry() {
const countryName = countryInput.value.trim();

if (!countryName) {
showError('Please enter a country name');
return;
}

showLoading();
clearResults();

try {
const response = await fetch(`${API_URL}${countryName}`);

if (!response.ok) {
throw new Error('Country not found');
}

const data = await response.json();
const country = data[0];

displayCountry(country);
displayBorders(country.borders);

} catch (error) {
showError(`Country "${countryName}" not found. Please check spelling.`);
} finally {
hideLoading();
}
}

function handleKeyPress(event) {
if (event.key === 'Enter') {
searchCountry();
}
}

function handleInput() {
if (errorMessage.classList.contains('hidden') === false) {
hideError();
}
}

searchBtn.addEventListener('click', searchCountry);
countryInput.addEventListener('keypress', handleKeyPress);
countryInput.addEventListener('input', handleInput);