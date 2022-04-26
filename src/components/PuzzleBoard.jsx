import React from "react";
import TitleBar from "./TitleBar";
import AlertBox from "./AlertBox";
import PuzzleGrid from "./PuzzleGrid";
import Keyboard from "./Keyboard";

class PuzzleBoard extends React.Component {
  state = {
    letters: {
      green: [],
      yellow: [],
      grey: [],
    },
    solution: "amigo",
    currentGuess: "",
    pastGuesses: [],
    activeGame: true,
    alerts: [],
  };

  validLetters =
    "á é í ó ú ü q w e r t y u i o p a s d f g h j k l z x c v b n m";

  componentDidMount() {
    // focus the screen to accept keyboard input and
    // get solution from API
    this.puzzleBoardInput.focus();
    this.getSolution();
  }

  getSolution = async () => {
    const wordListSize = 500;
    let validSolution = false;
    let response;
    let solution;
    let i = 0;

    /* 
    A quirk of the API is that it sometimes returns
    a Spanish word for which it has no definition.
    The app checks for a definition to see if a word
    is valid and requests a new solution if it doesn't have one.
    To avoid excessive requests, the limit is set to 5.
    If a valid word is not received in 5 requests, it uses
    the default word.
    */
    while (!validSolution && i < 5) {
      response = await fetch(
        `https://api.datamuse.com/words?sp=?????&v=es&max=${wordListSize}`
      );

      if (response.ok) {
        let json = await response.json();
        const solutionIndex = Math.floor(Math.random() * wordListSize);
        solution = json[solutionIndex].word;
        validSolution = await this.isWordValid(solution);
      } else {
        this.handleAlert("No se pudo cargar la solución");
      }
      i++;
    }
    if (validSolution) {
      this.setState({
        solution: solution,
      });
    } else {
      this.handleAlert("No se pudo cargar la solución");
    }
  };

  isWordValid = async (word) => {
    let isValid;
    let response = await fetch(
      `https://api.datamuse.com/words?rd=${word}&md=d&v=es&max=1`
    );

    if (response.ok) {
      let json = await response.json();
      let result;

      try {
        result = json[0].defs.length;
      } catch {
        result = 0;
      } finally {
        if (result !== 0) {
          isValid = true;
        } else {
          isValid = false;
        }
      }
    }

    return isValid;
  };

  handleLetterClick = (letter) => {
    if (this.state.activeGame) {
      if (letter === "enter") {
        this.handleSubmit();
      } else if (letter === "⌫") {
        this.handleLetterDelete();
      } else if (this.state.currentGuess.length < 5) {
        this.setState({
          currentGuess: this.state.currentGuess.concat(letter),
        });
      }
    }
  };

  handleKeyboardClick = (e) => {
    if (this.state.activeGame) {
      const key = e.key;

      if (key === "Enter") {
        this.handleSubmit();
      } else if (key === "Backspace") {
        this.handleLetterDelete();
      } else if (
        this.state.currentGuess.length < 5 &&
        this.validLetters.includes(key.toLowerCase())
      ) {
        this.setState({
          currentGuess: this.state.currentGuess.concat(key.toLowerCase()),
        });
      }
    }
  };

  handleLetterDelete = () => {
    this.setState({ currentGuess: this.state.currentGuess.slice(0, -1) });
  };

  handleCheckGuess = () => {
    const guess = this.state.currentGuess;
    const solution = this.state.solution;

    let newGreenLetters = [];
    let newYellowLetters = [];
    let newGreyLetters = [];

    for (let i = 0; i < 5; i++) {
      if (solution[i] === guess[i]) {
        newGreenLetters.push(guess[i]);
      } else if (solution.includes(guess[i])) {
        newYellowLetters.push(guess[i]);
      } else {
        newGreyLetters.push(guess[i]);
      }
    }

    this.setState({
      letters: {
        green: [...this.state.letters.green, ...newGreenLetters],
        yellow: [...this.state.letters.yellow, ...newYellowLetters],
        grey: [...this.state.letters.grey, ...newGreyLetters],
      },
    });
  };

