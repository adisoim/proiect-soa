
    export type RemoteKeys = 'auth/Login' | 'auth/Register';
    type PackageType<T> = T extends 'auth/Register' ? typeof import('auth/Register') :T extends 'auth/Login' ? typeof import('auth/Login') :any;