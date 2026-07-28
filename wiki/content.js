document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get('pageid');

    if (pageid) {
        fetchPageContent(pageid);
    }

    function fetchPageContent(pageid) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageid}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const page = data.query.pages[pageid];
                document.getElementById('title').textContent = page.title;
                document.getElementById('content').textContent = page.extract;
            })
            .catch(error => alert('Error: ' + error));
    }
});