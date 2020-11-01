import countrySearch from './country-api-service';
import refs from './refs';
import oneCountryInfo from '../templates/oneCountryTemp.hbs';
import countriesList from '../templates/countriesTemp.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';


const { error } = require('@pnotify/core');
const debounce = require('lodash.debounce');

refs.searchForm.addEventListener('input', debounce(countrySearchInputHandler, 500));

function countrySearchInputHandler(e) {
    e.preventDefault();
    clearCountriesContainer();
    const searchQuery = e.target.value;
    
    countrySearch.fetchCountry(searchQuery).then(data => {
        if (data.length > 10) {
            error({
                text: "Too many matches found. Please enter a more specific query!"
            });
        } else if (data.status === 404) {
            error({
                text: "No country has been found. Please enter a more specific query!"
            });
        } else if (data.length === 1) {
            buildListMarkup(data, oneCountryInfo);
        } else if (data.length <= 10) {
            buildListMarkup(data, countriesList);
        }
    })
        .catch(Error => {
            Error({ text: "You must enter query parameters!" });
            console.log(Error)
        })
}

function buildListMarkup(countries, template) {
    const markup = countries.map(country => template(country)).join();
    refs.countriesContainer.insertAdjacentHTML('afterbegin', markup)
}

function clearCountriesContainer() {
    refs.countriesContainer.innerHTML = '';
}


