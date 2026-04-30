
import { PropertyTypeForm } from "@/components/modules/property-tax/property-type-master";
import { getPropertyTypeCategoriesAction, getTypeOfUseListAction } from "../action";
import React from "react";

export default async function AddPage(): Promise<React.ReactElement> {
  const [categories, typeOfUseList] = await Promise.all([
    getPropertyTypeCategoriesAction(),
    getTypeOfUseListAction(),
  ]);
  return <PropertyTypeForm id={null} initialData={undefined} categories={categories} typeOfUseList={typeOfUseList} initialTypeOfUseIds={[]} />;
}
