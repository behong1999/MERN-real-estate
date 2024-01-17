import React from 'react';
import { BeatLoader } from 'react-spinners';

const Spinner = () => {
  return (
    <BeatLoader
      speedMultiplier={0.75}
      size={10}
      color={'#E2E8F0'}
      loading={true}
    />
  );
};

export default Spinner;
