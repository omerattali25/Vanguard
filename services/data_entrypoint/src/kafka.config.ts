import { Transport } from "@nestjs/microservices"
import { AppConfiguration } from "./config_types/AppConfiguration";
import configuration from "./app.config.json"


const config:AppConfiguration = configuration;

export const kafkaConfig:KafkaOptions  =  {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.kafkaListening],
      },
    },
  }