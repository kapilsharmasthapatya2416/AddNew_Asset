import {
  AssetCategory,
  ValuationDetailRow,
  ValuationDetailsData,
  ValuationPageData,
  ValuationResponse,
} from '@/types/valuation.types';

const currencyFormatter = new Intl.NumberFormat('en-IN');
const formatCurrency = (value: number): string => `Rs. ${currencyFormatter.format(value)}`;

function expandRowsForPagination(
  rows: ValuationDetailRow[],
  sectionLabel: string,
  minRows: number = 12
): ValuationDetailRow[] {
  if (rows.length >= minRows || rows.length === 0) return rows;

  const generatedRows = Array.from({ length: minRows - rows.length }, (_, index) => {
    const baseRow = rows[index % rows.length];
    const serialNumber = rows.length + index + 1;

    return {
      ...baseRow,
      ...(typeof baseRow.sNo === 'number' ? { sNo: serialNumber } : {}),
      ...(typeof baseRow.floor === 'string' ? { floor: `${baseRow.floor} (${sectionLabel} ${serialNumber})` } : {}),
      __testRowLabel: `Test ${sectionLabel} ${serialNumber}`,
    };
  });

  return [...rows, ...generatedRows];
}

const valuationFlowContext: { assetCategory: AssetCategory } = {
  assetCategory: 'infrastructure',
};

export async function getValuationData(): Promise<ValuationResponse> {
  // simulate API delay (SSR friendly)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data: ValuationResponse = {
    building: {
      floors: 4,
      totalBuiltUpArea: 4690,
      capitalValue: 21500,
    },

    furniture: {
      items: 12,
      totalQuantity: 30,
      totalValue: 15000,
    },

    itEquipment: {
      items: 8,
      totalQuantity: 15,
      totalValue: 25000,
    },

    electronics: {
      items: 5,
      totalQuantity: 10,
      totalValue: 12000,
    },

    vehicles: {
      items: 2,
      totalQuantity: 2,
      totalValue: 80000,
    },

    grandTotal:
      21500 + 15000 + 25000 + 12000 + 80000,
  };

  return data;
}

