import { VitalsConfigured } from "./DefaultValuesConfig"


export interface AppConfiguration{
    listenTopic:string,
    kafkaListening:string,
    groupId:string
    defaultMessageValues:VitalsConfigured
    kafkaProducing:string,
    createTopic:string
}