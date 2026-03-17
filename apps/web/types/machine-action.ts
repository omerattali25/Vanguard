export enum MachineActionType {
    CONNECTED = 'חיבור',
    DISSCONNECET = 'ניתוק',
}

export interface MachineAction {
    id: string;
    machine_id: string;
    machine_name: string;
    patient_id: string;
    description: string
    trigerd_at: Date;
    action_type: MachineActionType
}