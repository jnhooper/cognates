/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState, useCallback } from 'react';
import Cognate from './Cognate';
import { useSpring, animated, useTransition } from 'react-spring';
import Button from '@material-ui/core/Button';

const CognateList = ({ cognates }) => {
  const [state, setPositionIndex] = useState({
    left: cognates.length - 1,
    center: 0,
    right: 1,
    shift: 'initialize',
  });

  console.log(state);
  const moveLeftWrap = leftIndex =>
    leftIndex === cognates.length - 1 ? 0 : leftIndex + 1;

  const moveLeft = state => ({
    left: moveLeftWrap(state.left),
    center: moveLeftWrap(state.center),
    right: moveLeftWrap(state.right),
    shift: 'left',
  });

  const moveRightWrap = rightIndex =>
    rightIndex === 0 ? cognates.length - 1 : rightIndex - 1;
  const moveRight = state => ({
    left: moveRightWrap(state.left),
    center: moveRightWrap(state.center),
    right: moveRightWrap(state.right),
    shift: 'right',
  });

  const transitionNext = useTransition(state.center, null, {
    from: {
      opacity: 0,
      position: 'absolute',
      transform: 'translateX(200%)',
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
    },
    leave: {
      opacity: 0.5,
      transform: 'translateX(0%)',
    },
  });

  const transitionBack = useTransition(state.center, null, {
    from: {
      opacity: 0,
      position: 'absolute',
      transform: 'translateX(0%)',
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
    },
    leave: {
      opacity: 0,
      transform: 'translateX(200%)',
    },
  });
  return (
    <div
      css={css(`
        display: inline-grid;
        width: 100%;
        grid-template-rows: auto auto;
        position:relative;
        flex-direction:row;
      `)}
    >
      <div
        css={css(
          `display: flex;
          flex-direction:row;
          position:absolute; 
          width: 100%;
          grid-row:1/2;
          justify-content: center;`
        )}
      >
        {state.shift === 'right'
          ? transitionNext.map(({ item, props, key }) => {
              return (
                <animated.div style={props}>
                  <Cognate {...cognates[item]} key={key} />
                </animated.div>
              );
            })
          : transitionBack.map(({ item, props, key }) => {
              return (
                <animated.div style={props}>
                  <Cognate {...cognates[item]} key={key} />
                </animated.div>
              );
            })}
      </div>

      <div css={css(`opacity: 0;  grid-row:1/2; z-index: -1;`)}>
        <Cognate {...cognates[state.center]} />
      </div>
      <div
        css={css(`
        display: inline-flex;
        justify-content:center;
        width: 100%;
        grid-row: 2/3;
      `)}
      >
        <Button
          onClick={e => {
            console.log('clicked');
            e.preventDefault();
            setPositionIndex(moveLeft(state));
          }}
        >
          Back
        </Button>

        <Button
          onClick={e => {
            e.preventDefault();
            setPositionIndex(moveRight(state));
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CognateList;
