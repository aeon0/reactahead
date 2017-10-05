import React from 'react';
import ReactDOM from 'react-dom';
import Reactahead from './Reactahead';

it('Reactahead renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Reactahead />, div);
});
