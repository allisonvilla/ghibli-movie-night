const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/';

// Declare quiz game variables so they are accessible to be changed later
// Can maybe put these in the init later??
ghibliApp.correctAnswer = '';
ghibliApp.userAnswer = '';
ghibliApp.numRounds = 0;

ghibliApp.init = function () {
    ghibliApp.getMovie();
    ghibliApp.quizEventListener();
}

// Function which accepts an array as an argument and returns a randomly chosen value from within that array
ghibliApp.arrayRandomiser = function (array) {
    const arrayIndex = Math.floor(Math.random() * array.length);
    return array[arrayIndex];
}

ghibliApp.getMovie = function () {
    const url = new URL(ghibliApp.apiUrl);
    url.search = new URLSearchParams({
        // Only grabbing the fields we need
        fields: 'title,description,movie_banner',
        // I tried to increase this limit so we access more of the database (currently only returns same 22 movies) - doesn't work for some reason 🤔
        limit: 100
    });
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            console.log(jsonResponse);
            // Narrow the initial array (jsonResponse) into 4 random movies
            numberOfMovies = 4;
            const randomMovies = jsonResponse.sort(() => .5 - Math.random()).slice(0, numberOfMovies)

            // console.log(randomMovies);
            ghibliApp.gameSetup(randomMovies);
        });
}

// Function which sets up the game 
ghibliApp.gameSetup = function (apiData) {

    console.log(apiData);


    // const currentAnswer = $(`input[name=${answerKey}]:checked`).val();

    // assign the correct movie answer to a correctMovie variable    
    const correctMovie = ghibliApp.arrayRandomiser(apiData);

    const choiceElement = document.querySelectorAll('.choice');
    const labelElement = document.querySelectorAll('.label');
    // console.log(labelElement);

    choiceElement.forEach(choice => {
        for (let i = 0; i < labelElement.length; i++) {
            choiceElement[i].value = apiData[i].title;
            labelElement[i].textContent = apiData[i].title;
            console.log(i);
        }
    });

    // Assign correct answer variable
    ghibliApp.correctAnswer = correctMovie.title;

    // Display correct movie
    ghibliApp.displayMovie(correctMovie);
    console.log(`The correct movie is ${correctMovie.title}`);

}

// Function which displays the correct movie description and image
ghibliApp.displayMovie = function (apiData) {
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
    // Should probably change the alt text to not give away the answer lol
    image.alt = `${apiData.title}'s movie banner`;
    // Append image element to div (ghibliApp.imgContainer)
    ghibliApp.imgContainer.appendChild(image);
}

// Add an event listener which will call gameLogic() when submit button is clicked 
ghibliApp.quizEventListener = function () {
    document.querySelector('#quiz-form').addEventListener('submit', function (event) {
        event.preventDefault();
        ghibliApp.gameLogic();
    });
}

ghibliApp.gameLogic = function () {
    console.log('gameLogic() is being called');
    // store users input
    //const userChoice = $(`input[name=${quiz}]:checked`).val();
    let userChoice = document.querySelector('input:checked').value
    

    // Compare user input to correct answer
    

    // Add points if applicable

    // Increase numRounds count

    // If numRounds < 4, call gameSetup() again to begin new round

    // End game when numRounds == 4

}

ghibliApp.init(); 