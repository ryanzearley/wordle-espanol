import React from "react";
import PuzzleLine from "./PuzzleLine";

class PuzzleGrid extends React.Component {
  render() {
    const { currentGuess, pastGuesses, solution } = this.props;

    // create empty array of guesses
    const guessesArray = Array(6).fill("");

    // fill in past guesses
    for (let i = 0; i < pastGuesses.length; i++) {
      guessesArray[i] = pastGuesses[i];
    }

    // add a new line for currentGuess if under 6 attempts
    if (pastGuesses.length < 6) {
      guessesArray[pastGuesses.length] = currentGuess;
    }

    return (
      <div className="puzzle-grid">
        {guessesArray.map((guess, index) => (
          <PuzzleLine
            key={index}
            guess={guess}
            solution={solution}
            isPastGuess={index < pastGuesses.length}
            isCurrentGuess={index === pastGuesses.length}
          />
        ))}
      </div>
    );
  }
}

export default PuzzleGrid;
