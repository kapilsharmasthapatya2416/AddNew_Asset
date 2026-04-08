import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function Page() {
    const locale = "en";
    const propertyId = 550726;
    const wardNo = "";
    const propertyNo = "";
    const partitionNo = "";

    const queryString = new URLSearchParams({
        propertyId: String(propertyId),
        wardNo,
        propertyNo,
        partitionNo,
    }).toString();

    return (
        <div className="p-4">
            <Link
                href={`/${locale}/property-tax/ptis/QuickDataEntry/${propertyId}/Property?${queryString}`}
                className="flex w-[20%] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2">
                <Pencil className="h-4 w-4 text-white" />
                <span className="rounded-lg bg-white px-2 py-2 text-black">
                    Edit
                </span>
            </Link>
        </div>
    );
}