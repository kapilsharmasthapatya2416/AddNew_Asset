"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { BuildingIcon, Building2, CheckCircle2, Globe2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  MasterTable, 
  EditButton, 
  DeleteButton, 
  TableHeader, 
  useConfirm, 
  PageContainer, 
  SearchInput, 
  Select 
} from "@/components/common";
import type { Office, OfficeProps } from "@/types/office.types";
import { deleteOfficeAction } from "@/app/[locale]/configuration-settings/office-master/action";
import { getOfficeColumns } from "./OfficeColumns";
import { useOfficeSearch } from "@/hooks/useOfficeSearch";
import { useOfficePagination } from "@/hooks/useOfficePagination";

export function OfficeMaster({
  data, pageNumber, pageSize, totalCount, totalPages, sortBy, sortOrder, type, status
}: OfficeProps): React.ReactElement {
  const router = useRouter();
  const t = useTranslations("office");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { confirm } = useConfirm();

  const {
    currentSearchTerm,
    handleSearch
  } = useOfficeSearch();

  const {
    changePage,
    changePageSize,
    start,
    end
  } = useOfficePagination({
    totalCount,
    pageNumber,
    pageSize,
    sortBy,
    sortOrder,
    currentSearchTerm,
    type,
    status
  });

  const handleEdit = useCallback((row: Office) => {
    router.push(`/${locale}/configuration-settings/office-master/edit/${row.officeId}`);
  }, [router, locale]);

  const handleDelete = useCallback((row: Office) => {
    confirm({
      variant: "delete",
      title: `${t("table.columns.officeCode")}: ${row.officeCode}`,
      description: t("delete.confirmDescription"),
      meta: { name: row.officeName },
      onConfirm: async () => {
        const result = await deleteOfficeAction(row.officeId);
        if (result.success) {
          toast.success(t("success.deleted"));
          router.refresh();
        } else {
          toast.error(result.message || tCommon("errors.deleteError"));
        }
      },
    });
  }, [confirm, router, t, tCommon]);

  const columns = getOfficeColumns(t, handleEdit, handleDelete);

  const stats = [
    {
      label: t("stats.totalOffices"),
      value: totalCount,
      icon: BuildingIcon,
      bgColor: "bg-blue-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accentColor: "bg-blue-600"
    },
    {
      label: t("stats.headOffices"),
      value: data.filter(o => o.type === "Head Office").length,
      icon: Building2,
      bgColor: "bg-purple-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accentColor: "bg-purple-600"
    },
    {
      label: t("stats.activeOffices"),
      value: data.filter(o => o.isActive).length,
      icon: CheckCircle2,
      bgColor: "bg-green-500",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accentColor: "bg-green-600"
    },
    {
      label: t("stats.regionalOffices"),
      value: data.filter(o => o.type === "Regional Office").length,
      icon: Globe2,
      bgColor: "bg-orange-500",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      accentColor: "bg-orange-600"
    }
  ];

  return (
    <PageContainer
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <EditButton 
          label={t("actions.addOffice")}
          onClick={() => router.push(`/${locale}/configuration-settings/office-master/add`)} 
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="group overflow-hidden border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="relative flex items-center justify-between p-4">
                  <div className="z-10">
                    <p className="mb-1 text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`z-10 rounded-xl p-3 shadow-md transition-transform group-hover:scale-110 ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div
                    className={`absolute -bottom-6 -right-6 h-20 w-20 rounded-tl-full opacity-60 transition-all group-hover:h-24 group-hover:w-24 ${stat.bgColor}`}
                  />
                  <div className={`absolute left-0 top-0 h-full w-1.5 ${stat.accentColor}`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <TableHeader
          onSearch={handleSearch}
          searchValue={currentSearchTerm}
          searchPlaceholder={t("table.searchPlaceholder")}
          totalCount={totalCount}
        />

        <MasterTable<Office>
          columns={columns}
          data={data}
          loading={false}
          height="lg"
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={changePage}
          actionLabel={tCommon("table.columns.actions")}
          paginationConfig={{ enabled: true, showPageSizeSelector: false }}
          footerLeftContent={
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {tCommon("table.showing")} {start} {tCommon("table.to")} {end} {tCommon("table.of")} {totalCount}
              </span>
              <Select
                value={String(pageSize)}
                onChange={changePageSize}
                options={[10, 20, 30, 50].map((s) => ({
                  label: String(s),
                  value: String(s),
                }))}
                selectSize="sm"
                className="w-20"
              />
            </div>
          }
          getRowKey={(row) => String(row.officeId)}
        />
      </div>
    </PageContainer>
  );
}
