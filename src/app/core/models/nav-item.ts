export interface NavItem {
    label: string;
    route: string;
    requiresAuth?: boolean;
    roles?: string[];
}