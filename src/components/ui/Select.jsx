// src/components/ui/Select.jsx
import React from "react";

const Select = React.forwardRef(({ options = [], className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`border rounded px-3 py-2 text-sm ${className}`}
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";

export default Select;
