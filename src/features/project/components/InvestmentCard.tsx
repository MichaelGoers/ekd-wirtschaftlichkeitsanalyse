import Card from "../../../components/ui/Card";
import NumberField from "../../../components/ui/NumberField";
import { useProjectStore } from "../../../store/projectStore";

export default function InvestmentCard() {
  const project = useProjectStore((state) => state.project);
  const updateProject = useProjectStore((state) => state.updateProject);

  return (
    <Card title="Investition">
      <NumberField
        label="Wärmepumpenlösung"
        value={project.investment.heatPump}
        suffix="€"
        onChange={(value) =>
          updateProject((current) => ({
            ...current,
            investment: {
              ...current.investment,
              heatPump: value,
            },
          }))
        }
      />

      <NumberField
        label="KfW-Förderung"
        value={project.investment.kfwFunding}
        suffix="€"
        onChange={(value) =>
          updateProject((current) => ({
            ...current,
            investment: {
              ...current.investment,
              kfwFunding: value,
            },
          }))
        }
      />

      <NumberField
        label="Photovoltaiklösung"
        value={project.investment.photovoltaic}
        suffix="€"
        onChange={(value) =>
          updateProject((current) => ({
            ...current,
            investment: {
              ...current.investment,
              photovoltaic: value,
            },
          }))
        }
      />
    </Card>
  );
}