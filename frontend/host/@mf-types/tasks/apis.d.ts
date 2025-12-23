
    export type RemoteKeys = 'tasks/TaskManager';
    type PackageType<T> = T extends 'tasks/TaskManager' ? typeof import('tasks/TaskManager') :any;