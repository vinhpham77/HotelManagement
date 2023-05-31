export interface DialogConfirm {
    title: string;
    message: string;
    data: any;
    action: 'delete' | 'deleteMany';
}
