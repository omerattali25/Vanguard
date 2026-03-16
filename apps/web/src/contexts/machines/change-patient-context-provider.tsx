import { ReactNode, useState } from "react";
import { ChangePatientContext } from "./change-patient-context";

interface ILockIdContextProvider {
  children: ReactNode;
}

export const ChangePatientContextProvider: React.FC<ILockIdContextProvider> = ({ children }) => {
  const [lockId, setLockId] = useState("");
  const [machineId,setMachineId]=useState("")

  const changePatientContext = {
    lockId:lockId,
    machineId:machineId,
    changeLockId: (newLockId: string) => setLockId(newLockId),
    changeMachineId:(newMachineId:string)=>setMachineId(newMachineId)
  };

  return (
    <ChangePatientContext.Provider value={changePatientContext}>
      {children}
    </ChangePatientContext.Provider>
  );
};
