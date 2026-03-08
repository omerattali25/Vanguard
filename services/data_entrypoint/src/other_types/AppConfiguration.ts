import { VitalsConfigured } from 'src/inputs/vitals.input';

export interface AppConfiguration{
    listenTopic:string,
    kafkaListening:string,
    groupId:string
    defaultMessageValues:VitalsConfigured
    kafkaProducing:string,
    createTopic:string
}