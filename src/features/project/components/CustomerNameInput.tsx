import TextField from "../../../components/ui/TextField";
import { useProjectStore } from "../../../store/projectStore";

export default function CustomerNameInput() {
  const project = useProjectStore((state) => state.project);
  const updateProject = useProjectStore((state) => state.updateProject);

  return (
    <TextField
      label="Kundenname"
      value={project.customer.name}
      placeholder="Max Mustermann"
      onChange={(value) =>
        updateProject((currentProject) => ({
          ...currentProject,
          customer: {
            ...currentProject.customer,
            name: value,
          },
        }))
      }
    />
  );
}