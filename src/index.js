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


function onFormSubmit (event) {
    event.preventDefault();

    cliarGallery();
    inputValue = event.currentTarget.elements.searchQuery.value;
    // options.per_page = 10;
    options.q = inputValue;
    

    getData();
    refs.loadBtn.classList.remove("hidden");
    // cliarForm()
}

function onLoadMore() {
    refs.loadBtn.classList.add("hidden");
    if (!options.q) {
        return;
    }
    if (500 <= options.per_page) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        refs.loadBtn.classList.add("hidden");
        return;
    }

    options.page += 1;
    getData();
    
    console.log(options.page);
    refs.loadBtn.classList.remove("hidden");
}

function getData() {
    axios.get("https://pixabay.com/api/", {
    params: options
})
    .then(response => {
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            // cliarForm();
            return;
        }
        const photos = response.data.hits
        // console.log(photos);
        return photos;
    })
    .catch(error => {
        console.log(error);
        return;
    }).then(photos => {
        photos.map(photo => {
            const markup = imgCard(photo);
           
            refs.gallery.insertAdjacentHTML("beforeend", markup);

            console.log(photo)
        })
    
    
    });
}
// function markup() {
//     getData()
//     .then(photos => {
//         photos.map(photo => {
//             const markup = imgCard(photo);
           
//             refs.gallery.insertAdjacentHTML("beforeend", markup);

//             // console.log(photo)
//         })
    
//     });
// }



function cliarGallery() {
    refs.gallery.innerHTML = "";
}
function cliarForm() {
    refs.form.reset();
}