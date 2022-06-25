import { Link } from 'react-router-dom';

const trainingTypes = [
  { type: 'squat', name: 'Приседания' },
  { type: 'pushUp', name: 'Отжимания' },
  { type: 'pullUp', name: 'Подтягивания' },
];

export const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {trainingTypes.map(({ type, name }) => (
        <Link to={type} key={type}>
          <div style={{ width: 300, height: 200, border: '1px solid black' }}>
            {name}
          </div>
        </Link>
      ))}
    </div>
  );
};
