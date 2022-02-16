const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/'; 

ghibliApp.init = function() {
    ghibliApp.getMovie();
}

// Define a function which accepts an array as an argument and returns a randomly chosen value from within that array
ghibliApp.arrayRandomiser = function(array) {
  const arrayIndex = Math.floor(Math.random() * array.length);
  return array[arrayIndex]; 
}

ghibliApp.getMovie = function() {
    fetch(ghibliApp.apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse){
            console.log(jsonResponse);
            // Call randomizer function to narrow results to one movie choice
            ghibliApp.randomResult = ghibliApp.arrayRandomiser(jsonResponse);
            ghibliApp.displayMovie(ghibliApp.randomResult); 
        }); 
}

ghibliApp.displayMovie = function(apiData) {
    // Target the elements where movie data will be displayed
    ghibliApp.titleEl = document.querySelector('#movie-title');
    ghibliApp.descEl = document.querySelector('#movie-description');
    ghibliApp.imgContainer = document.querySelector('#movie-img'); 
    // Store title and description from json response 
    movieTitle = apiData.title;
    movieDesc = apiData.description;
    // Display title and description
    ghibliApp.titleEl.innerHTML = movieTitle;
    ghibliApp.descEl.innerHTML = movieDesc;
    // Create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `${apiData.title}'s movie banner`;
    // Append image element to div (ghibliApp.imgContainer)
    ghibliApp.imgContainer.appendChild(image);
}

ghibliApp.init(); 