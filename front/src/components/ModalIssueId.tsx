import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { Button, IconButton, Loader, Modal, Tag } from "rsuite";
import { useHookIssue } from "../hooks/useIssues/useIssues";
import { getPriorityColor, getStatusColor } from "../utils/utils";

export const ModalIssueId = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const { issue, isLoading } = useHookIssue(id);

  return (
    <>
      <IconButton
        appearance="subtle"
        size="xs"
        icon={<IoEye />}
        onClick={() => setOpen(true)}
        title="Ver detalles"
        className="hover:bg-gray-100 transition-colors"
      />

      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        size="sm"
        className="overflow-hidden"
      >
        <Modal.Header>
          <Modal.Title className="text-xl font-semibold text-gray-800">
            Detalles del Issue
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader size="md" />
            </div>
          ) : issue ? (
            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-2">
                  {issue.title}
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {issue.description}
                </p>
              </div>

              <div className="flex gap-2">
                <Tag color={getStatusColor(issue.status)} className="px-3 py-1">
                  {issue.status}
                </Tag>
                <Tag color={getPriorityColor(issue.priority)} className="px-3 py-1">
                  {issue.priority}
                </Tag>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium w-24">Asignado a:</span>
                  <span>{issue.assignedTo?.name || "Sin asignar"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Creado por:</span>
                  <span>{issue.createdBy?.name || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Creado:</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No se encontró información del issue
            </p>
          )}
        </Modal.Body>

        <Modal.Footer className="flex justify-end">
          <Button 
            onClick={() => setOpen(false)} 
            appearance="subtle"
            className="hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
