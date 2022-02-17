const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/';

ghibliApp.init = function() {
    ghibliApp.getMovie();
    ghibliApp.quizEventListener();
    // Event listener for Play Now button
    document.querySelector('.playNow').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.quiz').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

ghibliApp.startQuiz = function() {

    
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

// Declare quiz game variables so they are accessible across app scope
ghibliApp.correctAnswer = '';
ghibliApp.userScore = 0; 
ghibliApp.numRounds = 0; 

// Function which sets up the game 
ghibliApp.gameSetup = function(apiData) {
    // Hide the results div
    document.querySelector('.results').style.display = 'none'; 
    // Update span for round
    const roundEl = document.querySelector('span');
    roundEl.innerHTML = this.numRounds + 1;
    // Display movie titles as options including description for correct movie
    const paragraphElement = document.querySelector('.questionParagraph')
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
    paragraphElement.innerHTML = correctMovie.description; 
    // Display correct movie
    ghibliApp.displayMovie(correctMovie); 
    console.log(`The correct movie is ${correctMovie.title}`);
}

// Function which displays the correct movie description and image
ghibliApp.displayMovie = function(apiData) {
    // Target the elements where movie data will be displayed
    ghibliApp.titleEl = document.querySelector('#movie-title');
    ghibliApp.imgContainer = document.querySelector('#movie-img'); 
    // Store title and description from json response 
    movieTitle = apiData.title;
    movieDesc = apiData.description;
    // Display Title
    ghibliApp.titleEl.innerHTML = movieTitle
    // Create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `A Studio Ghibli movie banner`;
    // Append image element to div (ghibliApp.imgContainer)
    ghibliApp.imgContainer.appendChild(image);
}

// Method that sets up event listeners for the quiz form and submit button
ghibliApp.quizEventListener = function() {
    const checkButton = document.querySelector('.check');
    const submitButton = document.querySelector('.submit');
    document.querySelector('#quiz-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Hide Check Answer button
        checkButton.style.display = 'none';
        // Call method that colour codes the options as correct/incorrect
        ghibliApp.answerStyling();
        // Display submit button
        submitButton.style.opacity = '1'
    });    
    document.querySelector('.submit').addEventListener('click', function(event) {
        event.preventDefault();
        // Hide submit button
        submitButton.style.opacity = '0'
        // Call game logic method
        ghibliApp.gameLogic();
        // Display the results div
        const results = document.querySelector('.results');
        results.style.display = 'flex';
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

// Method that changes the radio input styling of correct/wrong answers for user visibility
ghibliApp.answerStyling = function() {
    // Display results div
    document.querySelector('.results').style.display = 'flex'; 
    // checkButton.style.display = 'block';
    let selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    let labels = document.querySelectorAll('label')
    console.log(labels);
    // Compare user input to correct answer, increase score if necessary
    labels.forEach(label => {
        console.log(label);
        if (label.textContent == selectedAnswer.value) {
            if (selectedAnswer.value == ghibliApp.correctAnswer) {
                label.style.backgroundColor = 'Green'
            } else {
                label.style.backgroundColor = 'Red'
            }
        }
    });
}

// Method that compares the user input to the correct answer and tracks round count and score
ghibliApp.gameLogic = function() {
    console.log('gameLogic() is being called');
    // Increase numRounds count
    ghibliApp.numRounds++; 
    console.log(`Current number of rounds passed is ${ghibliApp.numRounds}`);
    // Store user input
    let userInput = document.querySelector('input[name="quiz"]:checked').value; 
    console.log(`User input was ${userInput}`);
    // Compare user input to correct answer, increase score if necessary
    if (userInput == ghibliApp.correctAnswer) {
        ghibliApp.userScore++; 
    } 
    console.log(`User's current score is ${ghibliApp.userScore}`);
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
        // Show final score
    }
}

ghibliApp.init(); 