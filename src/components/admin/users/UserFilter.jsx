import React, { useState } from 'react';
import { Button, Input, Select } from '../../ui';
import { Search, Filter, X } from 'lucide-react';

const UserFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: '',
    role: ''
  });

  const roles = [
    { value: '', label: 'جميع الأدوار' },
    { value: 'Admin', label: 'مدير' },
    { value: 'Instructor', label: 'مدرس' },
    { value: 'Student', label: 'طالب' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      role: ''
    });
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="بحث بالاسم"
            icon={<Search size={18} />}
          />
        </div>
        
        <div>
          <Select
            name="role"
            value={filters.role}
            onChange={handleChange}
            options={roles}
            icon={<Filter size={18} />}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            تطبيق الفلتر
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleReset}
            icon={<X size={18} />}
          >
            إعادة تعيين
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserFilter;