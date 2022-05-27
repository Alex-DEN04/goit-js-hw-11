import Notiflix from 'notiflix';
import imgCard from "./card.hbs"
const axios = require('axios').default;

const refs = {
    form: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    loadBtn: document.querySelector(".load-more")
};

refs.form.addEventListener("submit", onFormSubmit);
refs.loadBtn.addEventListener("click", onLoadMore);

let inputValue = "";

const  options = {
    responseType: 'stream',
    key: "27604632-8d8d559eecaed720301290fe4",
    q: inputValue,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
    page: 1
}
removeLoadBtn()

function onFormSubmit (event) {
    event.preventDefault();
    removeLoadBtn()
    cliarGallery();
    inputValue = event.currentTarget.elements.searchQuery.value;
    options.q = inputValue;
    if (inputValue === "") {
        Notiflix.Notify.info("Please enter a search query.");
        return;
    }
    markups();
}

function onLoadMore() {
    removeLoadBtn();
    options.page += 1;
    markups();
}

async function getData() {
    try {
        const response = await axios.get("https://pixabay.com/api/", {
            params: options
        });
        const photos = response.data.hits;
        if (photos.length === 0) {
            removeLoadBtn();
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        if (response.data.totalHits <= (options.per_page * options.page)) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
            removeLoadBtn();
            return;
        }
        return photos;
    } catch (error) {
        console.log(error);
    }
}

function markups() {
    getData().then(photos => {
        if (!photos) {
            return;
        }
        photos.map(photo => {
            const markup = imgCard(photo);
            refs.gallery.insertAdjacentHTML("beforeend", markup);
            addLoadBtn();
        });
    });
}

function cliarGallery() {
    refs.gallery.innerHTML = "";
}

function addLoadBtn() {
    refs.loadBtn.style.display = "block";
}

function removeLoadBtn() {
    refs.loadBtn.style.display = "none";
}