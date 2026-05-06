export interface Stat {
    label: string;
    value: string;
}

export interface Service {
    id: number;
    name?: string;
    link: string;
    icon: string;
    title: string;
    subtext: string;
    stats?: Stat[];
    description?: string;
    [key: string]: any;
}

export interface DashboardStats {
    totalUsers: number;
    activeProperties: number;
    totalRevenue: number;
    [key: string]: any;
}

export interface ServiceCardProps extends Omit<Service, 'id'> { }
