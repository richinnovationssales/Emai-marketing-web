export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export const RequestStatusLabels: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.APPROVED]: 'Approved',
    [RequestStatus.REJECTED]: 'Rejected',
};

export const RequestStatusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-500',
    [RequestStatus.APPROVED]: 'bg-green-500',
    [RequestStatus.REJECTED]: 'bg-red-500',
};
