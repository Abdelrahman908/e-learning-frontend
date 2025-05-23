import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="mb-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 rtl:space-x-reverse">
          <li>
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
              <span>الرئيسية</span>
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return (
              <li key={to}>
                <div className="flex items-center">
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                  {last ? (
                    <span className="text-gray-500">
                      {value.replace(/-/g, ' ')}
                    </span>
                  ) : (
                    <Link to={to} className="text-gray-400 hover:text-gray-500">
                      <span>{value.replace(/-/g, ' ')}</span>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;