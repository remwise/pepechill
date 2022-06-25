import { Outlet } from 'react-router-dom';
import { useData } from '../context/useData';

export const ContentTemplate = () => {
  const { logout } = useData();

  return (
    <div>
      <input type="button" value="ВЫХОД" onClick={logout} />
      <Outlet />
    </div>
  );
};
