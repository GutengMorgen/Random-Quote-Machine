const BASE_URL = 'https://api.quotable.io';

const tags = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tags`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function GetData(){
    const result = await tags();
    // console.log(result) //obtiene un array objetos
    const filter = result.filter(quotes => quotes.quoteCount > 0);
    //recibir el slug
    const getTags = filter.map(item => item.slug);

    console.log(getTags);
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