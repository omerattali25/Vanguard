import { VitalsConfigured } from "./DefaultValuesConfig"


export interface AppConfiguration{
    listenTopic:string,
    kafkaListening:string,
    groupId:string
    kafkaProducing:string,
    createTopic:string
}