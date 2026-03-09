export interface DefaultMessagesConfig {
  respiratory_rate: number;
  spO2: number;
  heart_rate: number;
  body_temperature: number;
}

export const defaultMessage: DefaultMessagesConfig = {
  "respiratory_rate": -1,
  "spO2": -1,
  "heart_rate": -1,
  "body_temperature": -1
}