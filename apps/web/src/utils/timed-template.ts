export function isActiveRightNow(startTime: number, endTime: number): boolean {
  const now = new Date();
  return now.getTime() >= startTime && now.getTime() <= endTime;
}

export function isIncoming(startTime: number): boolean {
  const now = new Date();
  return startTime > now.getTime();
}

export function isPast(endTime: number): boolean {
  const now = new Date();
  return endTime < now.getTime();
}