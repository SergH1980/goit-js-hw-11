import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import axios from 'axios';
import { fetchImages } from './js/fetchImages';
import { loadMoreImages } from './js/loadMoreImages';

const refs = {
  form: document.querySelector(`.search-form`),
  input: document.querySelector(`input[type=text]`),
  submitButton: document.querySelector(`button[type=submit]`),
  loadMoreButton: document.querySelector(`.load-more`),
  gallery: document.querySelector(`.gallery`),
};

const MY_KEY = `34506200-683bb96ed138c06f38447d715`;
const URL = 'https://pixabay.com/api/';

const axios = require('axios');

refs.loadMoreButton.style.visibility = 'hidden';

refs.form.addEventListener(`submit`, onSubmitButton);
refs.loadMoreButton.addEventListener(`click`, onLoadMoreButton);

let searchValue = ``;
let searchResult = ``;
let page = 1;
let perPage = 40;

function onSubmitButton(event) {
  event.preventDefault();
  refs.loadMoreButton.style.visibility = 'hidden';
  searchValue = event.target.elements.searchQuery.value.trim();

  if (!searchValue) {
    return (refs.gallery.innerHTML = ``);
  } else if (searchResult === searchValue) {
    return;
  }
  page = 1;

  searchResult = searchValue;

  fetchImages(searchValue, perPage, page)
    .then(result => {
      if (result.length === perPage) {
        refs.loadMoreButton.style.visibility = 'visible';
      }
      imageMarkup(result);
      let gallery = new SimpleLightbox('.gallery a');
    })
    .catch(error => console.log(error));
}

function onLoadMoreButton(event) {
  page += 1;

  loadMoreImages(searchValue, perPage, page)
    .then(result => {
      if (result.length < perPage) {
        refs.loadMoreButton.style.visibility = 'hidden';
      }
      imageMarkup(result);
      let gallery = new SimpleLightbox('.gallery a');
      gallery.refresh();
      window.scrollTo(0, 0);
    })
    .catch(error => console.log(error));
}

function imageMarkup(data) {
  const singleImage = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="400px" height="320px"/>
  <div class="info">
    <p class="info-item">
      <b class="info-name">Likes <span class="info-value">${likes}</span></b>
    </p>
    <p class="info-item">
      <b class="info-name">Views<span class="info-value">${views}</span></b>
    </p>
    <p class="info-item">
      <b class="info-name">Comments <span class="info-value">${comments}</span></b>
    </p>
    <p class="info-item">
      <b class="info-name">Downloads <span class="info-value">${downloads}</span></b>
    </p>
  </div>
</div></a>`;
      }
    )
    .join(``);

  refs.gallery.innerHTML = singleImage;
  return singleImage;
}
