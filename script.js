const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/'; 

// Declare quiz game variables so they are accessible to be changed later
// Can maybe put these in the init later??
ghibliApp.correctAnswer = '';
ghibliApp.userAnswer = '';
ghibliApp.numRounds = 0; 

ghibliApp.init = function() {
    ghibliApp.getMovie();
    ghibliApp.quizEventListener();
}

// Function which accepts an array as an argument and returns a randomly chosen value from within that array
ghibliApp.arrayRandomiser = function(array) {
  const arrayIndex = Math.floor(Math.random() * array.length);
  return array[arrayIndex]; 
}

ghibliApp.getMovie = function() {
    const url = new URL(ghibliApp.apiUrl); 
    url.search = new URLSearchParams({
        // Only grabbing the fields we need
        fields: 'title,description,movie_banner',
        // I tried to increase this limit so we access more of the database (currently only returns same 22 movies) - doesn't work for some reason 🤔
        limit: 100
    });
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse){
            console.log(jsonResponse);
            ghibliApp.gameSetup(jsonResponse);
        }); 
}

// Function which sets up the game 
ghibliApp.gameSetup = function(apiData) {
    // Select 4 random movies from the array using arrayRandomiser()
    // There is currently a small chance it will choose the same movie twice 🤔
    const movieOne = ghibliApp.arrayRandomiser(apiData); 
    const movieTwo = ghibliApp.arrayRandomiser(apiData); 
    const movieThree = ghibliApp.arrayRandomiser(apiData); 
    const correctMovie = ghibliApp.arrayRandomiser(apiData); 
    // Store the titles of the above movie arrays into inputs and correctAnswer variable
    // Currently the 4th option is always the right answer 🤔 Should figure out way to randomize this 
    document.querySelector('#choice-1').value = movieOne.title; 
    document.querySelector('#label-1').textContent = movieOne.title; 
    document.querySelector('#choice-2').value = movieTwo.title; 
    document.querySelector('#label-2').textContent = movieTwo.title;
    document.querySelector('#choice-3').value = movieThree.title;
    document.querySelector('#label-3').textContent = movieThree.title;
    document.querySelector('#choice-4').value = correctMovie.title;
    document.querySelector('#label-4').textContent = correctMovie.title;
    ghibliApp.correctAnswer = correctMovie.title; 
    // Display correct movie
    ghibliApp.displayMovie(correctMovie); 
    console.log(`The correct movie is ${correctMovie.title}`);
}

// Function which displays the correct movie description and image
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

// Add an event listener which will call gameLogic() when submit button is clicked 
ghibliApp.quizEventListener = function() {
    document.querySelector('#quiz-form').addEventListener('submit', function(event) {
        event.preventDefault();
        ghibliApp.gameLogic(); 
    });
}

ghibliApp.gameLogic = function() {
    console.log('gameLogic() is being called');
    // Compare user input to correct answer

    // Add points if applicable

    // Increase numRounds count

    // If numRounds < 4, call gameSetup() again to begin new round

    // End game when numRounds == 4

}

ghibliApp.init(); 