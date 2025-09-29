import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { Button, Form, Modal, SelectPicker } from "rsuite";
import { useUser } from "../hooks/useUsers/useUser";
import { useMutationIssues } from "../hooks/useIssues/useIssues";
import { Priority, Status } from "../types/enums/enums";
import type { IReqIssue } from "../hooks/useIssues/IReqIssues";



export const ModalCreateIssue = () => {
  const [open, setOpen] = useState(false);
  const { data: users } = useUser();
  const { mutationPostIssues } = useMutationIssues();
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState<IReqIssue>({
    title: "",
    description: "",
    status: Status.OPEN,
    priority: Priority.MEDIUM,
    assignedTo: "",
    createdBy: "",
  });
  
  // Validar formulario cuando cambian los datos
  useEffect(() => {
    const { title, description, createdBy } = formData;
    setIsFormValid(!!title && !!description && !!createdBy);
  }, [formData]);

  const handleSubmit = () => {
    mutationPostIssues.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
       
        setFormData({
          title: "",
          description: "",
          status: Status.OPEN,
          priority: Priority.MEDIUM,
          assignedTo: "",
          createdBy: "",
        });
      },
    });
  };

  const userOptions = users?.map((user) => ({
    label: user.name,
    value: user._id,
  })) || [];

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

  return (
    <>
      <Button
        appearance="primary"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <IoAdd className="text-lg" />
        Crear Issue
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        className="overflow-hidden"
      >
        <Modal.Header>
          <Modal.Title className="text-xl font-semibold text-gray-800">
            Crear Nuevo Issue
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form fluid className="space-y-4">
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-gray-700">
                Título
              </Form.ControlLabel>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                className="text-sm"
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-gray-700">
                Descripción
              </Form.ControlLabel>
              <Form.Control
                name="description"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                rows={3}
                className="text-sm"
                componentClass="textarea"
              />
            </Form.Group>

            <div className="grid grid-cols-2 gap-4">
              <Form.Group>
                <Form.ControlLabel className="text-sm font-medium text-gray-700">
                  Estado
                </Form.ControlLabel>
                <SelectPicker
                  value={formData.status}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as typeof Status.OPEN,
                    }))
                  }
                  data={statusOptions}
                  cleanable={false}
                  searchable={false}
                  block
                  size="sm"
                  className="text-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel className="text-sm font-medium text-gray-700">
                  Prioridad
                </Form.ControlLabel>
                <SelectPicker
                  value={formData.priority}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as typeof Priority.MEDIUM,
                    }))
                  }
                  data={priorityOptions}
                  cleanable={false}
                  searchable={false}
                  block
                  size="sm"
                  className="text-sm"
                />
              </Form.Group>
            </div>

            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-gray-700">
                Asignar a
              </Form.ControlLabel>
              <SelectPicker
                value={formData.assignedTo}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, assignedTo: value || "" }))
                }
                data={userOptions}
                placeholder="Seleccionar usuario"
                cleanable
                searchable={false}
                block
                size="sm"
                className="text-sm"
              />
            </Form.Group>
           
            <Form.Group>
              <Form.ControlLabel className="text-sm font-medium text-gray-700">
                Creado por
              </Form.ControlLabel>
              <SelectPicker
                value={formData.createdBy}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, createdBy: value || "" }))
                }
                data={userOptions}
                placeholder="Seleccionar usuario"
                cleanable
                searchable={false}
                block
                size="sm"
                className="text-sm"
              />
            </Form.Group>
            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              appearance="subtle"
              onClick={() => setOpen(false)}
              className="text-sm"
            >
              Cancelar
            </Button>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              loading={mutationPostIssues.isPending}
              disabled={!isFormValid}
              className="text-sm"
            >
              Crear Issue
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};