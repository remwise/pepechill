import React from 'react';
import { Link } from 'react-router-dom';

const trainingTypes = [
  { type: 'squat', name: 'Приседания', url: '/1' },
  { type: 'pushUp', name: 'Отжимания', url: '/2' },
  { type: 'pullUp', name: 'Подтягивания', url: '/3' },
];

export const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {trainingTypes.map((v) => (
        <Link to={v.url} key={v.type}>
          <div style={{ width: 300, height: 200, border: '1px solid black' }}>
            {v.name}
          </div>
        </Link>
      ))}
    </div>
  );
};
