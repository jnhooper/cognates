export const grid = `
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
`;

export const submitButtons = `
  grid-column: 2/3;
  display: flex;
  justify-content: flex-end;
  position: relative;
  // min-height: 2rem;
  > button{
    margin-left: 10%;
    padding: 0.5rem;
    // height:1.5rem;
  }
`;

export const loginSignupButtons = `
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 1rem;
  } 
`;

export default { grid, submitButtons, loginSignupButtons };
