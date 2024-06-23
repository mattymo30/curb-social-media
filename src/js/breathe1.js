let repeatCount = 0;
const maxRepeats = 5; // Number of times to repeat the animation

function breathe1() {
    const circle = document.getElementById('circle');
    const circleText = document.getElementById('circle-text');

    // Expand the circle
    circle.style.transition = 'transform 4s ease-in-out';
    circle.style.transform = 'scale(1.25)';
    circleText.textContent = 'Inhale 4 Seconds';

    setTimeout(() => {
        circleText.textContent = 'Hold 4 Seconds';
        setTimeout(() => {
            // Contract the circle after expansion
            circle.style.transform = 'scale(1)';
            circleText.textContent = 'Exhale 4 Seconds';

            setTimeout(() => {
                circleText.textContent = 'Hold 4 Seconds';
                // Increment repeat count
                repeatCount++;

                if (repeatCount < maxRepeats) {
                    // Repeat the animation after a delay if not reached max repeats
                    setTimeout(breathe1, 4000); 
                }
                else {
                    circleText.textContent = 'All done!';
                }
            }, 4000);
        }, 4000);
    }, 4000);

}

function breathe2() {

    const circle = document.getElementById('circle');
    const circleText = document.getElementById('circle-text');

    // Expand the circle
    circle.style.transition = 'transform 4s ease-in-out';
    circle.style.transform = 'scale(1.25)';
    circleText.textContent = 'Inhale 4 Seconds';

    setTimeout(() => {
        circleText.textContent = 'Hold 7 Seconds';
        setTimeout(() => {
            // Contract the circle after expansion
            circle.style.transition = 'transform 8s ease-in-out';
            circle.style.transform = 'scale(1)';
            circleText.textContent = 'Exhale 8 Seconds';

            setTimeout(() => {
                circleText.textContent = 'Hold';

                // Increment repeat count
                repeatCount++;

                if (repeatCount < maxRepeats) {
                    breathe2();
                } else {
                    circleText.textContent = 'All done!';
                }
            }, 8000); // 8 seconds for exhale
        }, 7000); // 7 seconds for hold
    }, 4000); // 4 seconds for inhale
}


function breathe3() {

    const circle = document.getElementById('circle');
    const circleText = document.getElementById('circle-text');

    // Expand the circle
    circle.style.transition = 'transform 4s ease-in-out';
    circle.style.transform = 'scale(1.25)';
    circleText.textContent = 'Inhale 3 Seconds';

    setTimeout(() => {
        circleText.textContent = 'Hold 3 Seconds';
        setTimeout(() => {
            // Contract the circle after expansion
            circle.style.transition = 'transform 8s ease-in-out';
            circle.style.transform = 'scale(1)';
            circleText.textContent = 'Exhale 6 Seconds';

            setTimeout(() => {
                circleText.textContent = 'Hold';

                // Increment repeat count
                repeatCount++;

                if (repeatCount < maxRepeats) {
                    breathe3();
                } else {
                    circleText.textContent = 'All done!';
                }
            }, 6000); // 6 seconds for exhale
        }, 3000); // 3 seconds for hold
    }, 3000); // 3 seconds for inhale
}

function breathe4() {

    const circle = document.getElementById('circle');
    const circleText = document.getElementById('circle-text');

    // Expand the circle
    circle.style.transition = 'transform 4s ease-in-out';
    circle.style.transform = 'scale(1.25)';
    circleText.textContent = 'Inhale 5 Seconds';

    setTimeout(() => {
        circleText.textContent = 'Hold 5 Seconds';
        setTimeout(() => {
            // Contract the circle after expansion
            circle.style.transition = 'transform 8s ease-in-out';
            circle.style.transform = 'scale(1)';
            circleText.textContent = 'Exhale 5 Seconds';

            setTimeout(() => {
                circleText.textContent = 'Hold';

                // Increment repeat count
                repeatCount++;

                if (repeatCount < maxRepeats) {
                    breathe4();
                } else {
                    circleText.textContent = 'All done!';
                }
            }, 5000); // 5 seconds for exhale
        }, 5000); // 5 seconds for hold
    }, 5000); // 5 seconds for inhale
}


const breathingExercises = [breathe1, breathe2, breathe3, breathe4];

// Event listener for the "Start Breathing Exercise" button click
document.getElementById('start-breathing').addEventListener('click', function() {
    // Randomly select a breathing exercise function
    const randomIndex = Math.floor(Math.random() * breathingExercises.length);
    const selectedExercise = breathingExercises[randomIndex];

    // Start the selected breathing exercise
    console.log(selectedExercise);

    repeatCount = 0; 
    selectedExercise();
});
