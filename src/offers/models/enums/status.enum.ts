export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export const StatusColor: Record<Status, string> = {
  [Status.PENDING]: 'bg-blue-era',
  [Status.ACCEPTED]: 'bg-success',
  [Status.REJECTED]: 'bg-danger'
}
