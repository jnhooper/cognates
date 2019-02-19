/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import { useSpring, animated, config, useTransition } from 'react-spring';
import Card from '@material-ui/core/Card';
import { string, bool } from 'prop-types';

// get the width of the line
const getWidth = (guessLength: number, correctLenth: number) => {
  const result = (guessLength / correctLenth) * 100;
  return result > 100 ? '100%' : `${result}%`;
};

const isCorrectSoFar = (guess: string, answer: string) => {
  if (guess.length === 0) {
    return false;
  }
  const reducedAnswer = answer.substring(0, guess.length);
  if (reducedAnswer.toLowerCase() === guess.toLowerCase()) {
    return true;
  }
};

interface iCognate {
  english: string;
  russian: string;
}
const Cognate = ({ english, russian }: iCognate) => {
  const [guess, setGuess] = React.useState('');
  const [oldGuess, setOldGuess] = React.useState('');
  const [lockedGuess, setLockedGuess] = React.useState('');
  const [wrongCount, setWrongCount] = React.useState(0);

  const props = useSpring({
    config: {
      ...config.default,
      mass: 1,
    },
    to: { opacity: 1, marginTop: 0 },
    from: { marginTop: -2000, opacity: 0 },
  });

  const progressProps = useSpring({
    from: {
      width: getWidth(oldGuess.length, russian.length),
    },
    to: {
      width: getWidth(guess.length, russian.length),
    },
  });

  const value =
    isCorrectSoFar(guess, russian) && guess.length > 0 ? guess : lockedGuess;
  const showHint = wrongCount >= 3;
  let hintIndex = 0;
  if (guess.length > 0 && showHint) {
    if (isCorrectSoFar(guess, russian)) {
      hintIndex = guess.length;
    } else {
      hintIndex = guess.length - 1;
    }
  }
  // const hintIndex = oldGuess.length <= 0 ? 0 : oldGuess.length - 1;
  console.log(oldGuess);
  const hintProps = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });
  const transitions = useTransition(showHint, null, {
    from: { position: 'absolute', opacity: 0, marginTop: '0rem' },
    enter: { opacity: 1, marginTop: '-4.5rem' },
    leave: { opacity: 0, marginTop: '0rem' },
  });
  const successGreen = '#4BB543';

  return (
    <div>
      {/* render the hint */}
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div style={props}>
              <h1
                css={css(
                  `z-index: 0;
                  background-color: ${successGreen};
                  margin-left:1rem;
                  color: white;
                  padding: 0.5rem;
                  border-radius: 0.3rem;`
                )}
              >
                {russian[hintIndex]}
              </h1>
            </animated.div>
          )
      )}
      <Card
        css={css(`
          display: inline-grid;
          width: 100%;
          padding: 2rem;
          z-index: 1000;
          background-color: white;
          position:relative;
          `)}
      >
        <h1>{english}</h1>
        <div css={css(`position:relative; display:inline-block;`)}>
          <TextField
            label="Russian"
            margin="normal"
            value={value}
            onChange={event => {
              const newGuess = event.target.value;
              if (newGuess.length === 0) {
                setGuess(newGuess);
                setOldGuess(newGuess);
                setLockedGuess(newGuess);
              } else if (isCorrectSoFar(newGuess, russian)) {
                // it is correct so far and the guess is > 0.
                // reset the count and update guesses.
                setGuess(newGuess);
                setOldGuess(guess);
                setLockedGuess('');
                if (lockedGuess.length <= newGuess.length) {
                  setWrongCount(0);
                }
              } else {
                // the length is greater than 0. and its not correct so far.
                setWrongCount(wrongCount + 1);
                if (lockedGuess.length === 0) {
                  setLockedGuess(newGuess);
                  setGuess(newGuess);
                }
              }
            }}
          />
          <animated.div style={progressProps}>
            <div
              css={css(`
              height: 0.3rem;
              width: 100%;
              background-color: ${
                isCorrectSoFar(guess, russian) ? successGreen : 'red'
              };
            `)}
            />
          </animated.div>
        </div>
      </Card>
    </div>
  );
};

export default Cognate;
