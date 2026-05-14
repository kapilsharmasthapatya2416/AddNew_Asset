/**
 * ----------------------------------------
 * Master data registry and storage helpers
 * Provides defaults and persistence helpers backed by localStorage.
 * ----------------------------------------
 */

import type { MasterDataConfig } from '@/types/asset.types';

export const STATIC_SUPPORT_MASTER_KEYS = new Set<keyof MasterDataConfig>([
  'yesNo',
  'landAreaUnit',
  'landShape',
  'encumbranceStatus',
  'terrainType',
  'approachRoadType',
  'surroundingDevelopment',
  'currentLandUsage',
  'buildableStatus',
  'floodProneArea',
  'rentFrequency',
  'depositType',
  'landClassification',
  'plotBoundaryType',
  'condition',
  'roadCategory',
  'roadClass',
  'numberOfLanes',
  'surfaceType',
  'trafficFlow',
  'medianType',
  'footpathAvailability',
  'drainageSystem',
  'streetLighting',
  'roadMarking',
  'trafficSignals',
  'parkingFacility',
]);

export type StaticSupportMasterKey =
  | 'yesNo'
  | 'landAreaUnit'
  | 'landShape'
  | 'encumbranceStatus'
  | 'terrainType'
  | 'approachRoadType'
  | 'surroundingDevelopment'
  | 'currentLandUsage'
  | 'buildableStatus'
  | 'floodProneArea'
  | 'rentFrequency'
  | 'depositType'
  | 'landClassification'
  | 'plotBoundaryType'
  | 'condition'
  | 'roadCategory'
  | 'roadClass'
  | 'numberOfLanes'
  | 'surfaceType'
  | 'trafficFlow'
  | 'medianType'
  | 'footpathAvailability'
  | 'drainageSystem'
  | 'streetLighting'
  | 'roadMarking'
  | 'trafficSignals'
  | 'parkingFacility';

export type StaticSupportMasterData = Pick<MasterDataConfig, StaticSupportMasterKey>;

