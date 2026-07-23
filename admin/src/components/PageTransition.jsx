import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(k => k + 1);
  }, [location.pathname]);

  return (
    <div key={key} className="page-transition page-transition--in">
      {children}
    </div>
  );
}
