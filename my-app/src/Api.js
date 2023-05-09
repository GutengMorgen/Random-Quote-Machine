const BASE_URL_QG = 'https://quote-garden.onrender.com/api/v3';
const WIKI_IMAGE_BASE = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='
// const WIKI_IMAGE_BASE = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&titles='

export const newGetQuoteByTag = async (tagName) => {

    let str = tagName === 'random' ? 'random' : `random?genre=${tagName}`;

    try {
        const response = await fetch(`${BASE_URL_QG}/quotes/${str}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const newTags = async () => {
    try {
        const response = await fetch(`${BASE_URL_QG}/genres`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getWikiImage = async (authorName) => {
    try {
        const response = await fetch(`${WIKI_IMAGE_BASE}${authorName}&origin=*`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}