  handleSubmit = async (win = false) => {
    if (this.state.activeGame && this.state.currentGuess.length === 5) {
      // check to see if guess is valid
      if (await this.isWordValid(this.state.currentGuess)) {
        // assign new keyboard letter colors
        this.handleCheckGuess();
        // move on to next guess
        this.setState({
          pastGuesses: [...this.state.pastGuesses, this.state.currentGuess],
          currentGuess: "",
        });
        // refocus the keyboard to avoid double letter input
        this.puzzleBoardInput.focus();

        // check to see if player won or lost
        if (
          this.state.pastGuesses[this.state.pastGuesses.length - 1] ===
          this.state.solution
        ) {
          this.handleWin();
        } else if (this.state.pastGuesses.length === 6) {
          this.handleLoss();
        }
      } else {
        this.handleAlert("¡La palabra no está en la lista!");

        // add invalid guess animation
        const guessTiles = document.querySelectorAll(".current-guess");

        for (let i = 0; i < guessTiles.length; i++) {
          guessTiles[i].classList.add("invalid-guess");
        }

        // remove invalid guess animation
        setTimeout(() => {
          for (let i = 0; i < guessTiles.length; i++) {
            guessTiles[i].classList.remove("invalid-guess");
          }
        }, 250);
      }
    }
  };

  handleAlert = (alert) => {
    // push new alert to top of alert list
    this.setState({
      alerts: [alert, ...this.state.alerts],
    });

    const alertList = document.querySelectorAll(".alert");

    // reapply fade after each re-render
    for (let i = 0; i < alertList.length; i++) {
      alertList[i].classList.add("alert-fade");
    }

    // after delay, pop last alert off the list
    setTimeout(() => {
      this.setState({
        alerts: [...this.state.alerts].slice(0, -1),
      });
    }, 10000);
  };

  handleWin = () => {
    this.setState({
      activeGame: false,
    });

    // add winning guess animation
    const winningTiles = document.querySelectorAll(".winning-tile");

    let i = 0;
    const winTileAnimation = () => {
      winningTiles[i].classList.add("winning-guess");
      i++;
      if (i < winningTiles.length) {
        // call function recursively after delay to
        // animate one letter at a time
        setTimeout(() => winTileAnimation(), 250);
      }
    };

    winTileAnimation();

    // find custom win message based on number of attempts
    let winMessage;
    const attempts = this.state.pastGuesses.length;

    switch (attempts) {
      case 1:
        winMessage = "¡IMPOSIBLE!";
        break;
      case 2:
        winMessage = "¡NO ME DIGAS!";
        break;
      case 3:
        winMessage = "¡Qué impresionante!";
        break;
      case 4:
        winMessage = "¡Bien hecho!";
        break;
      case 5:
        winMessage = "¡Buen trabajo!";
        break;
      case 6:
        winMessage = "¡Por milagro!";
        break;
    }

    this.handleAlert(winMessage);
  };

  handleLoss = () => {
    this.setState({
      activeGame: false,
    });
    this.handleAlert("¡Se acabaron los intentos!");
  };

  render() {
    return (
      <div
        className="puzzle-board"
        tabIndex={0}
        ref={(inputEl) => (this.puzzleBoardInput = inputEl)}
        onKeyDown={this.handleKeyboardClick}
      >
        <TitleBar />
        <AlertBox alerts={this.state.alerts} />
        <PuzzleGrid
          currentGuess={this.state.currentGuess}
          pastGuesses={this.state.pastGuesses}
          solution={this.state.solution}
        />
        <Keyboard
          letters={this.state.letters}
          onLetterClick={this.handleLetterClick}
        />
      </div>
    );
  }
}

export default PuzzleBoard;
