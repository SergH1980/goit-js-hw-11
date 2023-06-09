import Notiflix from 'notiflix';
import axios from 'axios';

const MY_KEY = `34506200-683bb96ed138c06f38447d715`;
const URL = 'https://pixabay.com/api/';

export async function loadMoreImages(searchValue, perPage, page) {
  const fetchConfig = {
    method: 'get',
    baseURL: `${URL}`,
    params: {
      key: `${MY_KEY}`,
      q: `${searchValue}`,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: `true`,
      per_page: `${perPage}`,
      page: `${page}`,
    },
  };

  try {
    const response = await axios.request(fetchConfig);

    // console.log(response);
    // console.log(response.data.totalHits);
    // console.log(fetchConfig.params.per_page);
    let resultArray = response.data.hits;

    if (response.data.hits.length < fetchConfig.params.per_page) {
      Notiflix.Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    return resultArray;
  } catch (error) {
    console.error(error);
  }
}
