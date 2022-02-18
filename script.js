const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/';

ghibliApp.init = function() {
    ghibliApp.getMovie();
    // Event listener for 'Play Now' button, which scrolls down to the game
    document.querySelector('.play-now').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.quiz').scrollIntoView({
            behavior: 'smooth'
        });
    });
    // Event listener for 'Play Again' reload button
    document.querySelector('#reload').addEventListener('click', function(event) {
        window.location.reload(); 
    });
    ghibliApp.quizEventListener();
}

// Method which accepts an array as an argument and returns a random index
ghibliApp.arrayRandomiser = function(array) {
  const arrayIndex = Math.floor(Math.random() * array.length);
    return array[arrayIndex]; 
}

// Method that makes a request to the API and narrows the results into an array of 4 random movies
ghibliApp.getMovie = function() {
    const url = new URL(ghibliApp.apiUrl); 
    url.search = new URLSearchParams({
        // Only grabbing the fields we need
        fields: 'title,description,movie_banner'
    });
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse){
            // Narrow the initial array (jsonResponse) into 4 random movies
            numberOfMovies = 4;
            const randomMovies = jsonResponse.sort(() => .5 - Math.random()).slice(0, numberOfMovies)
            ghibliApp.gameSetup(randomMovies);
        }); 
}

// Initialize quiz game variables
ghibliApp.correctAnswer = '';
ghibliApp.userScore = 0; 
ghibliApp.numRounds = 0; 

// Method which sets up game display
ghibliApp.gameSetup = function(apiData) {
    // Hide the results div
    document.querySelector('.results').style.display = 'none'; 
    // Update question number span
    const roundEl = document.querySelector('.question-number');
    roundEl.innerHTML = this.numRounds + 1;
    // Display movie titles as options
    const choiceElement = document.querySelectorAll('.choice');
    const labelElement = document.querySelectorAll('.label');
    choiceElement.forEach(choice => {
        for(let i = 0; i < labelElement.length; i++) {
            choiceElement[i].value = apiData[i].title;
            labelElement[i].textContent = apiData[i].title;
        }
    });
    // Assign the correct movie answer to a correctMovie variable    
    const correctMovie = ghibliApp.arrayRandomiser(apiData);
    ghibliApp.correctAnswer = correctMovie.title; 
    // Display correct movie description
    const paragraphElement = document.querySelector('.question-paragraph');
    paragraphElement.innerHTML = correctMovie.description; 
    // Display correct movie in the results div
    ghibliApp.displayMovie(correctMovie); 
}

// Method that sets up event listeners for the quiz form and buttons
ghibliApp.quizEventListener = function() {
    const checkButton = document.querySelector('.check');
    const nextButton = document.querySelector('.next');
    // Event listener when the user clicks 'Check Answer'
    document.querySelector('#quiz-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Hide Check Answer button
        checkButton.style.display = 'none';
        // Call method that colour codes the options as correct/incorrect
        ghibliApp.answerStyling();
        // Display next button
        nextButton.style.opacity = '1';
        // Display the results div
        const results = document.querySelector('.results');
        results.style.display = 'flex';
    });
    // Event listener when the user clicks 'Next Question'
    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        // Hide submit button
        nextButton.style.opacity = '0';
        // Call game logic method
        ghibliApp.gameLogic();
        // Remove colour coded labels from previous answer
        let labels = document.querySelectorAll('label');
        labels.forEach(label => {
            label.style.backgroundColor = '';
            label.style.color = '';
        });
        // Show check answer button
        checkButton.style.display = 'block';
    });
}

// Method which displays the correct movie description and image in a div below the quiz
ghibliApp.displayMovie = function(apiData) {
    // Target the elements where movie data will be displayed
    ghibliApp.titleEl = document.querySelector('#movie-title');
    ghibliApp.imgContainer = document.querySelector('#movie-img');
    // Store title and description from json response 
    movieTitle = apiData.title;
    movieDesc = apiData.description;
    // Display title
    ghibliApp.titleEl.innerHTML = movieTitle;
    // Create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `A Studio Ghibli movie banner`;
    // Append image element to image container div
    ghibliApp.imgContainer.appendChild(image);
}

// Method that changes the radio input styling of correct/wrong answers
ghibliApp.answerStyling = function() {
    // Display results div
    document.querySelector('.results').style.display = 'flex'; 
    let selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    let labels = document.querySelectorAll('label'); 
    labels.forEach(label => {
        // Change label colour based on user answer
        if (label.textContent == selectedAnswer.value) {
            if (selectedAnswer.value == ghibliApp.correctAnswer) {
                label.style.backgroundColor = 'Green';
            } else {
                label.style.backgroundColor = 'Red';
            }
        }
    });
}

// Method that compares the user input to the correct answer and tracks round count and score
ghibliApp.gameLogic = function() {
    // Increase numRounds count
    ghibliApp.numRounds++; 
    // Store user input
    let userInput = document.querySelector('input[name="quiz"]:checked').value; 
    // Compare user input to correct answer, increase score if necessary
    if (userInput == ghibliApp.correctAnswer) {
        ghibliApp.userScore++; 
    } 
    // If numRounds < 4, call getMovie() to get 4 new movies
    if (ghibliApp.numRounds < 4) {
        // Clear the movie img div
        document.querySelector('#movie-img').innerHTML = '';
        ghibliApp.getMovie(); 
    // After 4 rounds, end the game
    } else {
        // Hide quiz div
        document.querySelector('.quiz').style.display = 'none'; 
        // Clear display
        document.querySelector('.results').innerHTML = '';
        // Show end game results
        document.querySelector('.end-game').style.display = 'flex';
        document.querySelector('.score').textContent = `${ghibliApp.userScore}`; 
    }
}

ghibliApp.init(); 