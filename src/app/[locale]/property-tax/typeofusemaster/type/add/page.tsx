import UseTypeForm from "@/components/modules/property-tax/typeofusemaster/UseTypeForm";
import { getTypeOfUseMasterData } from "../../actions";

export default async function AddTypePage() {
  // Fetch groups and types for dropdown and duplicate checking
  const masterData = await getTypeOfUseMasterData();
  
  return (
    <>
      <UseTypeForm 
        id={null}
        allGroups={masterData.groups || []}
        allTypes={masterData.types || []}
      />
    </>
  );
}
