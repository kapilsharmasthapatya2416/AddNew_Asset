"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  AddButton,
  Badge,
  Button,
  Card,
  CardContent,
  DeleteButton,
  Drawer,
  EditButton,
  Input,
  MasterTable,
  PageContainer,
  Select,
  TableHeader,
  UploadButton,
  useConfirm,
} from "@/components/common";
import type { Column, Option } from "@/components/common";
import {
  Armchair,
  Car,
  Cpu,
  FileText,
  LampDesk,
  Package2,
  Receipt,
  X,
} from "lucide-react";

type InventoryType =
  | "furniture"
  | "it-equipment"
  | "electronic-fixtures"
  | "vehicle";

type InventoryInvoice = {
  invoiceMode: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceFileName: string;
};

type InventoryRow = {
  id: number;
  type: InventoryType;
  photoUrl?: string;
  photoName?: string;
  itemName: string;
  modelName: string;
  specifications: string;
  purchaseDate: string;
  condition: string;
  quantity: number;
  unitValue: number;
  total: number;
  invoice?: InventoryInvoice | null;
};

type InventoryTableRow = InventoryRow & { srNo: number };

type InventoryForm = {
  type: InventoryType;
  itemName: string;
  modelName: string;
  specifications: string;
  purchaseDate: string;
  condition: string;
  quantity: string;
  unitValue: string;
  photoName: string;
  photoUrl: string;
};

type InvoiceForm = {
  invoiceMode: string;
  existingInvoiceKey: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceFileName: string;
};

type TypeMeta = {
  label: string;
  icon: React.ElementType;
  cardRing: string;
  badgeClassName: string;
  names: Option[];
  modelMap: Record<string, Option[]>;
};

const PAGE_SIZE = 8;

const typeOptions: Option[] = [
  { label: "Furniture", value: "furniture" },
  { label: "IT Equipment", value: "it-equipment" },
  { label: "Electronic Fixtures", value: "electronic-fixtures" },
  { label: "Vehicle", value: "vehicle" },
];

const conditionMap: Record<InventoryType, Option[]> = {
  furniture: [
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ],
  "it-equipment": [
    { label: "Working", value: "Working" },
    { label: "Not Working", value: "Not Working" },
  ],
  "electronic-fixtures": [
    { label: "Working", value: "Working" },
    { label: "Not Working", value: "Not Working" },
  ],
  vehicle: [
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ],
};

const invoiceModeOptions: Option[] = [
  { label: "Upload New Invoice", value: "upload" },
  { label: "Use Existing Invoice", value: "reuse" },
];

