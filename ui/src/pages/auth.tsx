import { useCallback, useState } from 'react';
import { useData } from '../context/useData';

export const Auth = () => {
  const { loadUser } = useData();
  const [text, setText] = useState('');

  const onChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      loadUser(text);
    },
    [loadUser, text],
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input placeholder="Введите логин" value={text} onChange={onChange} />
        <input type="submit" value="ВОЙТИ" />
      </form>
    </div>
  );
};