export const STATIC_SUPPORT_MASTER_DATA: StaticSupportMasterData = {
  yesNo: [
    { id: 1, code: 'YN-001', name: 'Yes', description: 'Positive response', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'YN-002', name: 'No', description: 'Negative response', isActive: true, createdDate: '2024-01-15' },
  ],
  landAreaUnit: [
    { id: 1, code: 'LAU-001', name: 'Sq.m', description: 'Square meters', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LAU-002', name: 'Sq.ft', description: 'Square feet', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LAU-003', name: 'Acre', description: 'Acre', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LAU-004', name: 'Hectare', description: 'Hectare', isActive: true, createdDate: '2024-01-15' },
  ],
  landShape: [
    { id: 1, code: 'LS-001', name: 'Regular', description: 'Regular shape', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LS-002', name: 'Irregular', description: 'Irregular shape', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LS-003', name: 'Triangular', description: 'Triangular shape', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LS-004', name: 'Rectangular', description: 'Rectangular shape', isActive: true, createdDate: '2024-01-15' },
  ],
  encumbranceStatus: [
    { id: 1, code: 'ES-001', name: 'Free', description: 'No encumbrance', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ES-002', name: 'Encumbered', description: 'Has encumbrance', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'ES-003', name: 'Under Litigation', description: 'Subject to litigation', isActive: true, createdDate: '2024-01-15' },
  ],
  terrainType: [
    { id: 1, code: 'TT-001', name: 'Flat', description: 'Flat terrain', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TT-002', name: 'Sloping', description: 'Sloping terrain', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'TT-003', name: 'Uneven', description: 'Uneven terrain', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'TT-004', name: 'Rocky', description: 'Rocky terrain', isActive: true, createdDate: '2024-01-15' },
  ],
  approachRoadType: [
    { id: 1, code: 'ART-001', name: 'CC', description: 'Cement concrete road', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ART-002', name: 'BT', description: 'Bituminous road', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'ART-003', name: 'WBM', description: 'Water bound macadam road', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'ART-004', name: 'Kachha', description: 'Earthen road', isActive: true, createdDate: '2024-01-15' },
  ],
  surroundingDevelopment: [
    { id: 1, code: 'SD-001', name: 'Residential', description: 'Residential surroundings', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'SD-002', name: 'Commercial', description: 'Commercial surroundings', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'SD-003', name: 'Open', description: 'Open surroundings', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'SD-004', name: 'Agricultural', description: 'Agricultural surroundings', isActive: true, createdDate: '2024-01-15' },
  ],
  currentLandUsage: [
    { id: 1, code: 'CLU-001', name: 'Vacant', description: 'Vacant land', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'CLU-002', name: 'Parking', description: 'Parking usage', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'CLU-003', name: 'Garden', description: 'Garden usage', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'CLU-004', name: 'Temporary Use', description: 'Temporary usage', isActive: true, createdDate: '2024-01-15' },
  ],
  buildableStatus: [
    { id: 1, code: 'BS-001', name: 'Buildable', description: 'Can be developed', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'BS-002', name: 'Restricted', description: 'Restricted development', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'BS-003', name: 'Non-Buildable', description: 'Cannot be developed', isActive: true, createdDate: '2024-01-15' },
  ],
  floodProneArea: [
    { id: 1, code: 'FPA-001', name: 'Yes', description: 'Flood prone area', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'FPA-002', name: 'No', description: 'Not flood prone', isActive: true, createdDate: '2024-01-15' },
  ],
  rentFrequency: [
    { id: 1, code: 'RF-001', name: 'Monthly', description: 'Rent collected every month', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RF-002', name: 'Quarterly', description: 'Rent collected every quarter', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RF-003', name: 'Half-Yearly', description: 'Rent collected twice a year', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'RF-004', name: 'Yearly', description: 'Rent collected annually', isActive: true, createdDate: '2024-01-15' },
  ],
  depositType: [
    { id: 1, code: 'DT-001', name: 'Security Deposit', description: 'Refundable security deposit', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'DT-002', name: 'Processing Fee', description: 'Non-refundable processing fee', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'DT-003', name: 'Registration Fee', description: 'Registration charges', isActive: true, createdDate: '2024-01-15' },
  ],
  landClassification: [
    { id: 1, code: 'LC-001', name: 'Agricultural', description: 'Agricultural land', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LC-002', name: 'Non-Agricultural', description: 'Non-agricultural land', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LC-003', name: 'Residential', description: 'Residential land use', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LC-004', name: 'Commercial', description: 'Commercial land use', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'LC-005', name: 'Industrial', description: 'Industrial land use', isActive: true, createdDate: '2024-01-15' },
  ],
  plotBoundaryType: [
    { id: 1, code: 'PB-001', name: 'Compound Wall', description: 'Brick/cement compound wall', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'PB-002', name: 'Fencing', description: 'Metal/wire fencing', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'PB-003', name: 'Natural Boundary', description: 'Natural boundaries (river, hill)', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'PB-004', name: 'Road', description: 'Road as boundary', isActive: true, createdDate: '2024-01-15' },
  ],
  condition: [
    { id: 1, code: 'COND-001', name: 'Excellent', description: 'Excellent condition', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'COND-002', name: 'Good', description: 'Good condition', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'COND-003', name: 'Fair', description: 'Fair condition', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'COND-004', name: 'Poor', description: 'Poor condition - needs repair', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'COND-005', name: 'Dilapidated', description: 'Dilapidated - major repairs needed', isActive: true, createdDate: '2024-01-15' },
  ],
  roadCategory: [
    { id: 1, code: 'RC-001', name: 'Main Road', description: 'Main arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RC-002', name: 'Arterial Road', description: 'Arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RC-003', name: 'Sub-Arterial Road', description: 'Sub-arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'RC-004', name: 'Collector Road', description: 'Collector roads', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'RC-005', name: 'Local Street', description: 'Local streets', isActive: true, createdDate: '2024-01-15' },
  ],
  roadClass: [
    { id: 1, code: 'RCL-001', name: 'Class I', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RCL-002', name: 'Class II', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RCL-003', name: 'Class III', isActive: true, createdDate: '2024-01-15' },
  ],
  numberOfLanes: [
    { id: 1, code: 'LN-001', name: '1', description: '1 Lane', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LN-002', name: '2', description: '2 Lanes', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LN-004', name: '4', description: '4 Lanes', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LN-006', name: '6', description: '6 Lanes', isActive: true, createdDate: '2024-01-15' },
  ],
  surfaceType: [
    { id: 1, code: 'ST-001', name: 'Concrete (CC)', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ST-002', name: 'Bituminous', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'ST-003', name: 'Asphalt', isActive: true, createdDate: '2024-01-15' },
  ],
  trafficFlow: [
    { id: 1, code: 'TF-001', name: 'One-Way', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TF-002', name: 'Two-Way', isActive: true, createdDate: '2024-01-15' },
  ],
  medianType: [
    { id: 1, code: 'MT-001', name: 'Raised Median', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'MT-002', name: 'Painted Median', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'MT-004', name: 'No Median', isActive: true, createdDate: '2024-01-15' },
  ],
  footpathAvailability: [
    { id: 1, code: 'FP-001', name: 'Both Sides', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'FP-002', name: 'Left Side Only', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'FP-004', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  drainageSystem: [
    { id: 1, code: 'DS-001', name: 'Covered Drain', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'DS-002', name: 'Open Drain', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'DS-003', name: 'Underground Drainage', isActive: true, createdDate: '2024-01-15' },
  ],
  streetLighting: [
    { id: 1, code: 'SL-001', name: 'LED', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'SL-002', name: 'Solar', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'SL-004', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  roadMarking: [
    { id: 1, code: 'RM-001', name: 'Available', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RM-002', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  trafficSignals: [
    { id: 1, code: 'TS-001', name: 'Yes', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TS-002', name: 'No', isActive: true, createdDate: '2024-01-15' },
  ],
  parkingFacility: [
    { id: 1, code: 'PK-001', name: 'Both Sides', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'PK-002', name: 'One Side', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'PK-003', name: 'No Parking', isActive: true, createdDate: '2024-01-15' },
  ],
};

const BASE_MASTER_DATA: MasterDataConfig = {
  assetCategory: [
    { id: 1, code: 'AC-001', name: 'Building', description: 'Municipal buildings and structures', isActive: true, createdDate: '2024-01-15', templateKey: 'building' },
    { id: 2, code: 'AC-002', name: 'Land', description: 'Land parcels and plots', isActive: true, createdDate: '2024-01-15', templateKey: 'land' },
    { id: 3, code: 'AC-003', name: 'Infrastructure', description: 'Roads, bridges, and public infrastructure', isActive: true, createdDate: '2024-01-15', templateKey: 'infrastructure' },
    { id: 4, code: 'AC-004', name: 'Movable', description: 'Vehicles, equipment, and movable assets', isActive: true, createdDate: '2024-01-15', templateKey: 'movable' },
  ],
  assetType: [
    // Building Types
    { id: 101, code: 'AT-001', name: 'Municipal Office', description: 'Municipal office buildings', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 102, code: 'AT-002', name: 'Shopping Complex', description: 'Municipal shopping centers', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 103, code: 'AT-003', name: 'Market', description: 'Municipal markets', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 104, code: 'AT-004', name: 'Community Hall', description: 'Community gathering halls', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 105, code: 'AT-005', name: 'School', description: 'Municipal schools', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 106, code: 'AT-006', name: 'Hospital', description: 'Municipal hospitals', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 107, code: 'AT-007', name: 'Staff Quarters', description: 'Municipal staff quarters', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 108, code: 'AT-008', name: 'Ward Office', description: 'Municipal ward offices', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 109, code: 'AT-009', name: 'Library', description: 'Municipal libraries', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 110, code: 'AT-010', name: 'Fire Station', description: 'Municipal fire stations', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 111, code: 'AT-011', name: 'Sports Complex', description: 'Municipal sports complexes', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 112, code: 'AT-012', name: 'Public Toilet', description: 'Municipal public toilets', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 113, code: 'AT-013', name: 'Commercial Building', description: 'Municipal commercial buildings', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    { id: 114, code: 'AT-014', name: 'Parking Structure', description: 'Municipal parking structures', isActive: true, createdDate: '2024-01-15', parentCategory: 'Building' },
    
    // Land Types
    { id: 201, code: 'AT-101', name: 'Open Plot', description: 'Open plots', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },
    { id: 202, code: 'AT-102', name: 'Vacant Land', description: 'Empty land parcels', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },
    { id: 203, code: 'AT-103', name: 'Playground / Open Ground', description: 'Public playgrounds', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },
    { id: 204, code: 'AT-104', name: 'Reserved Land', description: 'Reserved land parcels', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },
    { id: 205, code: 'AT-105', name: 'Parking Plot', description: 'Land used for parking', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },
    { id: 206, code: 'AT-106', name: 'Public Park/Garden', description: 'Public parks and gardens', isActive: true, createdDate: '2024-01-15', parentCategory: 'Land' },

    // Infrastructure Types
    { id: 301, code: 'AT-201', name: 'Road', description: 'Municipal roads', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 302, code: 'AT-202', name: 'Bridge', description: 'Municipal bridges', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 303, code: 'AT-203', name: 'Water Tank', description: 'Water storage facilities', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 304, code: 'AT-204', name: 'Street Light', description: 'Public street lighting', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 305, code: 'AT-205', name: 'Drainage System', description: 'Municipal drainage systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 306, code: 'AT-206', name: 'Water Supply Line', description: 'Water distribution lines', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 307, code: 'AT-207', name: 'Sewage System', description: 'Sewage disposal systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 308, code: 'AT-208', name: 'Public Well', description: 'Municipal public wells', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 309, code: 'AT-209', name: 'Community Center', description: 'Public community centers', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },
    { id: 310, code: 'AT-210', name: 'Bus Stop/Shelter', description: 'Public bus stops', isActive: true, createdDate: '2024-01-15', parentCategory: 'Infrastructure' },

    // Movable Types
    { id: 401, code: 'AT-301', name: 'Vehicle', description: 'Municipal vehicles', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
    { id: 402, code: 'AT-302', name: 'Machinery', description: 'Municipal heavy machinery', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
    { id: 403, code: 'AT-303', name: 'Equipment', description: 'General equipment', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
    { id: 404, code: 'AT-304', name: 'Furniture', description: 'Office furniture', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
    { id: 405, code: 'AT-305', name: 'Computer/IT Equipment', description: 'IT infrastructure', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
    { id: 406, code: 'AT-306', name: 'Tools', description: 'Maintenance tools', isActive: true, createdDate: '2024-01-15', parentCategory: 'Movable' },
  ],
  zone: [
    { id: 1, code: 'Z-001', name: 'Zone A - Central', description: 'Central municipal zone', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'Z-002', name: 'Zone B - West', description: 'Western municipal zone', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'Z-003', name: 'Zone C - North', description: 'Northern municipal zone', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'Z-004', name: 'Zone D - South', description: 'Southern municipal zone', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'Z-005', name: 'Zone E - East', description: 'Eastern municipal zone', isActive: true, createdDate: '2024-01-15' },
    { id: 6, code: 'Z-006', name: 'Zone F - Southwest', description: 'Southwest municipal zone', isActive: true, createdDate: '2024-01-15' },
  ],
  ward: [
    { id: 1, code: 'W-001', name: 'Ward 1', description: 'Ward 1', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 2, code: 'W-002', name: 'Ward 2', description: 'Ward 2', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 3, code: 'W-003', name: 'Ward 3', description: 'Ward 3', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone D - South' },
    { id: 4, code: 'W-004', name: 'Ward 4', description: 'Ward 4', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone E - East' },
    { id: 5, code: 'W-005', name: 'Ward 5', description: 'Ward 5', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone D - South' },
    { id: 6, code: 'W-006', name: 'Ward 7', description: 'Ward 7', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone E - East' },
    { id: 7, code: 'W-007', name: 'Ward 8', description: 'Ward 8', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone C - North' },
    { id: 8, code: 'W-008', name: 'Ward 9', description: 'Ward 9', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone C - North' },
    { id: 9, code: 'W-009', name: 'Ward 10', description: 'Ward 10', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone B - West' },
    { id: 10, code: 'W-010', name: 'Ward 11', description: 'Ward 11', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 11, code: 'W-011', name: 'Ward 12', description: 'Ward 12', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 12, code: 'W-012', name: 'Ward 13', description: 'Ward 13', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone F - Southwest' },
    { id: 13, code: 'W-013', name: 'Ward 14', description: 'Ward 14', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 14, code: 'W-014', name: 'Ward 15', description: 'Ward 15', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 15, code: 'W-015', name: 'Ward 16', description: 'Ward 16', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone B - West' },
    { id: 16, code: 'W-016', name: 'Ward 17', description: 'Ward 17', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 17, code: 'W-017', name: 'Ward 18', description: 'Ward 18', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone E - East' },
    { id: 18, code: 'W-018', name: 'Ward 19', description: 'Ward 19', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone A - Central' },
    { id: 19, code: 'W-019', name: 'Ward 20', description: 'Ward 20', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone D - South' },
    { id: 20, code: 'W-020', name: 'Ward 21', description: 'Ward 21', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone D - South' },
    { id: 21, code: 'W-021', name: 'Ward 22', description: 'Ward 22', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone B - West' },
    { id: 22, code: 'W-022', name: 'Ward 23', description: 'Ward 23', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone E - East' },
    { id: 23, code: 'W-023', name: 'Ward 25', description: 'Ward 25', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone C - North' },
    { id: 24, code: 'W-024', name: 'Ward 26', description: 'Ward 26', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone B - West' },
    { id: 25, code: 'W-025', name: 'Ward 28', description: 'Ward 28', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone C - North' },
    { id: 26, code: 'W-026', name: 'Ward 30', description: 'Ward 30', isActive: true, createdDate: '2024-01-15', parentCategory: 'Zone F - Southwest' },
  ],
  propertyCategory: [
    { id: 1, code: 'PC-001', name: 'Residential', description: 'Residential properties', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'PC-002', name: 'Commercial', description: 'Commercial properties', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'PC-003', name: 'Industrial', description: 'Industrial properties', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'PC-004', name: 'Mixed Use', description: 'Mixed use properties', isActive: true, createdDate: '2024-01-15' },
  ],
  propertySubCategory: [
    { id: 1, code: 'PSC-001', name: 'Shopping Shops', description: 'Shopping shops', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
    { id: 2, code: 'PSC-002', name: 'Food Court', description: 'Food courts', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
    { id: 3, code: 'PSC-003', name: 'Entertainment', description: 'Entertainment facilities', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
  ],
  owningDepartment: [
    { id: 1, code: 'DEPT-001', name: 'General Administration', description: 'General administration department', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'DEPT-002', name: 'Public Works', description: 'Public works department', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'DEPT-003', name: 'Education', description: 'Education department', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'DEPT-004', name: 'Health', description: 'Health department', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'DEPT-005', name: 'Fire Department', description: 'Fire department', isActive: true, createdDate: '2024-01-15' },
    { id: 6, code: 'DEPT-006', name: 'Town Planning', description: 'Town planning department', isActive: true, createdDate: '2024-01-15' },
  ],
  ownershipType: [
    { id: 1, code: 'OT-001', name: 'Municipal', description: 'Municipal property', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'OT-002', name: 'Government', description: 'Government property', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'OT-003', name: 'Leased', description: 'Leased property', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'OT-004', name: 'Private', description: 'Private property', isActive: true, createdDate: '2024-01-15' },
  ],
  maintainingDepartment: [
    { id: 1, code: 'MDEPT-001', name: 'General Administration', description: 'General administration maintenance', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'MDEPT-002', name: 'Public Works', description: 'Public works maintenance', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'MDEPT-003', name: 'Electrical Department', description: 'Electrical systems maintenance', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'MDEPT-004', name: 'Water Supply', description: 'Water infrastructure maintenance', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'MDEPT-005', name: 'Health Department', description: 'Health asset maintenance', isActive: true, createdDate: '2024-01-15' },
    { id: 6, code: 'MDEPT-006', name: 'Estate Management', description: 'Estate upkeep and maintenance', isActive: true, createdDate: '2024-01-15' },
  ],
  inventoryType: [
    { id: 1, code: 'IT-001', name: 'Office Supplies', description: 'General office supplies', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'IT-002', name: 'IT Equipment', description: 'Computer and IT equipment', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'IT-003', name: 'Furniture', description: 'Office furniture', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'IT-004', name: 'Cleaning Supplies', description: 'Cleaning materials', isActive: true, createdDate: '2024-01-15' },
  ],
  inventorySubType: [
    { id: 1, code: 'IST-001', name: 'Stationery', description: 'Writing materials', isActive: true, createdDate: '2024-01-15', parentCategory: 'Office Supplies' },
    { id: 2, code: 'IST-002', name: 'Desktop Computer', description: 'Desktop computers', isActive: true, createdDate: '2024-01-15', parentCategory: 'IT Equipment' },
    { id: 3, code: 'IST-003', name: 'Laptop', description: 'Laptop computers', isActive: true, createdDate: '2024-01-15', parentCategory: 'IT Equipment' },
    { id: 4, code: 'IST-004', name: 'Office Chair', description: 'Office seating', isActive: true, createdDate: '2024-01-15', parentCategory: 'Furniture' },
  ],
  furnitureItemName: [
    { id: 1, code: 'FIN-001', name: 'Office Tables', description: 'Common office tables', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 2, code: 'FIN-002', name: 'Chairs (Executive)', description: 'Executive chairs', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 3, code: 'FIN-003', name: 'Chairs (Staff)', description: 'Staff chairs', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 4, code: 'FIN-004', name: 'Filing Cabinets', description: 'File storage cabinets', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 5, code: 'FIN-005', name: 'Patient Beds', description: 'Hospital beds', isActive: true, createdDate: '2024-01-15', parentCategory: 'Hospital' },
    { id: 6, code: 'FIN-006', name: 'Student Desks', description: 'Student desks', isActive: true, createdDate: '2024-01-15', parentCategory: 'School' },
    { id: 7, code: 'FIN-007', name: 'Wardrobes', description: 'Wardrobe storage', isActive: true, createdDate: '2024-01-15', parentCategory: 'Staff Quarters' },
    { id: 8, code: 'FIN-008', name: 'Shop Counters', description: 'Commercial counters', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
    { id: 9, code: 'FIN-009', name: 'Reception Desk', description: 'Reception desk', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 10, code: 'FIN-010', name: 'Book Shelves', description: 'Book and file shelves', isActive: true, createdDate: '2024-01-15', parentCategory: 'Library' },
  ],
  furnitureTypeModel: [
    { id: 1, code: 'FTM-001', name: 'Wooden', description: 'Wooden finish', isActive: true, createdDate: '2024-01-15', parentCategory: 'Office Tables' },
    { id: 2, code: 'FTM-002', name: 'Steel', description: 'Steel finish', isActive: true, createdDate: '2024-01-15', parentCategory: 'Office Tables' },
    { id: 3, code: 'FTM-003', name: 'Ergonomic', description: 'Ergonomic executive chair', isActive: true, createdDate: '2024-01-15', parentCategory: 'Chairs (Executive)' },
    { id: 4, code: 'FTM-004', name: 'Mesh Back', description: 'Mesh back chair', isActive: true, createdDate: '2024-01-15', parentCategory: 'Chairs (Staff)' },
    { id: 5, code: 'FTM-005', name: '4-Drawer Steel', description: 'Four drawer cabinet', isActive: true, createdDate: '2024-01-15', parentCategory: 'Filing Cabinets' },
    { id: 6, code: 'FTM-006', name: 'Manual', description: 'Manual patient bed', isActive: true, createdDate: '2024-01-15', parentCategory: 'Patient Beds' },
    { id: 7, code: 'FTM-007', name: 'Single Seater', description: 'Single student desk', isActive: true, createdDate: '2024-01-15', parentCategory: 'Student Desks' },
    { id: 8, code: 'FTM-008', name: '2-Door Wooden', description: '2-door wardrobe', isActive: true, createdDate: '2024-01-15', parentCategory: 'Wardrobes' },
    { id: 9, code: 'FTM-009', name: 'Modular', description: 'Modular shop counter', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shop Counters' },
    { id: 10, code: 'FTM-010', name: 'Steel (5-Tier)', description: 'Steel shelves', isActive: true, createdDate: '2024-01-15', parentCategory: 'Book Shelves' },
  ],
  equipmentName: [
    { id: 1, code: 'EQN-001', name: 'Desktop Computers', description: 'Desktop systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 2, code: 'EQN-002', name: 'Laptops', description: 'Laptop systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 3, code: 'EQN-003', name: 'Printers', description: 'Printers', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 4, code: 'EQN-004', name: 'Scanners', description: 'Scanners', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 5, code: 'EQN-005', name: 'UPS Systems', description: 'UPS systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 6, code: 'EQN-006', name: 'Biometric Devices', description: 'Biometric devices', isActive: true, createdDate: '2024-01-15', parentCategory: 'Municipal Office' },
    { id: 7, code: 'EQN-007', name: 'CCTV Systems', description: 'CCTV systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Common' },
    { id: 8, code: 'EQN-008', name: 'Projectors', description: 'Projectors', isActive: true, createdDate: '2024-01-15', parentCategory: 'School' },
    { id: 9, code: 'EQN-009', name: 'POS Systems', description: 'Point-of-sale systems', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
    { id: 10, code: 'EQN-010', name: 'Fire Alarm Control Panels', description: 'Fire alarm panels', isActive: true, createdDate: '2024-01-15', parentCategory: 'Shopping Complex' },
  ],
  equipmentBrandModel: [
    { id: 1, code: 'EBM-001', name: 'Dell OptiPlex', description: 'Dell desktop', isActive: true, createdDate: '2024-01-15', parentCategory: 'Desktop Computers' },
    { id: 2, code: 'EBM-002', name: 'HP ProDesk', description: 'HP desktop', isActive: true, createdDate: '2024-01-15', parentCategory: 'Desktop Computers' },
    { id: 3, code: 'EBM-003', name: 'Lenovo ThinkPad', description: 'Lenovo laptop', isActive: true, createdDate: '2024-01-15', parentCategory: 'Laptops' },
    { id: 4, code: 'EBM-004', name: 'HP LaserJet', description: 'HP printer', isActive: true, createdDate: '2024-01-15', parentCategory: 'Printers' },
    { id: 5, code: 'EBM-005', name: 'Canon CanoScan', description: 'Canon scanner', isActive: true, createdDate: '2024-01-15', parentCategory: 'Scanners' },
    { id: 6, code: 'EBM-006', name: 'APC Back-UPS', description: 'APC UPS', isActive: true, createdDate: '2024-01-15', parentCategory: 'UPS Systems' },
    { id: 7, code: 'EBM-007', name: 'ZKTeco MB360', description: 'Biometric device', isActive: true, createdDate: '2024-01-15', parentCategory: 'Biometric Devices' },
    { id: 8, code: 'EBM-008', name: 'Hikvision DS Series', description: 'CCTV model', isActive: true, createdDate: '2024-01-15', parentCategory: 'CCTV Systems' },
    { id: 9, code: 'EBM-009', name: 'Posiflex XT Series', description: 'POS terminal', isActive: true, createdDate: '2024-01-15', parentCategory: 'POS Systems' },
    { id: 10, code: 'EBM-010', name: 'Honeywell Notifier', description: 'Fire alarm panel', isActive: true, createdDate: '2024-01-15', parentCategory: 'Fire Alarm Control Panels' },
  ],
  inventoryCondition: [
    { id: 1, code: 'IC-001', name: 'Excellent', description: 'Excellent condition', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'IC-002', name: 'Good', description: 'Good condition', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'IC-003', name: 'Fair', description: 'Fair condition', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'IC-004', name: 'Poor', description: 'Poor condition', isActive: true, createdDate: '2024-01-15' },
  ],
  equipmentStatus: [
    { id: 1, code: 'ES-001', name: 'Working', description: 'Equipment is working', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ES-002', name: 'Not Working', description: 'Equipment is not working', isActive: true, createdDate: '2024-01-15' },
  ],
  rentFrequency: [
    { id: 1, code: 'RF-001', name: 'Monthly', description: 'Rent collected every month', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RF-002', name: 'Quarterly', description: 'Rent collected every quarter', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RF-003', name: 'Half-Yearly', description: 'Rent collected twice a year', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'RF-004', name: 'Yearly', description: 'Rent collected annually', isActive: true, createdDate: '2024-01-15' },
  ],
  depositType: [
    { id: 1, code: 'DT-001', name: 'Security Deposit', description: 'Refundable security deposit', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'DT-002', name: 'Processing Fee', description: 'Non-refundable processing fee', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'DT-003', name: 'Registration Fee', description: 'Registration charges', isActive: true, createdDate: '2024-01-15' },
  ],
  landClassification: [
    { id: 1, code: 'LC-001', name: 'Agricultural', description: 'Agricultural land', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LC-002', name: 'Non-Agricultural', description: 'Non-agricultural land', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LC-003', name: 'Residential', description: 'Residential land use', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LC-004', name: 'Commercial', description: 'Commercial land use', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'LC-005', name: 'Industrial', description: 'Industrial land use', isActive: true, createdDate: '2024-01-15' },
  ],
  plotBoundaryType: [
    { id: 1, code: 'PB-001', name: 'Compound Wall', description: 'Brick/cement compound wall', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'PB-002', name: 'Fencing', description: 'Metal/wire fencing', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'PB-003', name: 'Natural Boundary', description: 'Natural boundaries (river, hill)', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'PB-004', name: 'Road', description: 'Road as boundary', isActive: true, createdDate: '2024-01-15' },
  ],
  yesNo: [
    { id: 1, code: 'YN-001', name: 'Yes', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'YN-002', name: 'No', isActive: true, createdDate: '2024-01-15' },
  ],
  landAreaUnit: [
    { id: 1, code: 'AU-001', name: 'Sq.m', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'AU-002', name: 'Sq.ft', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'AU-003', name: 'Acre', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'AU-004', name: 'Hectare', isActive: true, createdDate: '2024-01-15' },
  ],
  landShape: [
    { id: 1, code: 'LS-001', name: 'Regular', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LS-002', name: 'Irregular', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LS-003', name: 'Rectangular', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LS-004', name: 'Square', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'LS-005', name: 'Triangular', isActive: true, createdDate: '2024-01-15' },
    { id: 6, code: 'LS-006', name: 'Other', isActive: true, createdDate: '2024-01-15' },
  ],
  encumbranceStatus: [
    { id: 1, code: 'EN-001', name: 'Free', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'EN-002', name: 'Encumbered', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'EN-003', name: 'Partially Encumbered', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'EN-004', name: 'Under Litigation', isActive: true, createdDate: '2024-01-15' },
  ],
  terrainType: [
    { id: 1, code: 'TT-001', name: 'Flat', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TT-002', name: 'Sloping', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'TT-003', name: 'Uneven', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'TT-004', name: 'Rocky', isActive: true, createdDate: '2024-01-15' },
  ],
  approachRoadType: [
    { id: 1, code: 'ART-001', name: 'CC (Cement Concrete)', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ART-002', name: 'BT (Bituminous)', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'ART-003', name: 'WBM (Water Bound Macadam)', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'ART-004', name: 'Kachha', isActive: true, createdDate: '2024-01-15' },
  ],
  surroundingDevelopment: [
    { id: 1, code: 'SD-001', name: 'Residential', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'SD-002', name: 'Commercial', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'SD-003', name: 'Open', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'SD-004', name: 'Agricultural', isActive: true, createdDate: '2024-01-15' },
  ],
  currentLandUsage: [
    { id: 1, code: 'CLU-001', name: 'Vacant', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'CLU-002', name: 'Parking', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'CLU-003', name: 'Garden', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'CLU-004', name: 'Temporary Use', isActive: true, createdDate: '2024-01-15' },
  ],
  buildableStatus: [
    { id: 1, code: 'BS-001', name: 'Buildable', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'BS-002', name: 'Restricted', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'BS-003', name: 'Non-Buildable', isActive: true, createdDate: '2024-01-15' },
  ],
  floodProneArea: [
    { id: 1, code: 'FPA-001', name: 'Yes', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'FPA-002', name: 'No', isActive: true, createdDate: '2024-01-15' },
  ],
  condition: [
    { id: 1, code: 'COND-001', name: 'Excellent', description: 'Excellent condition', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'COND-002', name: 'Good', description: 'Good condition', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'COND-003', name: 'Fair', description: 'Fair condition', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'COND-004', name: 'Poor', description: 'Poor condition - needs repair', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'COND-005', name: 'Dilapidated', description: 'Dilapidated - major repairs needed', isActive: true, createdDate: '2024-01-15' },
  ],
  roadCategory: [
    { id: 1, code: 'RC-001', name: 'Main Road', description: 'Main arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RC-002', name: 'Arterial Road', description: 'Arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RC-003', name: 'Sub-Arterial Road', description: 'Sub-arterial roads', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'RC-004', name: 'Collector Road', description: 'Collector roads', isActive: true, createdDate: '2024-01-15' },
    { id: 5, code: 'RC-005', name: 'Local Street', description: 'Local streets', isActive: true, createdDate: '2024-01-15' },
  ],
  roadClass: [
    { id: 1, code: 'RCL-001', name: 'Class I', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RCL-002', name: 'Class II', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'RCL-003', name: 'Class III', isActive: true, createdDate: '2024-01-15' },
  ],
  numberOfLanes: [
    { id: 1, code: 'LN-001', name: '1', description: '1 Lane', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'LN-002', name: '2', description: '2 Lanes', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'LN-004', name: '4', description: '4 Lanes', isActive: true, createdDate: '2024-01-15' },
    { id: 4, code: 'LN-006', name: '6', description: '6 Lanes', isActive: true, createdDate: '2024-01-15' },
  ],
  surfaceType: [
    { id: 1, code: 'ST-001', name: 'Concrete (CC)', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'ST-002', name: 'Bituminous', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'ST-003', name: 'Asphalt', isActive: true, createdDate: '2024-01-15' },
  ],
  trafficFlow: [
    { id: 1, code: 'TF-001', name: 'One-Way', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TF-002', name: 'Two-Way', isActive: true, createdDate: '2024-01-15' },
  ],
  medianType: [
    { id: 1, code: 'MT-001', name: 'Raised Median', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'MT-002', name: 'Painted Median', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'MT-004', name: 'No Median', isActive: true, createdDate: '2024-01-15' },
  ],
  footpathAvailability: [
    { id: 1, code: 'FP-001', name: 'Both Sides', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'FP-002', name: 'Left Side Only', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'FP-004', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  drainageSystem: [
    { id: 1, code: 'DS-001', name: 'Covered Drain', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'DS-002', name: 'Open Drain', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'DS-003', name: 'Underground Drainage', isActive: true, createdDate: '2024-01-15' },
  ],
  streetLighting: [
    { id: 1, code: 'SL-001', name: 'LED', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'SL-002', name: 'Solar', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'SL-004', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  roadMarking: [
    { id: 1, code: 'RM-001', name: 'Available', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'RM-002', name: 'Not Available', isActive: true, createdDate: '2024-01-15' },
  ],
  trafficSignals: [
    { id: 1, code: 'TS-001', name: 'Yes', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'TS-002', name: 'No', isActive: true, createdDate: '2024-01-15' },
  ],
  parkingFacility: [
    { id: 1, code: 'PK-001', name: 'Both Sides', isActive: true, createdDate: '2024-01-15' },
    { id: 2, code: 'PK-002', name: 'One Side', isActive: true, createdDate: '2024-01-15' },
    { id: 3, code: 'PK-003', name: 'No Parking', isActive: true, createdDate: '2024-01-15' },
  ],

};

const STORAGE_KEY = 'mc_ems_configuration_master_data';
export const MASTER_DATA_STORAGE_KEY = STORAGE_KEY;
export const MASTER_DATA_CHANGE_EVENT = 'configurationMasterChange';

const cloneMasterData = (data: MasterDataConfig): MasterDataConfig =>
  JSON.parse(JSON.stringify(data)) as MasterDataConfig;

export const getDefaultMasterData = (): MasterDataConfig => cloneMasterData(BASE_MASTER_DATA);

const mergeWithDefaultMasterData = (storedData: Partial<MasterDataConfig>): MasterDataConfig => {
  const defaults = getDefaultMasterData();

  (Object.keys(defaults) as Array<keyof MasterDataConfig>).forEach((key) => {
    const storedValue = storedData[key];
    if (Array.isArray(storedValue) && storedValue.length > 0) {
      defaults[key] = storedValue;
    }
  });

  return defaults;
};

export const persistMasterData = (data: MasterDataConfig): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(MASTER_DATA_CHANGE_EVENT, { detail: data }));
  } catch (error) {
    console.error('Failed to persist configuration master data:', error);
  }
};

export const loadMasterData = (): MasterDataConfig => {
  const defaults = getDefaultMasterData();

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      persistMasterData(defaults);
      return defaults;
    }

    const parsed = mergeWithDefaultMasterData(JSON.parse(stored) as Partial<MasterDataConfig>);
    return parsed;
  } catch (error) {
    console.error('Failed to load configuration master data:', error);
    persistMasterData(defaults);
    return defaults;
  }
};
