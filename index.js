import './style.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * ============================
 * DOM Element references and variables
 * ============================
 */
var fetchedQuotes = [];
var retryCounter = 0;
var text = document.getElementById('text');
var author = document.getElementById('author');
var newQuote = document.getElementById('new-quote');
var tweetQuote = document.getElementById('twitter');
var loader = document.getElementById('loader');
var quoteContainer = document.getElementById('quote-container');
var error = document.getElementById('error');

/**
 * ============================
 * Event listeners
 * ============================
 */
document.addEventListener('DOMContentLoaded', fetchQuotes);

newQuote.addEventListener('click', getRandomQuote);

tweetQuote.addEventListener('click', function redirectToTweeterSite() {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text.innerText
    )} - ${encodeURIComponent(author.innerText)}`,
    '_blank'
  );
});

/**
 * ============================
 * API calls
 * ============================
 */

async function fetchQuotes() {
  try {
    hideError();
    hideContainer();
    showLoadingSpinner();
    fetchedQuotes = await (await fetch('https://type.fit/api/quotes')).json();
    removeLoadingSpinner();
    showContainer();
    getRandomQuote();
  } catch (error) {
    if (retryCounter < 10) {
      retryCounter++;
      fetchQuotes();
      return;
    }
    console.log('Error fetching the quotes from API after 10 retries');
    console.log(error);
    removeLoadingSpinner();
    showError();
    resetRetryCounter();
  }
}

/**
 * ============================
 * Helper functions
 * ============================
 */

function showLoadingSpinner() {
  loader.hidden = false;
}

function removeLoadingSpinner() {
  loader.hidden = true;
}

function showContainer() {
  quoteContainer.hidden = false;
}

function hideContainer() {
  quoteContainer.hidden = true;
}

function showError() {
  error.hidden = false;
}

function hideError() {
  error.hidden = true;
}

function getRandomQuote() {
  const randomQuote = fetchedQuotes[Math.floor(Math.random() * 10)];

  text.innerText = randomQuote.text;
  author.innerText = randomQuote.author || 'Unknown';

  if (randomQuote.text.length > 50) {
    text.classList.add('long-quote');
  } else {
    text.classList.remove('long-quote');
  }
}

function resetRetryCounter() {
  retryCounter = 0;
}
