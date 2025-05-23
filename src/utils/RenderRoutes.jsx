// src/utils/RenderRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const RenderRoutes = ({ routes }) => {
  return (
    <Routes>
      {routes.map(({ path, element, children, index }, i) => (
        <Route key={i} path={path} element={element} index={index}>
          {children && children.length > 0 && children.map((child, idx) => (
            <Route
              key={idx}
              path={child.path}
              element={child.element}
              index={child.index}
            >
              {child.children && child.children.length > 0 &&
                child.children.map((subChild, subIdx) => (
                  <Route
                    key={subIdx}
                    path={subChild.path}
                    element={subChild.element}
                    index={subChild.index}
                  />
                ))}
            </Route>
          ))}
        </Route>
      ))}
    </Routes>
  );
};

export default RenderRoutes;
