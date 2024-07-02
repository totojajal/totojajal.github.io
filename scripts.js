// script.js

document.addEventListener('DOMContentLoaded', () => {
  const domainButtons = document.querySelectorAll('.domain-btn');
  const shortenForm = document.getElementById('shorten-form');
  const resultContainer = document.getElementById('result');
  const copyButtons = document.getElementsByClassName('copy-btn');

  // Event listener for domain selection buttons
  domainButtons.forEach(button => {
    button.addEventListener('click', () => {
      domainButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('selected-domain').value = button.getAttribute('data-domain');
    });
  });

  // Event listener for form submission
  shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalUrl = document.getElementById('original-url').value.trim();
    const customString = document.getElementById('custom-string').value.trim();
    const selectedDomain = document.getElementById('selected-domain').value;

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalUrl, customString, selectedDomain })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();

      if (result.success) {
        showResult(originalUrl, result.shortUrl);
        document.getElementById('original-url').value = ''; // Clear input fields
        document.getElementById('custom-string').value = '';
      } else {
        alert('Failed to generate short URL.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating short URL. Please try again later.');
    }
  });

  // Function to display result
  function showResult(originalUrl, shortUrl) {
    const resultHtml = `
      <h3>URLs</h3>
      <ul>
        <li>
          Original URL: <a href="${originalUrl}" target="_blank">${originalUrl}</a>
        </li>
        <li>
          Shortened URL: <span id="short-url">${shortUrl}</span>
          <button class="copy-btn" onclick="copyShortUrl()">Copy</button>
        </li>
      </ul>
    `;
    resultContainer.innerHTML = resultHtml;
  }

  // Function to copy shortened URL to clipboard
  function copyShortUrl() {
    const shortUrlElement = document.getElementById('short-url');
    const range = document.createRange();
    range.selectNode(shortUrlElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Shortened URL copied to clipboard!');
  }
});
