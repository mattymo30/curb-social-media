let repeatCount = 0;
const maxRepeats = 5; // Number of times to repeat the animation

document.getElementById('start-breathing').addEventListener('click', function() {
    // Start the breathing animation
    repeatCount = 0; // Reset repeat count
    breathe();
});

function breathe() {
    const circle = document.getElementById('circle');
    const circleText = document.getElementById('circle-text');

    // Expand the circle
    circle.style.transition = 'transform 4s ease-in-out';
    circle.style.transform = 'scale(1.25)';
    circleText.textContent = 'Inhale';

    setTimeout(() => {
        circleText.textContent = 'Hold';
        setTimeout(() => {
            // Contract the circle after expansion
            circle.style.transform = 'scale(1)';
            circleText.textContent = 'Exhale';

            setTimeout(() => {
                circleText.textContent = 'Hold';
                // Increment repeat count
                repeatCount++;

                if (repeatCount < maxRepeats) {
                    // Repeat the animation after a delay if not reached max repeats
                    setTimeout(breathe, 4000); 
                }
            }, 4000);
        }, 4000);
    }, 4000);

    circleText.textContent = 'All done!';

}
