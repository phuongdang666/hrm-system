declare function route(name: string, params?: any, absolute?: boolean): string;

interface Window {
    route: typeof route;
}

declare module '@/types/ziggy' {
    export type RouteFunction = typeof route;
}