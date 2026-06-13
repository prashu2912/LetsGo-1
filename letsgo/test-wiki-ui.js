const fetch = require('node-fetch');

async function getWikiImage(location) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(location)}&origin=*`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].original) {
            console.log(`Image for ${location}:`, pages[pageId].original.source);
        } else {
            console.log(`No image found for ${location}`);
        }
    } catch (e) {
        console.error(e);
    }
}

getWikiImage('Araku Valley');
getWikiImage('Visakhapatnam');
getWikiImage('Paris');
