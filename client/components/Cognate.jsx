/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { useSpring, animated, config } from 'react-spring';
import Card from '@material-ui/core/Card';

//get the width of the line
const getWidth = (guessLength, correctLenth) => {
  const result = (guessLength / correctLenth) * 100;
  return result > 100 ? '100%' : `${result}%`;
};

const isCorrectSoFar = (guess, answer) => {
  if (guess.length === 0) {
    return false;
  }
  const reducedAnswer = answer.substring(0, guess.length);
  if (reducedAnswer.toLowerCase() === guess.toLowerCase()) {
    return true;
  }
};
const Cognate = ({ english, russian }) => {
  const [guess, setGuess] = useState('');
  const [oldGuess, setOldGuess] = useState('');

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

  return (
    // <animated.div style={props}>
    <Card
      css={css(`
          display: inline-grid;
          width: 100%;
          padding: 2rem;
          `)}
    >
      <h1>{english}</h1>
      <div css={css(`position:relative; display:inline-block;`)}>
        <TextField
          label="Russian"
          margin="normal"
          onChange={event => {
            setOldGuess(guess);
            setGuess(event.target.value);
          }}
        />
        <animated.div style={progressProps}>
          <div
            css={css(`
              height: 0.3rem;
              width: 100%;
              background-color: ${
                isCorrectSoFar(guess, russian) ? 'green' : 'red'
              };
            `)}
          />
        </animated.div>
      </div>
      {/* <h4>{russian}</h4> */}
    </Card>
    // </animated.div>
  );
};

export default Cognate;
