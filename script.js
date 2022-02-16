// Quiz TO-DO

// Create a form element that gets displayed/reset every round 
// The form will be composed of radio inputs and a submit answer button
// Variables for score and numRounds
// Create a gameLogic method - compares user input to correct answer, adds points or not, increases round count

const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/'; 

// Declare correctAnswer and userAnswer variables so they are accessible to be changed later
// Can maybe put these in the init later??
ghibliApp.correctAnswer = '';
ghibliApp.userAnswer = '';

ghibliApp.init = function() {
    ghibliApp.getMovie();
}

// A function which accepts an array as an argument and returns a randomly chosen value from within that array
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
    // Display description
    ghibliApp.descEl.innerHTML = movieDesc;
    // Create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `${apiData.title}'s movie banner`;
    // Append image element to div (ghibliApp.imgContainer)
    ghibliApp.imgContainer.appendChild(image);
}

ghibliApp.gameLogic = function() {

}

ghibliApp.init(); 