export async function getValuationDetailsData(
  valuation: ValuationResponse
): Promise<ValuationDetailsData> {
  const buildingRows: ValuationDetailRow[] = [
    {
      floor: '1 Ground',
      conYr: 2012,
      assetYr: 2023,
      conType: 'RCC',
      use: 'Residential',
      subType: 'Bungalow',
      rooms: 4,
      carpetArea: '1200.00 / 111.48',
      builtUpArea: '1450.00 / 134.71',
      sdrr: 0,
      baseValue: formatCurrency(5000),
      floorFactor: formatCurrency(5000),
      ageFactor: 0,
      ntbFactor: 0,
      useFactor: 0,
      capitalValue: formatCurrency(5000),
    },
    {
      floor: '2 1st',
      conYr: 2012,
      assetYr: 2023,
      conType: 'RCC',
      use: 'Residential',
      subType: 'Duplex',
      rooms: 3,
      carpetArea: '950.00 / 88.26',
      builtUpArea: '1140.00 / 105.91',
      sdrr: 0,
      baseValue: formatCurrency(6000),
      floorFactor: formatCurrency(6000),
      ageFactor: 0,
      ntbFactor: 0,
      useFactor: 0,
      capitalValue: formatCurrency(6000),
    },
    {
      floor: '3 2nd',
      conYr: 2013,
      assetYr: 2023,
      conType: 'RCC',
      use: 'Commercial',
      subType: 'Shop',
      rooms: 2,
      carpetArea: '650.00 / 60.39',
      builtUpArea: '780.00 / 72.46',
      sdrr: 0,
      baseValue: formatCurrency(5500),
      floorFactor: formatCurrency(5500),
      ageFactor: 0,
      ntbFactor: 0,
      useFactor: 0,
      capitalValue: formatCurrency(5500),
    },
    {
      floor: '4 3rd',
      conYr: 2015,
      assetYr: 2023,
      conType: 'Load Bearing',
      use: 'Commercial',
      subType: 'Office',
      rooms: 5,
      carpetArea: '1100.00 / 102.19',
      builtUpArea: '1320.00 / 122.63',
      sdrr: 0,
      baseValue: formatCurrency(5000),
      floorFactor: formatCurrency(5000),
      ageFactor: 0,
      ntbFactor: 0,
      useFactor: 0,
      capitalValue: formatCurrency(5000),
    },
  ];

  const details: ValuationDetailsData = {
    building: {
      title: 'Construction Details',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'building',
      columns: [
        { key: 'floor', label: 'Floor' },
        { key: 'conYr', label: 'Con Yr' },
        { key: 'assetYr', label: 'Asst Yr' },
        { key: 'conType', label: 'Con Type' },
        { key: 'use', label: 'Use' },
        { key: 'subType', label: 'Sub Type Of Use' },
        { key: 'rooms', label: 'Rooms' },
        { key: 'carpetArea', label: 'Carpet Area (sq.ft / sq.m)' },
        { key: 'builtUpArea', label: 'Built-up Area (sq.ft / sq.m)' },
        { key: 'sdrr', label: 'SDRR' },
        { key: 'baseValue', label: 'Base Value (Rs.)' },
        { key: 'floorFactor', label: 'Floor Factor (FF) (Rs.)' },
        { key: 'ageFactor', label: 'Age Factor (AF) (Rs.)' },
        { key: 'ntbFactor', label: 'NTB Factor (Rs.)' },
        { key: 'useFactor', label: 'Use Factor (UC) (Rs.)' },
        { key: 'capitalValue', label: 'Capital Value (Rs.)' },
      ],
      rows: expandRowsForPagination(buildingRows, 'building'),
      totalLabel: 'Total Capital Value (CV)',
      totalValue: valuation.building.capitalValue,
    },
    furniture: {
      title: 'Furniture Items Details',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'furniture',
      columns: [
        { key: 'sNo', label: 'S.No' },
        { key: 'itemName', label: 'Item Name' },
        { key: 'typeModel', label: 'Type / Model' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'condition', label: 'Condition' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unitValue', label: 'Unit Value (Rs.)' },
        { key: 'totalValue', label: 'Total Value (Rs.)' },
      ],
      rows: expandRowsForPagination([
        {
          sNo: 1,
          itemName: 'Office Chair',
          typeModel: 'Ergo Mesh CH-210',
          purchaseDate: '2023-01-12',
          condition: 'Good',
          quantity: 10,
          unitValue: formatCurrency(300),
          totalValue: formatCurrency(3000),
        },
        {
          sNo: 2,
          itemName: 'Executive Desk',
          typeModel: 'Woodline EXD-04',
          purchaseDate: '2023-02-05',
          condition: 'Good',
          quantity: 8,
          unitValue: formatCurrency(750),
          totalValue: formatCurrency(6000),
        },
        {
          sNo: 3,
          itemName: 'Filing Cabinet',
          typeModel: 'SteelSafe FC-3D',
          purchaseDate: '2023-02-18',
          condition: 'Fair',
          quantity: 6,
          unitValue: formatCurrency(500),
          totalValue: formatCurrency(3000),
        },
        {
          sNo: 4,
          itemName: 'Conference Table',
          typeModel: 'BoardPro CT-12',
          purchaseDate: '2023-03-02',
          condition: 'Good',
          quantity: 6,
          unitValue: formatCurrency(500),
          totalValue: formatCurrency(3000),
        },
      ], 'furniture'),
      totalLabel: 'Total Furniture Value',
      totalValue: valuation.furniture.totalValue,
    },
    itEquipment: {
      title: 'IT Equipment Details',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'itEquipment',
      columns: [
        { key: 'sNo', label: 'S.No' },
        { key: 'equipmentName', label: 'Equipment Name' },
        { key: 'brandModel', label: 'Brand / Model' },
        { key: 'specifications', label: 'Specifications' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'status', label: 'Status' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unitValue', label: 'Unit Value (Rs.)' },
        { key: 'totalValue', label: 'Total Value (Rs.)' },
      ],
      rows: expandRowsForPagination([
        {
          sNo: 1,
          equipmentName: 'Desktop Workstation',
          brandModel: 'Dell OptiPlex 7010',
          specifications: 'i5 / 16GB / 512GB SSD',
          purchaseDate: '2023-01-15',
          status: 'Active',
          quantity: 5,
          unitValue: formatCurrency(2000),
          totalValue: formatCurrency(10000),
        },
        {
          sNo: 2,
          equipmentName: 'Laser Printer',
          brandModel: 'HP LaserJet Pro',
          specifications: 'Mono / Network',
          purchaseDate: '2023-02-11',
          status: 'Active',
          quantity: 4,
          unitValue: formatCurrency(1500),
          totalValue: formatCurrency(6000),
        },
        {
          sNo: 3,
          equipmentName: 'Network Switch',
          brandModel: 'Cisco SG350',
          specifications: '24 Port Gigabit',
          purchaseDate: '2023-02-20',
          status: 'Active',
          quantity: 3,
          unitValue: formatCurrency(1500),
          totalValue: formatCurrency(4500),
        },
        {
          sNo: 4,
          equipmentName: 'UPS',
          brandModel: 'APC Smart-UPS',
          specifications: '1.5 KVA',
          purchaseDate: '2023-03-01',
          status: 'Active',
          quantity: 3,
          unitValue: formatCurrency(1500),
          totalValue: formatCurrency(4500),
        },
      ], 'it'),
      totalLabel: 'Total IT Equipment Value',
      totalValue: valuation.itEquipment.totalValue,
    },
    electronics: {
      title: 'Electronic Fixtures Details',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'electronics',
      columns: [
        { key: 'sNo', label: 'S.No' },
        { key: 'itemName', label: 'Item Name' },
        { key: 'typeModel', label: 'Type / Model' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'condition', label: 'Condition' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unitValue', label: 'Unit Value (Rs.)' },
        { key: 'totalValue', label: 'Total Value (Rs.)' },
      ],
      rows: expandRowsForPagination([
        {
          sNo: 1,
          itemName: 'LED Panel Light',
          typeModel: 'Syska PL-24W',
          purchaseDate: '2023-01-25',
          condition: 'Good',
          quantity: 4,
          unitValue: formatCurrency(1250),
          totalValue: formatCurrency(5000),
        },
        {
          sNo: 2,
          itemName: 'Ceiling Fan',
          typeModel: 'Havells 1200mm',
          purchaseDate: '2023-02-08',
          condition: 'Good',
          quantity: 3,
          unitValue: formatCurrency(1167),
          totalValue: formatCurrency(3500),
        },
        {
          sNo: 3,
          itemName: 'Wall Exhaust Fan',
          typeModel: 'Usha EF-300',
          purchaseDate: '2023-03-04',
          condition: 'Good',
          quantity: 3,
          unitValue: formatCurrency(1167),
          totalValue: formatCurrency(3500),
        },
      ], 'electronics'),
      totalLabel: 'Total Electronic Fixtures Value',
      totalValue: valuation.electronics.totalValue,
    },
    vehicles: {
      title: 'Vehicles Details',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'vehicles',
      columns: [
        { key: 'sNo', label: 'S.No' },
        { key: 'vehicleName', label: 'Vehicle Name' },
        { key: 'modelRegNo', label: 'Model / Reg No.' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'condition', label: 'Condition' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unitValue', label: 'Unit Value (Rs.)' },
        { key: 'totalValue', label: 'Total Value (Rs.)' },
      ],
      rows: expandRowsForPagination([
        {
          sNo: 1,
          vehicleName: 'Utility Pickup',
          modelRegNo: 'Bolero Pik-Up / MH-04-AX-2201',
          purchaseDate: '2022-11-10',
          condition: 'Good',
          quantity: 1,
          unitValue: formatCurrency(45000),
          totalValue: formatCurrency(45000),
        },
        {
          sNo: 2,
          vehicleName: 'Field Inspection Car',
          modelRegNo: 'Tata Tigor / MH-04-BX-9012',
          purchaseDate: '2023-01-07',
          condition: 'Good',
          quantity: 1,
          unitValue: formatCurrency(35000),
          totalValue: formatCurrency(35000),
        },
      ], 'vehicles'),
      totalLabel: 'Total Vehicle Value',
      totalValue: valuation.vehicles.totalValue,
    },
    grandTotal: {
      title: 'Grand Total Valuation Summary',
      subtitle: 'Step 4 of 5 | Valuation',
      bannerClassName: 'bg-[#1f3c66]',
      iconKey: 'grandTotal',
      columns: [
        { key: 'category', label: 'Category' },
        { key: 'items', label: 'Items' },
        { key: 'quantity', label: 'Total Quantity' },
        { key: 'value', label: 'Total Value (Rs.)' },
      ],
      rows: expandRowsForPagination([
        {
          category: 'Building',
          items: valuation.building.floors,
          quantity: valuation.building.totalBuiltUpArea,
          value: formatCurrency(valuation.building.capitalValue),
        },
        {
          category: 'Furniture',
          items: valuation.furniture.items,
          quantity: valuation.furniture.totalQuantity,
          value: formatCurrency(valuation.furniture.totalValue),
        },
        {
          category: 'IT Equipment',
          items: valuation.itEquipment.items,
          quantity: valuation.itEquipment.totalQuantity,
          value: formatCurrency(valuation.itEquipment.totalValue),
        },
        {
          category: 'Electronic Fixtures',
          items: valuation.electronics.items,
          quantity: valuation.electronics.totalQuantity,
          value: formatCurrency(valuation.electronics.totalValue),
        },
        {
          category: 'Vehicles',
          items: valuation.vehicles.items,
          quantity: valuation.vehicles.totalQuantity,
          value: formatCurrency(valuation.vehicles.totalValue),
        },
      ], 'grand total'),
      totalLabel: 'Grand Total Asset Value',
      totalValue: valuation.grandTotal,
    },
  };

  return details;
}

export async function getValuationPageData(): Promise<ValuationPageData> {
  const valuation = await getValuationData();
  const details = await getValuationDetailsData(valuation);

  return {
    category: valuationFlowContext.assetCategory,
    valuation,
    details,
  };
}
