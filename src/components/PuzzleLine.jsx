import React from "react";

class PuzzleLine extends React.Component {
  render() {
    const { guess, solution, isPastGuess, isCurrentGuess } = this.props;

    // create empty array with length 5 and fill with letters
    // from past or current guess
    const guessArray = Array(5).fill("");
    for (let i = 0; i < guess.length; i++) {
      guessArray[i] = guess[i];
    }

    // initialize array to store CSS classes for tiles
    let puzzleBoxColors = Array(5).fill("puzzle-box");
    let totalGreen = 0;

    // for past guesses, find tile colors and store to array
    if (isPastGuess) {
      puzzleBoxColors = Array(5).fill("puzzle-box");
      // letterBank is a list of letters from the solution used
      // to check to see if there are matches
      let letterBank = [...solution];
      // hasBeenAssigned is used to not check letters twice if
      // they are assigned to green or yellow
      // "" means it has been assigned and will not be evaluated again
      let hasBeenAssigned = [...guess];

      // process green tiles first, removing matches from letterBank
      for (let i = 0; i < guess.length; i++) {
        if (guess.charAt(i) === letterBank[i]) {
          puzzleBoxColors[i] += " puzzle-box-green";
          totalGreen++;
          letterBank[i] = "";
          hasBeenAssigned[i] = "";
        }
      }

      // process yellow tiles, checking entire word and
      // removing matches from letterBank
      for (let i = 0; i < guess.length; i++) {
        if (hasBeenAssigned[i] !== "" && letterBank.includes(guess.charAt(i))) {
          puzzleBoxColors[i] += " puzzle-box-yellow";
          letterBank[letterBank.indexOf(guess.charAt(i))] = "";
          hasBeenAssigned[i] = "";
        }
      }

      // process grey colors last, assigning grey to any
      // tile that has not been assigned
      for (let i = 0; i < puzzleBoxColors.length; i++) {
        if (hasBeenAssigned[i] !== "") {
          puzzleBoxColors[i] += " puzzle-box-grey";
          hasBeenAssigned[i] = "";
        }
      }
      // add reference classes to allow for animation if
      // guess is incorrect or the solution
    } else if (isCurrentGuess) {
      puzzleBoxColors = Array(5).fill("puzzle-box current-guess");
    }

    if (totalGreen === 5) {
      for (let i = 0; i < puzzleBoxColors.length; i++) {
        puzzleBoxColors[i] += " winning-tile";
      }
    }

    return (
      <div className="puzzle-line">
        {guessArray.map((letter, index) => (
          <div key={index} className={puzzleBoxColors[index]}>
            {letter}
          </div>
        ))}
      </div>
    );
  }
}

export default PuzzleLine;
