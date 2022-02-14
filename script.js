// To Do
    // Bare bones HTML
    // JS stuff
    // Style it - CSS

const ghibliApp = {}

ghibliApp.init = function() {

}

// Define a function which accepts an array as an argument and gives back a randomly chosen value from within that array
ghibliApp.arrayRandomiser = function (array) {
  const arrayIndex = Math.floor(Math.random() * array.length);
  // console.log(arrayIndex);
  return array[arrayIndex]
}



fetch('https://ghibliapi.herokuapp.com/films/')
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse){
        console.log(jsonResponse);
        // Call randomizer function to narrow results to one movie choice
        const randomResult = ghibliApp.arrayRandomiser(jsonResponse);
        ghibliApp.displayMovie(randomResult); 
    }); 

ghibliApp.displayMovie = function(apiData) {
    // Target the elements where we want to put movie data
    ghibliApp.titleEl = document.querySelector('#movie-title');
    ghibliApp.descEl = document.querySelector('#movie-description');
    ghibliApp.imgContainer = document.querySelector('#movie-img'); 
    
    const movieTitle = apiData.title;
    const movieDesc = apiData.description;
    // display title and description
    ghibliApp.titleEl.innerHTML = movieTitle;
    ghibliApp.descEl.innerHTML = movieDesc;
    // create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `${apiData.title}'s movie banner`;
    // append image element to div (ghibliApp.imgContainer)
    ghibliApp.imgContainer.appendChild(image);
   
}

ghibliApp.init(); 