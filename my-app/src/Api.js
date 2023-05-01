const BASE_URL = 'https://api.quotable.io';

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
