import { useState } from "react";
import { VscClose, VscEdit, VscRemove, VscSave } from "react-icons/vsc";
import {  IconButton, Input, SelectPicker, Table, Tag } from "rsuite";
import {
  useHookIssues,
  type EditableIssue,
  type User,
} from "../hooks/useIssues/useIssues";
import { useUser } from "../hooks/useUsers/useUser";
import { Priority, Status } from "../types/enums/enums";
import { ModalIssueId } from './ModalIssueId';
import PaginationComponent from './Pagination';
import { FilterIssues } from './FilterIssues';
import type { IssueFilters } from '../hooks/useIssues/IReqIssues';


const { Column, HeaderCell, Cell } = Table;

const statusOptions = [
  { label: "Abierto", value: Status.OPEN },
  { label: "En Progreso", value: Status.IN_PROGRESS },
  { label: "Cerrado", value: Status.CLOSED },
];

const priorityOptions = [
  { label: "Baja", value: Priority.LOW },
  { label: "Media", value: Priority.MEDIUM },
  { label: "Alta", value: Priority.HIGH },
];

export default function TableIssues() {
  const { data: usersData } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<IssueFilters>({});
  const {data,handleChange,handleEdit,handleCancel,handleSave,handleRemove,handleView,pagination,refetch,} = useHookIssues(currentPage, activeFilters);
  console.log("Data aaaaaaaaaaaaa" , data)
  const users =
    usersData?.map((user) => ({
      label: user.name,
      value: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
    })) || [];

 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = (filters: IssueFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1); 
    refetch();
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mx-5 mb-4">
        <FilterIssues
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          users={users}
        />
      
      </div>

      <div>
        <Table className="mx-5 rounded-xl" height={300} data={data} rowKey="_id">
          {/* Columna ID */}
          <Column width={80} fixed>
            <HeaderCell>ID</HeaderCell>
            <Cell>
              {(rowData: EditableIssue) => (
                <span style={{ fontSize: "12px", color: "#666" }}>
                  {rowData._id.slice(-6)}
                </span>
              )}
            </Cell>
          </Column>

          {/* Columna Título - Editable */}
          <Column flexGrow={1} minWidth={200}>
            <HeaderCell>Título</HeaderCell>
            <EditableCell
              dataKey="title"
              dataType="string"
              onChange={handleChange}
              renderDisplay={(value) => (
                <span className="text-truncate" title={String(value || "")}>
                  {String(value || "")}
                </span>
              )}
            />
          </Column>

          {/* Columna Descripción - Editable */}
          <Column width={250}>
            <HeaderCell>Descripción</HeaderCell>
            <EditableCell
              dataKey="description"
              dataType="string"
              onChange={handleChange}
              renderDisplay={(value) => (
                <span className="text-truncate" title={String(value || "")}>
                  {String(value || "")}
                </span>
              )}
            />
          </Column>

          {/* Columna Status - Editable con Dropdown */}
          <Column width={130}>
            <HeaderCell>Estado</HeaderCell>
            <EditableCell
              dataKey="status"
              dataType="select"
              options={statusOptions}
              onChange={handleChange}
              renderDisplay={(value) => (
                <Tag className="status-tag">
                  {statusOptions.find((opt) => opt.value === value)?.label ||
                    value}
                </Tag>
              )}
            />
          </Column>

          {/* Columna Priority - Editable con Dropdown */}
          <Column width={120}>
            <HeaderCell>Prioridad</HeaderCell>
            <EditableCell
              dataKey="priority"
              dataType="select"
              options={priorityOptions}
              onChange={handleChange}
              renderDisplay={(value) => (
                <Tag className="priority-tag">
                  {priorityOptions.find((opt) => opt.value === value)?.label ||
                    value}
                </Tag>
              )}
            />
          </Column>

          {/* Columna Asignado a - Editable con Dropdown */}
          <Column width={150}>
            <HeaderCell>Asignado a</HeaderCell>
            <EditableCell
              dataKey="assignedTo"
              dataType="select"
              options={users}
              onChange={handleChange}
              renderDisplay={(value) => (
                <span>{value?.name || "Sin asignar"}</span>
              )}
            />
          </Column>

          {/* Columna Creado por - Solo lectura */}
          <Column width={130}>
            <HeaderCell>Creado por</HeaderCell>
            <Cell>
              {(rowData: EditableIssue) => (
                <span>{rowData.createdBy?.name || "N/A"}</span>
              )}
            </Cell>
          </Column>

          {/* Columna Fecha de creación - Solo lectura */}
          <Column width={120}>
            <HeaderCell>Fecha creación</HeaderCell>
            <Cell>
              {(rowData: EditableIssue) => (
                <span style={{ fontSize: "12px" }}>
                  {new Date(rowData.createdAt).toLocaleDateString()}
                </span>
              )}
            </Cell>
          </Column>

          {/* Columna Acciones */}
          <Column width={120} fixed="right">
            <HeaderCell>Acciones</HeaderCell>
            <ActionCell
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onRemove={handleRemove}
              onView={handleView}
            />
          </Column>
        </Table>

        {/* Componente de Paginación */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {pagination && (
            <PaginationComponent
              {...pagination}
              onChangePage={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const EditableCell = ({
  dataType,
  dataKey,
  options = [],
  onChange,
  renderDisplay,
  ...props
}: {
  dataType: "string" | "select";
  dataKey: keyof EditableIssue;
  options?: Array<{
    label: string;
    value: any;
    _id?: string;
    name?: string;
    email?: string;
  }>;
  onChange?: (id: string, key: keyof EditableIssue, value: any) => void;
  renderDisplay?: (value: any) => React.ReactNode;
}) => {
  return (
    <Cell {...props}>
      {(rowData: EditableIssue) => {
        const editing = rowData.isEditing;
        const value = rowData[dataKey];

        return (
          <div className={editing ? "table-cell-editing" : ""}>
            {editing ? (
              dataType === "select" ? (
                <SelectPicker
                  data={options}
                  value={
                    dataType === "select" && dataKey === "assignedTo"
                      ? (value as User)?._id
                      : value
                  }
                  onChange={(selectedValue) => {
                    if (dataKey === "assignedTo") {
                      const selectedUser = options.find(
                        (user) => user.value === selectedValue
                      );
                      onChange?.(
                        rowData._id,
                        dataKey,
                        selectedUser
                          ? {
                              _id: selectedUser._id,
                              name: selectedUser.name,
                              email: selectedUser.email,
                            }
                          : null
                      );
                    } else {
                      onChange?.(rowData._id, dataKey, selectedValue);
                    }
                  }}
                  placeholder="Seleccionar..."
                  cleanable={dataKey === "assignedTo"}
                  searchable={false}
                  style={{ width: "100%" }}
                />
              ) : (
                <Input
                  defaultValue={value as string}
                  onChange={(inputValue) => {
                    onChange?.(rowData._id, dataKey, inputValue);
                  }}
                  placeholder={`Ingrese ${dataKey}...`}
                />
              )
            ) : renderDisplay ? (
              renderDisplay(value)
            ) : (
              <span>{String(value || "")}</span>
            )}
          </div>
        );
      }}
    </Cell>
  );
};

const ActionCell = ({
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onView,
  ...props
}: {
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  onView: (id: string) => void;
}) => {
  return (
    <Cell
      {...props}
      style={{
        padding: "6px",
        display: "flex",
        gap: "4px",
        justifyContent: "center",
      }}
    >
      {(rowData: EditableIssue) => {
        const isEditing = rowData.isEditing;

        return (
          <>
            {isEditing ? (
              <>
                <IconButton
                  appearance="primary"
                  size="xs"
                  icon={<VscSave />}
                  onClick={() => onSave(rowData._id)}
                  title="Guardar cambios"
                />
                <IconButton
                  appearance="subtle"
                  size="xs"
                  icon={<VscClose />}
                  onClick={() => onCancel(rowData._id)}
                  title="Cancelar edición"
                />
              </>
            ) : (
              <>
                <IconButton
                  appearance="subtle"
                  size="xs"
                  icon={<VscEdit />}
                  onClick={() => onEdit(rowData._id)}
                  title="Editar"
                />
                <ModalIssueId id={rowData._id} />
                <IconButton
                  appearance="subtle"
                  size="xs"
                  color="red"
                  icon={<VscRemove />}
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Estás seguro de que quieres eliminar este issue?"
                      )
                    ) {
                      onRemove(rowData._id);
                    }
                  }}
                  title="Eliminar"
                />
              </>
            )}
          </>
        );
      }}
    </Cell>
  );
};
