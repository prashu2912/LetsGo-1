const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=Araku%20Valley&gsrlimit=1&prop=pageimages&piprop=original&format=json&origin=*";

fetch(url)
    .then(res => res.json())
    .then(data => {
        const pages = data.query?.pages;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            console.log("Image:", pages[pageId].original?.source);
        }
    });
