import React from 'react';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border rounded px-3 py-2 text-sm ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
