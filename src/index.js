import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import imgCard from "./card.hbs"
const axios = require('axios').default;

const refs = {
    form: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    loadBtn: document.querySelector(".load-more"),
    largeImage: document.querySelector(".link"),
};

refs.form.addEventListener("submit", onFormSubmit);
refs.loadBtn.addEventListener("click", onLoadMore);

let inputValue = "";

let total = 0;

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
    total = 0;
    options.page = 1;
    cliarGallery();
    inputValue = event.currentTarget.elements.searchQuery.value.trim();
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
        const photos = response.data;
        if (photos.hits.length === 0) {
            removeLoadBtn();
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
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
        if (options.page === 1) {
            Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`)
        }
        for (let photo of photos.hits) {
            const markup = imgCard(photo);
            refs.gallery.insertAdjacentHTML("beforeend", markup);
            addLoadBtn();
            total += 1;
            if (photos.totalHits === total) {
                removeLoadBtn();
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
                return;
            }
        }
        // refs.largeImage.addEventListener("click", onImageClick);
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

// let gallery = new SimpleLightbox(".link");
// gallery.on('show.simplelightbox', function () {
