import fallback from './default-user.png';
const BASE_URL = 'https://api.quotable.io';
const IMAGE_BASE = 'https://images.quotable.dev/profile/200' //size = 200
const WIKI_IMAGE_BASE = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='
// const WIKI_IMAGE_BASE = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&titles='

export const tags = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tags`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const randomQuotes = async () => {
    try {
        const response1 = await fetch(`${BASE_URL}/random`);
        const data1 = response1.json();
        return data1;
    } catch (error) {
        console.log(error);
    }
}

export const getQouteByTag = async (selectTag) => {

    let str = selectTag === 'random' ? '/random' :  '/random?tags=' + selectTag;

    try {
        const response2 = await fetch(`${BASE_URL}${str}`)
        const data2 = response2.json();
        return data2;
    } catch (error) {
        console.log(error);
    }
}


export const getImage = async (authorSlug) => {
    /*try {
        const testing = fallback;

        const response = await fetch(`${IMAGE_BASE}/${authorSlug}.jpg`, {method: 'HEAD'});
        if(response.ok)
        {
            console.log('Image found');
        }
        else{
            console.log('Image not found');
        }
        // return response.ok ? response.url : fallback;
        return fallback;
    } catch (error) {
        console.log(error, 'fefefe');
        // return fallback;
    }*/
    try {
        const headResponse = await fetch(`${IMAGE_BASE}/${authorSlug}.jpg`, { method: 'HEAD' });
        
        if(headResponse.status === 404)
        {
          console.log('Image not found');
          return fallback;
        }
        else if (headResponse.ok) {
            const getResponse = await fetch(`${IMAGE_BASE}/${authorSlug}.jpg`);
            console.log(getResponse);
            return getResponse.url;
        }
      } catch (error) {
        if (error.message === 'Not Found' || error.message === 'Failed to fetch') {
          return fallback;
        }
        throw error;
      }
}

//on testing
export const getWikiImage = async (authorName) => {
    try {
        const response = await fetch(`${WIKI_IMAGE_BASE}${authorName}&origin=*`);
        const data = response.url;
        const testing = await fetch(`${data}`);
        const get = testing.json();
        if(testing.ok)
        {
            console.log('Image found');
        }
        else{
            console.log('Image not found')
        }
        return get;
    } catch (error) {
        console.log(error);
    }
}