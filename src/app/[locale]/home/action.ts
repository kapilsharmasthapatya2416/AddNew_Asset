'use server';

/**
 * Server Actions for Home
 * These functions run on the server and can be called from client components
 */

import { Service, DashboardStats } from "@/types/home.types";

// In-memory data store (simulating a database)
const homeServices: Service[] = [
    {
        id: 1,
        name: "Property Tax",
        // Modified: Redirect to /property-tax/ptis
        link: "/property-tax/ptis",
        icon: "property-tax",
        title: "Property Tax",
        subtext:
            "Pay your property taxes online, view assessment details, and download receipts securely.",
        stats: [
            { label: "Total", value: "12,345" },
            { label: "Paid", value: "9,876" },
            { label: "Remaining", value: "2,469" },
        ],
    },
    {
        id: 2,
        name: "Water Tax",
        link: "/water-tax",
        icon: "water-tax",
        title: "Water Tax",
        subtext:
            "Manage water connection bills, track usage, and make payments for water services.",
        stats: [
            { label: "Total", value: "6,500" },
            { label: "Paid", value: "5,200" },
            { label: "Remaining", value: "1,300" },
        ],
    },
    {
        id: 3,
        name: "Bajar Parwana",
        link: "/bajar-parwana",
        icon: "bajar-parwana",
        title: "Bajar Parwana",
        subtext:
            "Apply for market permits, renew licenses, and manage your commercial establishment permissions.",
        stats: [
            { label: "Total", value: "1,200" },
            { label: "Paid", value: "800" },
            { label: "Remaining", value: "400" },
        ],
    },
    {
        id: 4,
        name: "Birth & Death Certificates",
        link: "/birth-death-certificates",
        icon: "birth-death",
        title: "Birth & Death Certificates",
        subtext:
            "Apply for and download birth and death certificates with secure verification.",
        stats: [
            { label: "Total", value: "4,000" },
            { label: "Paid", value: "3,200" },
            { label: "Remaining", value: "800" },
        ],
    },
    {
        id: 5,
        name: "Garbage Collection",
        link: "/garbage-collection",
        icon: "garbage-collection",
        title: "Garbage Collection",
        subtext:
            "Schedule waste pickup, report missed collections, and track garbage collection services.",
        stats: [
            { label: "Total", value: "3,500" },
            { label: "Paid", value: "3,100" },
            { label: "Remaining", value: "400" },
        ],
    },
    {
        id: 6,
        name: "Building Permission",
        link: "/building-permission",
        icon: "building-permission",
        title: "Building Permission",
        subtext:
            "Submit building plans, track approval status, and obtain construction permits online.",
        stats: [
            { label: "Total", value: "1,800" },
            { label: "Paid", value: "1,400" },
            { label: "Remaining", value: "400" },
        ],
    },
    {
        id: 7,
        name: "Grievance Redressal",
        link: "/grievance",
        icon: "grievance",
        title: "Grievance Redressal",
        subtext:
            "File complaints, track resolution status, and provide feedback on municipal services.",
        stats: [
            { label: "Total", value: "900" },
            { label: "Paid", value: "650" },
            { label: "Remaining", value: "250" },
        ],
    },
    {
        id: 8,
        name: "RTS (Right to Services)",
        link: "/rts",
        icon: "rts",
        title: "RTS (Right to Services)",
        subtext:
            "Access guaranteed time-bound services and track application progress under RTS Act.",
        stats: [
            { label: "Total", value: "2,200" },
            { label: "Paid", value: "1,900" },
            { label: "Remaining", value: "300" },
        ],
    },
    {
        id: 9,
        name: "Municipal Assets",
        link: "/assets",
        icon: "assets",
        title: "Municipal Assets",
        subtext:
            "View public assets, infrastructure details, and upcoming development projects.",
        stats: [
            { label: "Total", value: "5,500" },
            { label: "Paid", value: "4,800" },
            { label: "Remaining", value: "700" },
        ],
    },
];

/**
 * Fetches home services data (Server-side)
 */
export async function listServices(): Promise<Service[]> {
    return homeServices;
}

/**
 * Fetches dashboard statistics (Server-side)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    return {
        totalUsers: 12345,
        activeProperties: 678,
        totalRevenue: 987654,
    };
}
