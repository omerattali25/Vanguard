export type Timeframe = {
  start: string;
  end: string;
}
export const TIMEFRAMES : Timeframe[] = [
  { start: '07:00', end: '10:00' },
  { start: '10:00', end: '15:00' },
  { start: '15:00', end: '20:00' },
  { start: '20:00', end: '00:00'},
  { start: '00:00', end: '07:00'},
];

export const TTL_DAYS = 7; // Redis TTL
