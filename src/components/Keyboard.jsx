import React from "react";

class Keyboard extends React.Component {
  render() {
    const { onLetterClick } = this.props;
    const keyboardLetters = [
      ["á", "é", "í", "ó", "ú", "ü"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
      ["enter", "z", "x", "c", "v", "b", "n", "m", "⌫"],
    ];
    return (
      <div className="keyboard">
        {keyboardLetters.map((row, index) => (
          <div key={index} className="keyboard-row">
            {row.map((letter, index) => (
              <button
                key={index}
                className={this.findKeyboardClasses(letter)}
                onClick={() => onLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // for each letter, check to see if it needs a special/color class
  findKeyboardClasses = (letter) => {
    let keyClasses = "keyboard-key ";
    if (letter === "enter" || letter === "⌫") {
      return (keyClasses += "special-key");
    } else {
      if (this.props.letters.green.includes(letter)) {
        keyClasses += "key-green";
      } else if (this.props.letters.yellow.includes(letter)) {
        keyClasses += "key-yellow";
      } else if (this.props.letters.grey.includes(letter)) {
        keyClasses += "key-grey";
      }
      return keyClasses;
    }
  };
}

export default Keyboard;
