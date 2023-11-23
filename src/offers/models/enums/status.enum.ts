export enum Status {
  PENDING = 'pendiente',
  ACCEPTED = 'aceptado',
  REJECTED = 'rechazado'
}

export const StatusColor: Record<Status, string> = {
  [Status.PENDING]: 'bg-blue-era',
  [Status.ACCEPTED]: 'bg-success',
  [Status.REJECTED]: 'bg-danger'
}
