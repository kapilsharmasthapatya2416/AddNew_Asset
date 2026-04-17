"use client";

import {
  useCallback,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useLocale,
  useTranslations,
} from "next-intl";
import { toast } from "sonner";
import { Select } from "@/components/common/select";
import { PageContainer } from "@/components/common/PageContainer";
import { MasterTable } from "@/components/common/MasterTable";
import { useConfirm } from "@/components/common/ConfirmProvider";

import type {
  SubFloor,
  SubFloorPagedResponse,
} from "@/types/floor.types";

import { deleteSubFloorAction } from "@/app/[locale]/property-tax/floormaster/actions";
import { DeleteButton, EditButton } from "@/components/common";
import { subFloorColumns } from "./columns";

/* ============================================================
   PROPS
============================================================ */

interface Props {
  subFloorPaged: SubFloorPagedResponse;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function SubFloorPage({
  subFloorPaged,
}: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const t = useTranslations("floor.subfloor");
   

  const { confirm } = useConfirm();

  const {
    items: data,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
  } = subFloorPaged;

  /* ============================================================
     URL BUILDER
  ============================================================ */

  const buildUrl = useCallback(
    (page: number, size: number, query?: string) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(size));

      if (query?.trim()) {
        params.set("q", query.trim());
      }

      return `/${locale}/property-tax/floormaster/subfloor?${params.toString()}`;
    },
    [locale]
  );

  /* ============================================================
     PAGINATION
  ============================================================ */

  const currentSearchTerm = searchParams.get("q") ?? "";

  const changePage = useCallback(
    (page: number) => {
      router.push(
        buildUrl(page, pageSize, currentSearchTerm)
      );
    },
    [router, pageSize, currentSearchTerm, buildUrl]
  );

  const total = totalCount;

  /* ============================================================
     DELETE
  ============================================================ */

  const handleDelete = useCallback(
    (row: SubFloor) => {
      confirm({
        variant: "delete",
        title: t("delete.confirmTitle", {
          id: row.subFloorId,
        }),
        description: t("delete.confirmDescription"),
        meta: {
          id: row.subFloorId,
          name: row.description
        },
        onConfirm: async () => {
          const result = await deleteSubFloorAction(row.subFloorId);
          if (result.success) {
            toast.success(t("messages.deleteSuccess"));
            router.refresh();
          } else {
            toast.error(
              result.error || t("messages.deleteFailed")
            );
          }
        },
      });
    },
    [t, confirm, router]
  );

  /* ============================================================
     TABLE COLUMNS
  ============================================================ */

  const columns = subFloorColumns(t);

  /* ============================================================
     UI
  ============================================================ */

  return (
    <PageContainer>
      <MasterTable<SubFloor>
        columns={columns}
        data={data}
        loading={false}
        height="lg"
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}

        onPageChange={changePage}
        onPageSizeChange={(size) =>
          router.push(
            buildUrl(1, size, currentSearchTerm)
          )
        }

        paginationConfig={{
          enabled: true,
          showPageSizeSelector: false,
        }}

             footerLeftContent={
  <div className="flex items-center gap-1 ">
    {t('table.pagination.showing')}
    <Select
      options={[5, 10, 20, 50].map((s) => ({ label: String(s), value: String(s) }))}
      value={String(pageSize)}
      onChange={(val) => router.push(buildUrl(1, Number(val), currentSearchTerm))}
      selectSize="sm"
      className="min-w-[60px] border-blue-200"
      aria-label="Rows per page"
    />
    <span>{t('table.pagination.entries', { total })}</span>
  </div>
}

        renderActions={(row) => (
          <>
            <EditButton
              onClick={() =>
                router.push(
                  `/${locale}/property-tax/floormaster/subfloor/edit/${row.subFloorId}`
                )
              }
            />
            <DeleteButton
              onClick={() => handleDelete(row)}
            />
          </>
        )}

        getRowKey={(row) => row.subFloorId}
      />
    </PageContainer>
  );
}