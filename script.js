const ghibliApp = {}

ghibliApp.apiUrl = 'https://ghibliapi.herokuapp.com/films/';

ghibliApp.init = function() {
    ghibliApp.getMovie();
    // Event listener for 'Play Now' button, which scrolls down to the game
    document.querySelector('.play-now').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.quiz-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    // Event listener for 'Play Again' reload button
    document.querySelector('#reload').addEventListener('click', function(event) {
        window.location.reload(); 
    });
    ghibliApp.quizEventListener();
}

// Array of Ghibli Movie Quotes
ghibliApp.quotes = [
    { quote: `You cannot alter your fate. However you can rise to meet it.`,
    source: `Hii-Sama, 'Princess Mononoke' (1997)`}, 
    { quote: `Try laughing. Then whatever scares you will go away.`, 
    source: `Tatsuo Kusakabe, 'My Neighbor Totoro' (1988)`}, 
    { quote: `Always believe in yourself. Do this and no matter where you are, you will have nothing to fear.`, 
    source: `The Baron, 'The Cat Returns' (2002)`}, 
    { quote: `Whenever someone creates something with all of their heart, then that creation is given a soul.`, 
    source: `The Baron, 'The Cat Returns' (2002)`}, 
    { quote: `It's not really important what color your dress is. What matters is the heart inside.`, 
    source: `Kokiri, 'Kiki's Delivery Service' (1989)`}, 
    { quote: `Just follow your heart and keep smiling.`, 
    source: `'Kiki's Delivery Service' (1989)`}, 
    { quote: `They say the best blaze burns brightest, when circumstances are at their worst.`, 
    source: `Sophie Hatter, 'Howl's Moving Castle' (2004)`}, 
    { quote: `No matter how many weapons you have, no matter how great your technology might be, the world cannot live without love.`, 
    source: `Sheeta, 'Castle In The Sky' (1986)`}, 
    { quote: `Once you've met someone, you never really forget them.`, 
    source: `'Spirited Away' (2001)`}
]

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
        fields: 'title,description,movie_banner,rt_score,director,release_date'
    });
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        })
        .then(function (jsonResponse) {
            // Narrow the initial array (jsonResponse) into 4 random movies
            numberOfMovies = 4;
            const randomMovies = jsonResponse.sort(() => .5 - Math.random()).slice(0, numberOfMovies);
            ghibliApp.gameSetup(randomMovies);
            console.log(randomMovies);
        })
        .catch(function() {
            const errorMessage = document.querySelector('h3');
            const errorImg = document.createElement('img');
            // Display error message
            errorMessage.textContent = `Sorry! We're currently experiencing some technical difficulties. Please try again in a few minutes by refreshing the page.`;
            // Hide quiz inputs
            document.querySelector('#quiz-form').style.display = 'none';
            // Add a cute image to make the user feel better
            errorImg.src = './assets/calcifer.gif';
            errorImg.setAttribute('aria-hidden', true);
            document.querySelector('.error-img').appendChild(errorImg);
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
    const moreInfoButton = document.querySelector('.more-info');

    // Event listener when the user clicks 'Check Answer'
    document.querySelector('#quiz-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Display next and more information button
        nextButton.style.opacity = '1';
        moreInfoButton.style.opacity = '1';
        // Fade in the more information button
        moreInfoButton.classList.add('animate__animated', 'animate__slideInDown');
        moreInfoButton.classList.remove('animate__slideOutUp', 'animate__faster');

        // When more information button is clicked, the document will scroll to show more information about the correct movie
        moreInfoButton.addEventListener('click', function (event) {
            document.querySelector('.results').scrollIntoView({
                behavior: 'smooth'
            }); 
        })
        // Hide Check Answer button
        checkButton.style.display = 'none';
        // Call method that colour codes the options as correct/incorrect
        ghibliApp.answerStyling();
        // Display the results div
        const results = document.querySelector('.results');
        results.style.display = 'flex';
    });

    // Event listener when the user clicks 'Next Question'
    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        moreInfoButton.classList.remove('animate__slideInDown');
        moreInfoButton.classList.add('animate__slideOutUp', 'animate__faster');

        // Hide submit and more information button
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
    ghibliApp.directorEl = document.querySelector('#director');
    ghibliApp.releaseDateEl = document.querySelector('#release-date');
    ghibliApp.rtScoreEl = document.querySelector('#rt-score');
    ghibliApp.moreInfoButton = document.querySelector('.more-info');

    // Store title, director, running time, rotten tomatoes score and description from json response 
    movieTitle = apiData.title;
    movieDesc = apiData.description;
    releaseDate = apiData.release_date;
    director = apiData.director;
    rtScore = apiData.rt_score;

    // Display title on results page and within learn more button
    ghibliApp.titleEl.innerHTML = movieTitle;
    ghibliApp.moreInfoButton.textContent = `Learn more about ${movieTitle}!`;

    // Create an image element
    const image = document.createElement('img');
    image.src = apiData.movie_banner;
    image.alt = `${movieTitle}'s movie banner`;

    // Append image element to image container div
    ghibliApp.imgContainer.appendChild(image);

    // Display running time, director and rotten tomatoes score
    ghibliApp.directorEl.textContent = `Director: ${director}`;
    ghibliApp.rtScoreEl.textContent = `${rtScore}%`;
    ghibliApp.releaseDateEl.textContent = `Release Year: ${releaseDate}`;

    // A button that will send the user back to the quiz to continue
    const returnButton = document.querySelector('.return');
    returnButton.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.quiz-section').scrollIntoView({
            behavior: 'smooth'
        });     
    });

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
        // Always turn correct label green
        if (label.textContent == ghibliApp.correctAnswer) {
            label.style.backgroundColor = 'Green';
            label.style.color = 'White'; 
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
        // Display end game results
        document.querySelector('.end-game').style.display = 'flex';
        document.querySelector('.score').textContent = `${ghibliApp.userScore}`; 
        // Display random quote
        const quoteObject = ghibliApp.arrayRandomiser(ghibliApp.quotes);
        const quote = quoteObject.quote;
        const source = quoteObject.source; 
        document.querySelector('.quote').textContent = `"${quote}"`;
        document.querySelector('.source').textContent = `- ${source}`;
    }
}

ghibliApp.init(); 