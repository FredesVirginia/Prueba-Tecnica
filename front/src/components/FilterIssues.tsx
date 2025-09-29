import { useState } from 'react';
import { FaSearch, FaTimes } from "react-icons/fa";
import { VscClearAll, VscFilter } from "react-icons/vsc";
import { SelectPicker } from 'rsuite';
import { type IssueFilters } from "../hooks/useIssues/IReqIssues";
import { ModalCreateIssue } from './ModalCreateIssue';

interface FilterIssuesProps {
  onApplyFilters: (filters: IssueFilters) => void;
  onClearFilters: () => void;
  users: Array<{
    label: string;
    value: string;
    _id: string;
    name: string;
    email: string;
  }>;
}

export const FilterIssues = ({ onApplyFilters, onClearFilters, users }: FilterIssuesProps) => {
  const [filters, setFilters] = useState<IssueFilters>({
    status: '',
    priority: '',
    assignedTo: '',
    createdBy: '',
    title: '',
    description: ''
  });

  const handleInputChange = (field: keyof IssueFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
    
    // Si se está borrando el campo de título (value está vacío), aplicar los filtros actualizados
    if (field === 'title' && !value) {
      setTimeout(() => {
        onApplyFilters({});
      }, 0);
    }
  };

  const handleApplyFilters = () => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key as keyof IssueFilters] = value;
      }
      return acc;
    }, {} as IssueFilters);
    
    onApplyFilters(cleanFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignedTo: '',
      createdBy: '',
      title: '',
      description: ''
    });
    onClearFilters();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="bg-white w-full p-3 rounded-lg shadow-sm my-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={filters.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 pl-10 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {filters.title && (
              <button
                onClick={() => {
                  handleInputChange('title', '');
                  onApplyFilters({});
                }}
                className="mr-1 p-1 hover:bg-gray-100 rounded-full"
                title="Borrar búsqueda"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <button
              onClick={handleApplyFilters}
              className="p-1 rounded text-white flex items-center justify-center"
              title="Buscar"
            >
              <FaSearch className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1">
            Estado
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">Todos</option>
            <option value="open">Abierto</option>
            <option value="in_progress">En Progreso</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1">
            Prioridad
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">Todas</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1">
            Asignado a
          </label>
          <SelectPicker
            data={users}
            value={filters.assignedTo || ''}
            onChange={(value) => handleInputChange('assignedTo', value || '')}
            placeholder="Seleccionar"
            cleanable
            block
            size="sm"
            className="text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1">
            Creado por
          </label>
          <SelectPicker
            data={users}
            value={filters.createdBy || ''}
            onChange={(value) => handleInputChange('createdBy', value || '')}
            placeholder="Seleccionar"
            cleanable
            block
            size="sm"
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between gap-2 mt-3">
      <ModalCreateIssue/>  
      <div>
          <button
          onClick={handleClearFilters}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Limpiar filtros"
        >
          <VscClearAll className="w-5 h-5" />
        </button>
        <button
          onClick={handleApplyFilters}
          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          title="Aplicar filtros"
        >
          <VscFilter className="w-5 h-5" />
        </button>
      </div>
         
      </div>
    </div>
  );
};