const inventoryMeta: Record<InventoryType, TypeMeta> = {
  furniture: {
    label: "Furniture",
    icon: Armchair,
    cardRing: "border-l-4 border-l-violet-500",
    badgeClassName: "bg-violet-50 text-violet-700 border-violet-200",
    names: [
      { label: "Office Tables", value: "Office Tables" },
      { label: "Chairs (Executive)", value: "Chairs (Executive)" },
      { label: "Chairs (Staff)", value: "Chairs (Staff)" },
      { label: "Filing Cabinets", value: "Filing Cabinets" },
      { label: "Reception Desk", value: "Reception Desk" },
    ],
    modelMap: {
      "Office Tables": [
        { label: "Wooden", value: "Wooden" },
        { label: "Steel", value: "Steel" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Chairs (Executive)": [
        { label: "Ergonomic", value: "Ergonomic" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Chairs (Staff)": [
        { label: "Mesh Back", value: "Mesh Back" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Filing Cabinets": [
        { label: "4-Drawer Steel", value: "4-Drawer Steel" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Reception Desk": [
        { label: "Modular", value: "Modular" },
        { label: "Laminated", value: "Laminated" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  "it-equipment": {
    label: "IT Equipment",
    icon: Cpu,
    cardRing: "border-l-4 border-l-blue-500",
    badgeClassName: "bg-blue-50 text-blue-700 border-blue-200",
    names: [
      { label: "Desktop Computers", value: "Desktop Computers" },
      { label: "Laptops", value: "Laptops" },
      { label: "Printers", value: "Printers" },
      { label: "Scanners", value: "Scanners" },
      { label: "UPS Systems", value: "UPS Systems" },
      { label: "Biometric Devices", value: "Biometric Devices" },
      { label: "CCTV Systems", value: "CCTV Systems" },
    ],
    modelMap: {
      "Desktop Computers": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Laptops: [
        { label: "Lenovo ThinkPad", value: "Lenovo ThinkPad" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Printers: [
        { label: "HP LaserJet", value: "HP LaserJet" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Scanners: [
        { label: "Canon CanoScan", value: "Canon CanoScan" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "UPS Systems": [
        { label: "APC Back-UPS", value: "APC Back-UPS" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Biometric Devices": [
        { label: "ZKTeco MB360", value: "ZKTeco MB360" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "CCTV Systems": [
        { label: "Hikvision DS Series", value: "Hikvision DS Series" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  "electronic-fixtures": {
    label: "Electronic Fixtures",
    icon: LampDesk,
    cardRing: "border-l-4 border-l-emerald-500",
    badgeClassName: "bg-emerald-50 text-emerald-700 border-emerald-200",
    names: [
      { label: "Air Conditioners", value: "Air Conditioners" },
      { label: "Ceiling Fans", value: "Ceiling Fans" },
      { label: "Water Heaters", value: "Water Heaters" },
      { label: "LED Lights", value: "LED Lights" },
      { label: "Tube Lights", value: "Tube Lights" },
      { label: "Water Coolers", value: "Water Coolers" },
      { label: "Water Purifiers", value: "Water Purifiers" },
      { label: "Photocopier Machines", value: "Photocopier Machines" },
      { label: "Electric Kettles", value: "Electric Kettles" },
      { label: "Microwave Ovens", value: "Microwave Ovens" },
      { label: "Refrigerators", value: "Refrigerators" },
    ],
    modelMap: {
      "Air Conditioners": [
        { label: "Daikin Split AC", value: "Daikin Split AC" },
        { label: "LG Inverter", value: "LG Inverter" },
        { label: "Voltas", value: "Voltas" },
        { label: "Blue Star", value: "Blue Star" },
        { label: "Hitachi", value: "Hitachi" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Ceiling Fans": [
        { label: "Crompton", value: "Crompton" },
        { label: "Havells", value: "Havells" },
        { label: "Usha", value: "Usha" },
        { label: "Orient", value: "Orient" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Heaters": [
        { label: "Racold", value: "Racold" },
        { label: "AO Smith", value: "AO Smith" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Havells", value: "Havells" },
        { label: "V-Guard", value: "V-Guard" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "LED Lights": [
        { label: "Philips", value: "Philips" },
        { label: "Syska", value: "Syska" },
        { label: "Crompton", value: "Crompton" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "Havells", value: "Havells" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Tube Lights": [
        { label: "Philips T5", value: "Philips T5" },
        { label: "Bajaj Batten", value: "Bajaj Batten" },
        { label: "Crompton", value: "Crompton" },
        { label: "Wipro", value: "Wipro" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Coolers": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Water Purifiers": [
        { label: "Kent", value: "Kent" },
        { label: "Aquaguard", value: "Aquaguard" },
        { label: "Pureit", value: "Pureit" },
        { label: "Livpure", value: "Livpure" },
        { label: "AO Smith", value: "AO Smith" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Photocopier Machines": [
        { label: "Xerox", value: "Xerox" },
        { label: "Canon", value: "Canon" },
        { label: "Ricoh", value: "Ricoh" },
        { label: "Konica Minolta", value: "Konica Minolta" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Electric Kettles": [
        { label: "Voltas", value: "Voltas" },
        { label: "Blue Star", value: "Blue Star" },
        { label: "Kenstar", value: "Kenstar" },
        { label: "Usha", value: "Usha" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Microwave Ovens": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Refrigerators: [
        { label: "LG", value: "LG" },
        { label: "Samsung", value: "Samsung" },
        { label: "Whirlpool", value: "Whirlpool" },
        { label: "Godrej", value: "Godrej" },
        { label: "Haier", value: "Haier" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },

  vehicle: {
    label: "Vehicle",
    icon: Car,
    cardRing: "border-l-4 border-l-amber-500",
    badgeClassName: "bg-amber-50 text-amber-700 border-amber-200",
    names: [
      { label: "Car", value: "Car" },
      { label: "Van", value: "Van" },
      { label: "Motorcycle", value: "Motorcycle" },
      { label: "Bicycle", value: "Bicycle" },
      { label: "Bus", value: "Bus" },
      { label: "Ambulance", value: "Ambulance" },
      { label: "Staff Vehicle", value: "Staff Vehicle" },
    ],
    modelMap: {
      Car: [
        { label: "Maruti Suzuki", value: "Maruti Suzuki" },
        { label: "Hyundai", value: "Hyundai" },
        { label: "Tata Motors", value: "Tata Motors" },
        { label: "Mahindra", value: "Mahindra" },
        { label: "Honda", value: "Honda" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Van: [
        { label: "Maruti Eeco", value: "Maruti Eeco" },
        { label: "Tata Winger", value: "Tata Winger" },
        { label: "Force Traveller", value: "Force Traveller" },
        { label: "Mahindra Supro", value: "Mahindra Supro" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Motorcycle: [
        { label: "Hero", value: "Hero" },
        { label: "Bajaj", value: "Bajaj" },
        { label: "TVS", value: "TVS" },
        { label: "Honda", value: "Honda" },
        { label: "Royal Enfield", value: "Royal Enfield" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Bicycle: [
        { label: "Hero", value: "Hero" },
        { label: "Atlas", value: "Atlas" },
        { label: "Hercules", value: "Hercules" },
        { label: "BSA", value: "BSA" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Bus: [
        { label: "Tata Starbus", value: "Tata Starbus" },
        { label: "Ashok Leyland", value: "Ashok Leyland" },
        { label: "Eicher", value: "Eicher" },
        { label: "BharatBenz", value: "BharatBenz" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      Ambulance: [
        { label: "Tata Winger Ambulance", value: "Tata Winger Ambulance" },
        { label: "Force Traveller Ambulance", value: "Force Traveller Ambulance" },
        { label: "Mahindra", value: "Mahindra" },
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
      "Staff Vehicle": [
        { label: "Other (Specify)", value: "Other (Specify)" },
      ],
    },
  },
};

const initialRows: InventoryRow[] = [
  {
    id: 1,
    type: "furniture",
    photoName: "office-table.jpg",
    photoUrl: "/photos/item1.jpg",
    itemName: "Office Tables",
    modelName: "Wooden",
    specifications: "Wooden, Brown, 5x2 ft",
    purchaseDate: "2026-04-01",
    condition: "Excellent",
    quantity: 10,
    unitValue: 2500,
    total: 25000,
    invoice: {
      invoiceMode: "Online",
      invoiceNumber: "INV-2026-0001",
      invoiceDate: "2026-04-14",
      invoiceFileName: "invoice1.pdf",
    },
  },
  {
    id: 2,
    type: "furniture",
    photoName: "executive-chair.jpg",
    itemName: "Chairs (Executive)",
    modelName: "Ergonomic",
    specifications: "Executive chair",
    purchaseDate: "2026-03-20",
    condition: "Good",
    quantity: 6,
    unitValue: 8500,
    total: 51000,
  },
  {
    id: 3,
    type: "it-equipment",
    photoName: "printer.jpg",
    itemName: "Printers",
    modelName: "HP LaserJet",
    specifications: "Laser printer",
    purchaseDate: "2026-02-18",
    condition: "Working",
    quantity: 3,
    unitValue: 18000,
    total: 54000,
  },
  {
    id: 4,
    type: "it-equipment",
    photoName: "laptop.jpg",
    itemName: "Laptops",
    modelName: "Lenovo ThinkPad",
    specifications: "Business laptop",
    purchaseDate: "2026-01-25",
    condition: "Working",
    quantity: 5,
    unitValue: 65000,
    total: 325000,
  },
  {
    id: 5,
    type: "electronic-fixtures",
    photoName: "ac.jpg",
    itemName: "Air Conditioners",
    modelName: "Daikin Split AC",
    specifications: "Split AC unit",
    purchaseDate: "2025-12-10",
    condition: "Working",
    quantity: 4,
    unitValue: 42000,
    total: 168000,
  },
  {
    id: 6,
    type: "electronic-fixtures",
    photoName: "fan.jpg",
    itemName: "Ceiling Fans",
    modelName: "Crompton",
    specifications: "Ceiling mounted fan",
    purchaseDate: "2025-11-08",
    condition: "Working",
    quantity: 12,
    unitValue: 3200,
    total: 38400,
  },
  {
    id: 7,
    type: "vehicle",
    photoName: "car.jpg",
    itemName: "Car",
    modelName: "Maruti Suzuki",
    specifications: "Official use vehicle",
    purchaseDate: "2025-07-15",
    condition: "Good",
    quantity: 2,
    unitValue: 850000,
    total: 1700000,
  },
  {
    id: 8,
    type: "vehicle",
    photoName: "ambulance.jpg",
    itemName: "Ambulance",
    modelName: "Force Traveller Ambulance",
    specifications: "Medical transport vehicle",
    purchaseDate: "2025-05-22",
    condition: "Excellent",
    quantity: 1,
    unitValue: 1450000,
    total: 1450000,
  },
];

const emptyForm = (): InventoryForm => ({
  type: "furniture",
  itemName: "",
  modelName: "",
  specifications: "",
  purchaseDate: "",
  condition: "",
  quantity: "",
  unitValue: "",
  photoName: "",
  photoUrl: "",
});

const emptyInvoiceForm = (): InvoiceForm => ({
  invoiceMode: "upload",
  existingInvoiceKey: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceFileName: "",
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("INR", "₹");
}

export default function FurnitureFixtureClient(): React.ReactElement {
  const { confirm } = useConfirm();

  const [rows, setRows] = useState<InventoryRow[]>(initialRows);
  const [filterType, setFilterType] = useState<string>("all");
  const [form, setForm] = useState<InventoryForm>(emptyForm());
  const [editForm, setEditForm] = useState<InventoryForm>(emptyForm());
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoiceForm());
  const [draftInvoice, setDraftInvoice] = useState<InventoryInvoice | null>(
    initialRows[0].invoice ?? null
  );
  const [editDraftInvoice, setEditDraftInvoice] = useState<InventoryInvoice | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [invoiceError, setInvoiceError] = useState<string>("");
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState<boolean>(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const addPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const editPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const invoiceInputRef = useRef<HTMLInputElement | null>(null);

  const addTypeMeta = inventoryMeta[form.type];
  const addNameOptions = addTypeMeta.names;
  const addModelOptions = form.itemName ? addTypeMeta.modelMap[form.itemName] ?? [] : [];
  const addConditionOptions = conditionMap[form.type];

  const editTypeMeta = inventoryMeta[editForm.type];
  const editNameOptions = editTypeMeta.names;
  const editModelOptions = editForm.itemName
    ? editTypeMeta.modelMap[editForm.itemName] ?? []
    : [];
  const editConditionOptions = conditionMap[editForm.type];

  const filteredRows = useMemo(() => {
    if (filterType === "all") return rows;
    return rows.filter((row) => row.type === filterType);
  }, [filterType, rows]);

  const addLabels = useMemo(() => {
    const isItEquipment = form.type === "it-equipment";
    const isElectronicFixtures = form.type === "electronic-fixtures";
    const isVehicle = form.type === "vehicle";
    return {
      itemName: isItEquipment
        ? "Equipment Name"
        : isElectronicFixtures
          ? "Fixture Name"
          : isVehicle
            ? "Vehicle Type"
            : "Item Name",
      modelName: isItEquipment ? "Brand / Model" : "Type / Model",
      condition: isItEquipment || isElectronicFixtures ? "Status" : "Condition",
      date: isElectronicFixtures ? "Install Date" : "Purchase Date",
      specifications: isVehicle ? "Reg. Number" : "Specifications",
    };
  }, [form.type]);

  const editLabels = useMemo(() => {
    const isItEquipment = editForm.type === "it-equipment";
    const isElectronicFixtures = editForm.type === "electronic-fixtures";
    const isVehicle = editForm.type === "vehicle";
    return {
      itemName: isItEquipment
        ? "Equipment Name"
        : isElectronicFixtures
          ? "Fixture Name"
          : isVehicle
            ? "Vehicle Type"
            : "Item Name",
      modelName: isItEquipment ? "Brand / Model" : "Type / Model",
      condition: isItEquipment || isElectronicFixtures ? "Status" : "Condition",
      date: isElectronicFixtures ? "Install Date" : "Purchase Date",
      specifications: isVehicle ? "Reg. Number" : "Specifications",
    };
  }, [editForm.type]);

  const addSpecsPlaceholder = useMemo(() => {
    if (form.type === "vehicle") return "MH-01-AB-1234";
    if (form.type === "it-equipment") return "e.g. i5, 8GB RAM";
    if (form.type === "electronic-fixtures") return "e.g. i5, 8GB RAM";
    return "Specs / Reg No.";
  }, [form.type]);

  const editSpecsPlaceholder = useMemo(() => {
    if (editForm.type === "vehicle") return "MH-01-AB-1234";
    if (editForm.type === "it-equipment") return "e.g. i5, 8GB RAM";
    if (editForm.type === "electronic-fixtures") return "e.g. i5, 8GB RAM";
    return "Specs / Reg No.";
  }, [editForm.type]);

  const existingInvoiceOptions = useMemo<Option[]>(() => {
    const uniqueInvoices = new Map<string, InventoryInvoice>();
    rows.forEach((row) => {
      const invoice = row.invoice;
      if (!invoice?.invoiceNumber) return;
      const key = `${invoice.invoiceNumber}__${invoice.invoiceDate || ""}`;
      if (!uniqueInvoices.has(key)) uniqueInvoices.set(key, invoice);
    });

    if (uniqueInvoices.size === 0) {
      return [{ label: "No invoice is available", value: "" }];
    }

    return Array.from(uniqueInvoices.entries()).map(([key, invoice]) => ({
      label: `${invoice.invoiceNumber}${invoice.invoiceDate ? ` - ${invoice.invoiceDate}` : ""}`,
      value: key,
    }));
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredRows]);

  const summaryCards = useMemo(() => {
    return (Object.keys(inventoryMeta) as InventoryType[]).map((type) => {
      const typeRows = rows.filter((row) => row.type === type);
      const totalAmount = typeRows.reduce((sum, row) => sum + row.total, 0);
      const totalItems = typeRows.reduce((sum, row) => sum + row.quantity, 0);

      return {
        type,
        label: inventoryMeta[type].label,
        icon: inventoryMeta[type].icon,
        totalAmount,
        totalItems,
        cardRing: inventoryMeta[type].cardRing,
      };
    });
  }, [rows]);

  const grandAssetValue = useMemo(() => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  }, [rows]);

  const resetAddForm = (): void => {
    setForm(emptyForm());
    setDraftInvoice(null);
    setFormError("");
    setInvoiceError("");

    if (addPhotoInputRef.current) addPhotoInputRef.current.value = "";
  };

  const resetEditForm = (): void => {
    setEditForm(emptyForm());
    setEditDraftInvoice(null);
    setEditingId(null);
    setFormError("");
    setInvoiceError("");
    setEditDrawerOpen(false);

    if (editPhotoInputRef.current) editPhotoInputRef.current.value = "";
    if (invoiceInputRef.current) invoiceInputRef.current.value = "";
  };

  const updateForm = <K extends keyof InventoryForm>(key: K, value: InventoryForm[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEditForm = <K extends keyof InventoryForm>(
    key: K,
    value: InventoryForm[K]
  ): void => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateInvoiceForm = <K extends keyof InvoiceForm>(
    key: K,
    value: InvoiceForm[K]
  ): void => {
    setInvoiceForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (value: string): void => {
    const nextType = value as InventoryType;
    setForm((prev) => ({
      ...prev,
      type: nextType,
      itemName: "",
      modelName: "",
      condition: "",
    }));
  };

  const handleEditTypeChange = (value: string): void => {
    const nextType = value as InventoryType;
    setEditForm((prev) => ({
      ...prev,
      type: nextType,
      itemName: "",
      modelName: "",
      condition: "",
    }));
  };

  const handleItemNameChange = (value: string): void => {
    setForm((prev) => ({
      ...prev,
      itemName: value,
      modelName: "",
    }));
  };

  const handleEditItemNameChange = (value: string): void => {
    setEditForm((prev) => ({
      ...prev,
      itemName: value,
      modelName: "",
    }));
  };

  const handleAddPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateForm("photoName", file.name);
    updateForm("photoUrl", URL.createObjectURL(file));
  };

  const handleEditPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateEditForm("photoName", file.name);
    updateEditForm("photoUrl", URL.createObjectURL(file));
  };

  const handleInvoiceUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateInvoiceForm("invoiceFileName", file.name);
  };

  const openInvoiceDrawer = (): void => {
    setInvoiceError("");
    const sourceInvoice = editDrawerOpen ? editDraftInvoice : draftInvoice;
    setInvoiceForm(
      sourceInvoice
        ? {
          invoiceMode: sourceInvoice.invoiceMode,
          existingInvoiceKey: "",
          invoiceNumber: sourceInvoice.invoiceNumber,
          invoiceDate: sourceInvoice.invoiceDate,
          invoiceFileName: sourceInvoice.invoiceFileName,
        }
        : emptyInvoiceForm()
    );
    setInvoiceDrawerOpen(true);
  };

  const validateInvoiceForm = (): string => {
    if (!invoiceForm.invoiceMode) return "Please select invoice mode.";
    if (invoiceForm.invoiceMode === "reuse") {
      if (!invoiceForm.existingInvoiceKey) return "No invoice is available to reuse.";
      return "";
    }
    if (!invoiceForm.invoiceNumber.trim()) return "Please enter invoice number.";
    if (!invoiceForm.invoiceDate) return "Please select invoice date.";
    return "";
  };

  const saveInvoiceDetails = (): void => {
    const error = validateInvoiceForm();
    if (error) {
      setInvoiceError(error);
      return;
    }

    if (editDrawerOpen) {
      setEditDraftInvoice({
        invoiceMode: invoiceForm.invoiceMode,
        invoiceNumber: invoiceForm.invoiceNumber.trim(),
        invoiceDate: invoiceForm.invoiceDate,
        invoiceFileName: invoiceForm.invoiceFileName,
      });
    } else {
      setDraftInvoice({
        invoiceMode: invoiceForm.invoiceMode,
        invoiceNumber: invoiceForm.invoiceNumber.trim(),
        invoiceDate: invoiceForm.invoiceDate,
        invoiceFileName: invoiceForm.invoiceFileName,
      });
    }
    setInvoiceDrawerOpen(false);
  };

  const validateInventoryForm = (targetForm: InventoryForm): string => {
    if (!targetForm.type) return "Please select type.";
    if (!targetForm.itemName) return "Please select item or equipment name.";
    if (!targetForm.modelName) return "Please select type / model / brand.";
    if (!targetForm.purchaseDate) return "Please select purchase date.";
    if (!targetForm.condition) return "Please select condition.";
    if (!targetForm.quantity || Number(targetForm.quantity) <= 0) {
      return "Quantity must be greater than 0.";
    }
    if (!targetForm.unitValue || Number(targetForm.unitValue) <= 0) {
      return "Unit value must be greater than 0.";
    }
    return "";
  };

  const buildPayload = (
    targetForm: InventoryForm,
    id: number,
    invoice: InventoryInvoice | null
  ): InventoryRow => {
    const quantity = Number(targetForm.quantity);
    const unitValue = Number(targetForm.unitValue);

    return {
      id,
      type: targetForm.type,
      photoUrl: targetForm.photoUrl,
      photoName: targetForm.photoName,
      itemName: targetForm.itemName,
      modelName: targetForm.modelName,
      specifications: targetForm.specifications.trim() || "NA",
      purchaseDate: targetForm.purchaseDate,
      condition: targetForm.condition,
      quantity,
      unitValue,
      total: quantity * unitValue,
      invoice,
    };
  };

  const handleAddRow = (): void => {
    const error = validateInventoryForm(form);
    if (error) {
      setFormError(error);
      return;
    }
    const payload = buildPayload(form, Date.now(), draftInvoice);
    setRows((prev) => [payload, ...prev]);

    resetAddForm();
    setCurrentPage(1);
  };

  const handleUpdateRow = (): void => {
    if (editingId === null) return;

    const error = validateInventoryForm(editForm);
    if (error) {
      setFormError(error);
      return;
    }

    const payload = buildPayload(editForm, editingId, editDraftInvoice);
    setRows((prev) => prev.map((row) => (row.id === editingId ? payload : row)));

    resetEditForm();
    setCurrentPage(1);
  };

  const handleEdit = (row: InventoryRow): void => {
    setEditingId(row.id);
    setFormError("");
    setInvoiceError("");

    setEditForm({
      type: row.type,
      itemName: row.itemName,
      modelName: row.modelName,
      specifications: row.specifications === "NA" ? "" : row.specifications,
      purchaseDate: row.purchaseDate,
      condition: row.condition,
      quantity: String(row.quantity),
      unitValue: String(row.unitValue),
      photoName: row.photoName ?? "",
      photoUrl: row.photoUrl ?? "",
    });

    setEditDraftInvoice(row.invoice ?? null);
    setEditDrawerOpen(true);
  };

  const handleDelete = (id: number): void => {
    const targetRow = rows.find((row) => row.id === id);

    confirm({
      variant: "delete",
      title: "Delete Inventory Row",
      description: "Are you sure you want to delete this inventory row?",
      confirmText: "Delete",
      cancelText: "Cancel",
      meta: {
        name: targetRow?.itemName,
      },
      onConfirm: () => {
        setRows((prev) => prev.filter((row) => row.id !== id));
        if (editingId === id) resetEditForm();
      },
    });
  };

  const addInvoicePreviewLabel = draftInvoice?.invoiceNumber || "Add Invoice";
  const editInvoicePreviewLabel = editDraftInvoice?.invoiceNumber || "Add Invoice";

  const tableData: InventoryTableRow[] = paginatedRows.map((row, index) => ({
    ...row,
    srNo: (currentPage - 1) * PAGE_SIZE + index + 1,
  }));

  const tableColumns: Column<InventoryTableRow>[] = [
    {
      key: "srNo",
      label: "No.",
      render: (value) => <span className="text-slate-600">{String(value ?? "-")}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (_value, row) => (
        <Badge variant="outline" size="sm" className={inventoryMeta[row.type].badgeClassName}>
          {inventoryMeta[row.type].label}
        </Badge>
      ),
    },
    {
      key: "photoUrl",
      label: "Photo",
      render: (_value, row) => (
        <div className="flex justify-center">
          {row.photoUrl ? (
            <img
              src={row.photoUrl}
              alt={row.itemName}
              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
              <Package2 className="h-4 w-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "itemName",
      label: "Item / Equipment Name",
      render: (value) => <span className="font-medium text-slate-800">{String(value ?? "-")}</span>,
    },
    {
      key: "modelName",
      label: "Type / Model / Brand",
      render: (value) => <span className="font-medium text-blue-700">{String(value ?? "-")}</span>,
    },
    {
      key: "specifications",
      label: "Specs / Reg No.",
      render: (value) => <span className="text-slate-500">{String(value ?? "-")}</span>,
    },
    {
      key: "purchaseDate",
      label: "Date",
      render: (value) => String(value ?? "-"),
    },
    {
      key: "condition",
      label: "Cond. / Status",
      render: (value) => (
        <Badge variant="default" size="sm" className="border-sky-200 bg-sky-50 text-sky-700">
          {String(value ?? "-")}
        </Badge>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (value) => String(value ?? "-"),
    },
    {
      key: "unitValue",
      label: "Unit Value (₹)",
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      key: "total",
      label: "Total (₹)",
      render: (value) => (
        <span className="font-semibold text-blue-700">{formatCurrency(Number(value ?? 0))}</span>
      ),
    },
    {
      key: "invoice",
      label: "Invoice",
      render: (value) => {
        const invoice = value as InventoryInvoice | null | undefined;
        return invoice?.invoiceNumber ? (
          <Badge variant="warning" size="sm">
            {invoice.invoiceNumber}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="space-y-4 pb-3">
        <TableHeader
          title="Furniture & Fixtures Inventory"
          subtitle=""
          icon={Package2}
          className="rounded-xl border border-[#CBD8EA] bg-[#F5F8FD] shadow-sm"
        />

        {/*
          Summary cards (A/B/C/D) intentionally hidden per request.
          Uncomment to show category totals again.
        */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card, index) => {
            const prefixes = ["A)", "B)", "C)", "D)"];
            return (
              <Card
                key={card.type}
                variant="bordered"
                className={`rounded-xl border border-[#D8E3F1] bg-white shadow-sm ${card.cardRing}`}
              >
                <CardContent className="flex items-start justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold leading-none text-[#1D4ED8] sm:text-xl">
                      {formatCurrency(card.totalAmount)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {prefixes[index] ?? ""} {card.label}
                    </p>
                    <p className="text-xs text-slate-500">{card.totalItems} items</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>


        <Card
          variant="bordered"
          padding="sm"
          className="rounded-xl border border-[#BFD0E6] bg-white shadow-md"
        >
          <CardContent className="space-y-4">
            <div className="mb-1 flex flex-col gap-2 border-b border-[#D7E1EE] pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#1E40AF] sm:text-xl">
                Furniture & Fixtures Inventory
              </h2>
              <p className="text-sm font-medium text-[#1D4ED8]">
                Total {filteredRows.length} items
              </p>
            </div>

            <div className="rounded-xl border border-[#CFD9E6] bg-[#F7FAFF] p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 2xl:items-end">
                <Select
                  label="Type"
                  value={form.type}
                  onChange={handleTypeChange}
                  options={typeOptions}
                  placeholder="Select type"
                />

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Photo</span>
                  <input
                    ref={addPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddPhotoUpload}
                  />
                  <UploadButton
                    label={form.photoName || "Upload"}
                    className="justify-start"
                    onClick={() => addPhotoInputRef.current?.click()}
                  />
                </div>

                <Select
                  label={addLabels.itemName}
                  value={form.itemName}
                  onChange={handleItemNameChange}
                  options={addNameOptions}
                  placeholder="-- Select --"
                />

                <Select
                  label={addLabels.modelName}
                  value={form.modelName}
                  onChange={(value) => updateForm("modelName", value)}
                  options={addModelOptions}
                  placeholder="-- Select --"
                  disabled={!form.itemName}
                />

                {form.type === "furniture" ? null : (
                  <Input
                    label={addLabels.specifications}
                    placeholder={addSpecsPlaceholder}
                    value={form.specifications}
                    onChange={(event) => updateForm("specifications", event.target.value)}
                  />
                )}

                <Input
                  label={addLabels.date}
                  type="date"
                  value={form.purchaseDate}
                  onChange={(event) => updateForm("purchaseDate", event.target.value)}
                />

                <Select
                  label={addLabels.condition}
                  value={form.condition}
                  onChange={(value) => updateForm("condition", value)}
                  options={addConditionOptions}
                  placeholder="Select condition"
                />

                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) => updateForm("quantity", event.target.value)}
                />

                <Input
                  label="Unit Value (₹)"
                  type="number"
                  min={0}
                  value={form.unitValue}
                  onChange={(event) => updateForm("unitValue", event.target.value)}
                />

                <Button
                  variant="primary"
                  icon={Receipt}
                  className="h-10 w-full whitespace-nowrap bg-[#F59E0B] text-white hover:bg-[#D97706] sm:col-span-2 sm:w-auto lg:col-span-1"
                  onClick={openInvoiceDrawer}
                >
                  {addInvoicePreviewLabel === "Add Invoice"
                    ? "Add Invoice"
                    : addInvoicePreviewLabel}
                </Button>

                <AddButton
                  label="Add Row"
                  className="h-10 w-full whitespace-nowrap sm:col-span-2 sm:w-auto lg:col-span-1"
                  onClick={handleAddRow}
                />
              </div>
            </div>

            {formError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card
          variant="bordered"
          padding="none"
          className="overflow-hidden rounded-xl border border-[#BFD0E6] bg-white shadow-md"
        >
          <div className="flex flex-col gap-0">
            <div className="w-full overflow-x-auto">
              <div className="flex items-center justify-between gap-3 border-b border-[#D7E1EE] bg-[#F7FAFF] px-3 py-2">
                <div className="text-sm font-semibold text-slate-700">Inventory</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Type</span>
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="furniture">Furniture</option>
                    <option value="it-equipment">IT Equipment</option>
                    <option value="electronic-fixtures">Electronic Fixtures</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
              </div>
              <MasterTable
                data={tableData}
                columns={tableColumns}
                emptyText="No inventory rows added yet."
                renderActions={(row) => (
                  <>
                    <EditButton onClick={() => handleEdit(row)} />
                    <DeleteButton onClick={() => handleDelete(row.id)} />
                  </>
                )}
                actionLabel="Actions"
                pageNumber={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={filteredRows.length}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                paginationConfig={{ enabled: true }}
                maxBodyHeightClassName="max-h-none"
                tableClassName="min-w-[1160px]"
                containerClassName="overflow-hidden rounded-xl border border-[#CBD8EA] bg-white"
              />
            </div>

            <div className="border-t border-[#D7E1EE] bg-[#F7FAFF] p-3">
              <div className="flex justify-stretch sm:justify-end">
                <Card
                  variant="bordered"
                  className="w-full max-w-full overflow-hidden rounded-xl border border-[#0F172A] bg-[#0F172A] shadow-md sm:max-w-[260px]"
                >
                  <CardContent className="flex items-start justify-between gap-2 px-3 py-2">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-slate-300">
                        GRAND TOTAL
                      </p>
                      <p className="mt-1 text-lg font-bold leading-none text-white sm:text-xl">
                        {formatCurrency(grandAssetValue)}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">{rows.length} items</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Drawer
        open={editDrawerOpen}
        onClose={resetEditForm}
        width="lg"
        title={
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <h3 id="drawer-title" className="text-lg font-semibold text-slate-900">
                Edit Inventory Item
              </h3>
              <p className="text-sm text-slate-500">
                Update inventory details from the right-side drawer.
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="secondary" icon={X} onClick={resetEditForm}>
              Close
            </Button>
            <Button variant="primary" icon={Receipt} onClick={openInvoiceDrawer}>
              {editInvoicePreviewLabel === "Add Invoice"
                ? "Add Invoice"
                : editInvoicePreviewLabel}
            </Button>
            <AddButton label="Update Row" onClick={handleUpdateRow} />
          </div>
        }
      >
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Type"
              value={editForm.type}
              onChange={handleEditTypeChange}
              options={typeOptions}
              placeholder="Select type"
            />

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Photo</span>
              <input
                ref={editPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditPhotoUpload}
              />
              <UploadButton
                label={editForm.photoName || "Upload"}
                className="justify-start"
                onClick={() => editPhotoInputRef.current?.click()}
              />
            </div>

            <Select
              label={editLabels.itemName}
              value={editForm.itemName}
              onChange={handleEditItemNameChange}
              options={editNameOptions}
              placeholder="-- Select --"
            />

            <Select
              label={editLabels.modelName}
              value={editForm.modelName}
              onChange={(value) => updateEditForm("modelName", value)}
              options={editModelOptions}
              placeholder="-- Select --"
              disabled={!editForm.itemName}
            />

            {editForm.type === "furniture" ? null : (
              <Input
                label={editLabels.specifications}
                placeholder={editSpecsPlaceholder}
                value={editForm.specifications}
                onChange={(event) => updateEditForm("specifications", event.target.value)}
              />
            )}

            <Input
              label={editLabels.date}
              type="date"
              value={editForm.purchaseDate}
              onChange={(event) => updateEditForm("purchaseDate", event.target.value)}
            />

            <Select
              label={editLabels.condition}
              value={editForm.condition}
              onChange={(value) => updateEditForm("condition", value)}
              options={editConditionOptions}
              placeholder="Select condition"
            />

            <Input
              label="Quantity"
              type="number"
              min={1}
              value={editForm.quantity}
              onChange={(event) => updateEditForm("quantity", event.target.value)}
            />

            <Input
              label="Unit Value (₹)"
              type="number"
              min={0}
              value={editForm.unitValue}
              onChange={(event) => updateEditForm("unitValue", event.target.value)}
            />
          </div>

          {formError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
        </div>
      </Drawer>

      {editDrawerOpen && invoiceDrawerOpen ? (
        <div
          className="fixed top-0 right-0 z-50 h-full w-[95vw] bg-white/10 backdrop-blur-sm md:w-[900px] lg:w-[900px] xl:w-[900px]"
          aria-hidden="true"
        />
      ) : null}

      <Drawer
        open={invoiceDrawerOpen}
        onClose={() => setInvoiceDrawerOpen(false)}
        width="md"
        title={
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 id="drawer-title" className="text-lg font-semibold text-slate-900">
                Add Invoice Details
              </h3>
              <p className="text-sm text-slate-500">
                Invoice details can be reused for multiple items.
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="secondary" icon={X} onClick={() => setInvoiceDrawerOpen(false)}>
              Close
            </Button>
            <Button variant="primary" icon={Receipt} onClick={saveInvoiceDetails}>
              Save Invoice Details
            </Button>
          </div>
        }
      >
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="rounded-2xl bg-white p-1">
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <Select
                label="Invoice Mode"
                value={invoiceForm.invoiceMode}
                onChange={(value) => {
                  updateInvoiceForm("invoiceMode", value);
                  updateInvoiceForm("existingInvoiceKey", "");
                  if (value === "upload") {
                    updateInvoiceForm("invoiceNumber", "");
                    updateInvoiceForm("invoiceDate", "");
                    updateInvoiceForm("invoiceFileName", "");
                  }
                }}
                options={invoiceModeOptions}
              />

              {invoiceForm.invoiceMode === "reuse" ? (
                <Select
                  label="Select Existing Invoice"
                  value={invoiceForm.existingInvoiceKey}
                  onChange={(key) => {
                    updateInvoiceForm("existingInvoiceKey", key);
                    const selected = existingInvoiceOptions.find((opt) => opt.value === key);
                    if (!selected?.value) return;

                    const [invoiceNumber, invoiceDate] = selected.value.split("__");
                    updateInvoiceForm("invoiceNumber", invoiceNumber || "");
                    updateInvoiceForm("invoiceDate", invoiceDate || "");
                    updateInvoiceForm("invoiceFileName", "");
                  }}
                  options={existingInvoiceOptions}
                  placeholder="-- Select Invoice --"
                  disabled={existingInvoiceOptions.length === 1 && existingInvoiceOptions[0]?.value === ""}
                />
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Upload Invoice File</span>
                    <input
                      ref={invoiceInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleInvoiceUpload}
                    />
                    <UploadButton
                      label={invoiceForm.invoiceFileName || "Choose Invoice File (PDF, JPG, PNG)"}
                      className="w-full justify-start"
                      onClick={() => invoiceInputRef.current?.click()}
                    />
                  </div>

                  <Input
                    label="Invoice Number"
                    placeholder="e.g. INV-2024-001"
                    value={invoiceForm.invoiceNumber}
                    onChange={(event) => updateInvoiceForm("invoiceNumber", event.target.value)}
                  />

                  <Input
                    label="Invoice Date"
                    type="date"
                    value={invoiceForm.invoiceDate}
                    onChange={(event) => updateInvoiceForm("invoiceDate", event.target.value)}
                  />
                </>
              )}

              {invoiceForm.invoiceMode === "reuse" ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {invoiceForm.existingInvoiceKey
                    ? `Selected: ${invoiceForm.invoiceNumber}${invoiceForm.invoiceDate ? ` (${invoiceForm.invoiceDate})` : ""}`
                    : existingInvoiceOptions.length === 1 && existingInvoiceOptions[0]?.value === ""
                      ? "No invoice is available."
                      : "Select an invoice to reuse."}
                </div>
              ) : null}

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This invoice can be reused for multiple items.
              </div>

              {invoiceError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {invoiceError}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Drawer>


    </div>
  );
}
