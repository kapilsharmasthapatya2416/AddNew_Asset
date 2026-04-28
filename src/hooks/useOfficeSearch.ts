"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchNavigation } from "@/hooks/useSearchNavigation";
import { TEXT_SANITIZE } from "@/lib/utils/validation";

interface UseOfficeSearchProps {
  pageSize: number;
  locale: string;
  sortBy?: string;
  sortOrder?: string;
  startTransition: (callback: () => void) => void;
  type?: string;
  status?: string;
}

export function useOfficeSearch({
  pageSize,
  locale,
  sortBy,
  sortOrder,
  startTransition,
  type,
  status,
}: UseOfficeSearchProps) {
  const searchParams = useSearchParams();
  const currentSearchTerm = searchParams.get("q") || "";
  const [search, setSearch] = useState(currentSearchTerm);
  const [selectedType, setSelectedType] = useState(type || "");
  const [selectedStatus, setSelectedStatus] = useState(status || "");

  // Sync search state with URL on mount/navigation
  useEffect(() => {
    setSearch(currentSearchTerm);
  }, [currentSearchTerm]);

  useEffect(() => {
    setSelectedType(type || "");
  }, [type]);

  useEffect(() => {
    setSelectedStatus(status || "");
  }, [status]);

  // Debounced search navigation
  useSearchNavigation({
    search,
    currentSearchTerm,
    pageSize,
    locale,
    sortBy,
    sortOrder,
    basePath: "/configuration-settings/office-master",
    startTransition,
    extraParams: {
      type: selectedType,
      status: selectedStatus,
    },
  });

  const handleSearchChange = (value: string) => {
    // Sanitize search input to prevent special characters
    const sanitized = value.replace(TEXT_SANITIZE, "");
    setSearch(sanitized);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  return {
    search,
    currentSearchTerm,
    handleSearchChange,
    selectedType,
    handleTypeChange,
    selectedStatus,
    handleStatusChange,
  };
}
