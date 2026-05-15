export const HARDCODED_ASSET_DATA: Record<string, any> = {
  LAND: {
    label: "Land Assets",
    types: {
      OPEN_PLOT: {
        label: "Open Plots",
        sections: [
          {
            id: "sec_l1",
            label: "Dimensions & Area",
            fields: [
              { name: "landArea", label: "Land Area (sqm)", type: "number" },
              { name: "landLength", label: "Land Length (m)", type: "number" },
              { name: "landWidth", label: "Land Width (m)", type: "number" }
            ]
          },
          {
            id: "sec_l2",
            label: "Legal & Zoning",
            fields: [
              { name: "surveyNumber", label: "Survey Number", type: "text" },
              { name: "landType", label: "Land Type", type: "select", options: ["Freehold", "Leasehold"] },
              { name: "zoningType", label: "Zoning Type", type: "select", options: ["Residential", "Commercial", "Industrial", "Mixed"] },
              { name: "encroachmentStatus", label: "Encroachment Status", type: "select", options: ["None", "Partial", "Full"] }
            ]
          },
          {
            id: "sec_l3",
            label: "Site Details",
            fields: [
              { name: "boundaryDetails", label: "Boundary Details", type: "text" },
              { name: "roadAccess", label: "Road Access", type: "checkbox" },
              { name: "currentUsage", label: "Current Usage", type: "text" },
              { name: "marketValue", label: "Market Value", type: "number" }
            ]
          }
        ],
        documents: ["7/12 Extract", "Property Card", "Sale Deed", "Layout Plan", "GIS Map", "Encumbrance Certificate"]
      },
      RESERVED_LAND: {
        label: "Reserved Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "landLength", label: "Land Length (m)", type: "number" },
          { name: "landWidth", label: "Land Width (m)", type: "number" },
          { name: "reservedPurpose", label: "Reserved Purpose", type: "text" },
          { name: "authorityName", label: "Authority Name", type: "text" },
          { name: "notificationDate", label: "Notification Date", type: "date" },
          { name: "currentUsage", label: "Current Usage", type: "text" },
          { name: "encroachmentStatus", label: "Encroachment Status", type: "select", options: ["None", "Partial", "Full"] }
        ],
        documents: ["Reservation Notification", "Development Plan Extract", "7/12 Extract", "Authority Approval Letter", "Land Record Map"]
      },
      ENCROACHED_LAND: {
        label: "Encroached Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "encroacherName", label: "Encroacher Name", type: "text" },
          { name: "encroachmentType", label: "Encroachment Type", type: "text" },
          { name: "encroachmentArea", label: "Encroachment Area (sqm)", type: "number" },
          { name: "legalStatus", label: "Legal Status", type: "select", options: ["Pending", "In Court", "Resolved"] },
          { name: "noticeIssued", label: "Notice Issued", type: "checkbox" },
          { name: "evictionStatus", label: "Eviction Status", type: "text" },
          { name: "currentUsage", label: "Current Usage", type: "text" }
        ],
        documents: ["Encroachment Report", "Notice Copy", "Survey Report", "Photographic Evidence", "Legal Case Documents"]
      },
      AGRICULTURAL_LAND: {
        label: "Agricultural Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "soilType", label: "Soil Type", type: "text" },
          { name: "waterSource", label: "Water Source", type: "text" },
          { name: "cropType", label: "Crop Type", type: "text" },
          { name: "irrigationType", label: "Irrigation Type", type: "text" },
          { name: "annualYield", label: "Annual Yield", type: "number" },
          { name: "currentUsage", label: "Current Usage", type: "text" }
        ],
        documents: ["7/12 Extract", "Crop Record", "Irrigation Record", "Soil Report", "Land Ownership Document"]
      },
      COMMERCIAL_LAND: {
        label: "Commercial Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "zoningType", label: "Zoning Type", type: "text" },
          { name: "commercialUseType", label: "Commercial Use Type", type: "text" },
          { name: "leaseStatus", label: "Lease Status", type: "select", options: ["Active", "Expired", "None"] },
          { name: "tenantDetails", label: "Tenant Details", type: "text" },
          { name: "rentalIncome", label: "Rental Income", type: "number" },
          { name: "marketValue", label: "Market Value", type: "number" }
        ],
        documents: ["Sale Deed", "Lease Agreement", "Property Tax Record", "Zoning Approval", "Rental Agreement"]
      },
      RESIDENTIAL_LAND: {
        label: "Residential Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "layoutApprovalStatus", label: "Layout Approval Status", type: "select", options: ["Approved", "Pending", "Rejected"] },
          { name: "plotCount", label: "Plot Count", type: "number" },
          { name: "allotmentStatus", label: "Allotment Status", type: "text" },
          { name: "occupancyStatus", label: "Occupancy Status", type: "select", options: ["Occupied", "Vacant"] },
          { name: "marketValue", label: "Market Value", type: "number" }
        ],
        documents: ["Layout Approval", "7/12 Extract", "Allotment Letter", "Property Card", "Development Permission"]
      },
      INDUSTRIAL_LAND: {
        label: "Industrial Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "industrialZoneType", label: "Industrial Zone Type", type: "text" },
          { name: "industryType", label: "Industry Type", type: "text" },
          { name: "pollutionCategory", label: "Pollution Category", type: "select", options: ["Red", "Orange", "Green", "White"] },
          { name: "leaseStatus", label: "Lease Status", type: "text" },
          { name: "tenantDetails", label: "Tenant Details", type: "text" },
          { name: "infrastructureAvailability", label: "Infrastructure Availability", type: "text" }
        ],
        documents: ["Industrial Approval Certificate", "Pollution Control NOC", "Lease Agreement", "Land Allotment Letter", "Factory License"]
      },
      GARDEN_PARK: {
        label: "Garden/Park Land",
        fields: [
          { name: "surveyNumber", label: "Survey Number", type: "text" },
          { name: "landArea", label: "Land Area (sqm)", type: "number" },
          { name: "parkName", label: "Park Name", type: "text" },
          { name: "treeCount", label: "Tree Count", type: "number" },
          { name: "facilitiesAvailable", label: "Facilities Available", type: "text" },
          { name: "maintenanceAgency", label: "Maintenance Agency", type: "text" },
          { name: "publicAccess", label: "Public Access", type: "checkbox" },
          { name: "waterSource", label: "Water Source", type: "text" }
        ],
        documents: ["Survey Map", "Encroachment Report", "Usage Permission", "Municipal Approval"]
      }
    }
  },
  BUILDING: {
    label: "Building Assets",
    types: {
      ADMINISTRATIVE: {
        label: "Administrative Buildings",
        fields: [
          { name: "buildingName", label: "Building Name", type: "text" },
          { name: "serviceType", label: "Service Type", type: "text" },
          { name: "noOfFloors", label: "No Of Floors", type: "number" },
          { name: "builtUpArea", label: "Built Up Area", type: "number" },
          { name: "operatingHours", label: "Operating Hours", type: "text" },
          { name: "maintenanceAgency", label: "Maintenance Agency", type: "text" },
          { name: "waterConnection", label: "Water Connection", type: "checkbox" },
          { name: "electricityConnectionNo", label: "Electricity Connection No", type: "text" }
        ],
        documents: ["Building Plan Approval", "Completion Certificate", "Property Tax Record", "Electricity Bill", "Water Bill"]
      },
      HEALTH: {
        label: "Health Buildings",
        fields: [
          { name: "buildingName", label: "Building Name", type: "text" },
          { name: "serviceType", label: "Service Type", type: "text" },
          { name: "noOfFloors", label: "No Of Floors", type: "number" },
          { name: "builtUpArea", label: "Built Up Area", type: "number" },
          { name: "operatingHours", label: "Operating Hours", type: "text" },
          { name: "maintenanceAgency", label: "Maintenance Agency", type: "text" },
          { name: "waterConnection", label: "Water Connection", type: "checkbox" },
          { name: "electricityConnectionNo", label: "Electricity Connection No", type: "text" }
        ],
        documents: ["Hospital License", "Fire NOC", "Health Department Approval", "Biomedical Waste Certificate", "Building Completion Certificate"]
      },
      EDUCATION: {
        label: "Education Buildings",
        fields: [
          { name: "buildingName", label: "Building Name", type: "text" },
          { name: "noOfFloors", label: "No Of Floors", type: "number" },
          { name: "builtUpArea", label: "Built Up Area", type: "number" },
          { name: "constructionYear", label: "Construction Year", type: "number" },
          { name: "schoolType", label: "School Type", type: "select", options: ["Primary", "Secondary", "Higher Secondary"] },
          { name: "studentCapacity", label: "Student Capacity", type: "number" },
          { name: "playgroundAvailable", label: "Playground Available", type: "checkbox" }
        ],
        documents: ["School Recognition Certificate", "Building Safety Certificate", "Fire NOC", "Sanitation Certificate", "Approval from Education Board"]
      },
      RESIDENTIAL: {
        label: "Residential Buildings",
        fields: [
          { name: "buildingName", label: "Building Name", type: "text" },
          { name: "noOfUnits", label: "No Of Units", type: "number" },
          { name: "occupancyStatus", label: "Occupancy Status", type: "select", options: ["Occupied", "Vacant"] },
          { name: "allottedTo", label: "Allotted To", type: "text" },
          { name: "rentAmount", label: "Rent Amount", type: "number" },
          { name: "builtUpArea", label: "Built Up Area", type: "number" },
          { name: "constructionYear", label: "Construction Year", type: "number" }
        ],
        documents: ["Allotment Letter", "Rent Agreement", "Occupancy Certificate", "Property Tax Record"]
      },
      COMMERCIAL: {
        label: "Commercial Buildings",
        fields: [
          { name: "buildingName", label: "Building Name", type: "text" },
          { name: "shopCount", label: "Shop Count", type: "number" },
          { name: "occupancyStatus", label: "Occupancy Status", type: "select", options: ["Occupied", "Vacant"] },
          { name: "rentalIncome", label: "Rental Income", type: "number" },
          { name: "leaseType", label: "Lease Type", type: "text" },
          { name: "builtUpArea", label: "Built Up Area", type: "number" }
        ],
        documents: ["Trade License", "Lease Agreement", "Shops Allotment List", "Property Tax Record", "Fire NOC"]
      }
    }
  },
  INFRASTRUCTURE: {
    label: "Infrastructure Assets",
    types: {
      ROADS: {
        label: "Roads",
        sections: [
          {
            id: "sec_r1",
            label: "Physical Specifications",
            fields: [
              { name: "roadName", label: "Road Name", type: "text" },
              { name: "roadLength", label: "Road Length (km)", type: "number" },
              { name: "roadWidth", label: "Road Width (m)", type: "number" },
              { name: "surfaceType", label: "Surface Type", type: "select", options: ["Concrete", "Asphalt", "Dirt", "Gravel"] }
            ]
          },
          {
            id: "sec_r2",
            label: "Traffic & Maintenance",
            fields: [
              { name: "trafficDensity", label: "Traffic Density", type: "select", options: ["High", "Medium", "Low"] },
              { name: "lastMaintenanceDate", label: "Last Maintenance Date", type: "date" }
            ]
          }
        ],
        documents: ["Work Order", "DPR (Detailed Project Report)", "Completion Certificate", "Contract Agreement", "Maintenance Log"]
      },
      WATER_SUPPLY: {
        label: "Water Supply",
        sections: [
          {
            id: "sec_ws1",
            label: "Pipeline Details",
            fields: [
              { name: "pipelineLength", label: "Pipeline Length (m)", type: "number" },
              { name: "diameter", label: "Diameter (mm)", type: "number" },
              { name: "materialType", label: "Material Type", type: "text" }
            ]
          },
          {
            id: "sec_ws2",
            label: "Supply & Capacity",
            fields: [
              { name: "waterSource", label: "Water Source", type: "text" },
              { name: "supplyCapacity", label: "Supply Capacity (MLD)", type: "number" },
              { name: "lastInspectionDate", label: "Last Inspection Date", type: "date" }
            ]
          }
        ],
        documents: ["Pipeline Layout Map", "Work Order", "Completion Certificate", "Water Testing Report", "Maintenance Record"]
      },
      SEWERAGE_DRAINAGE: {
        label: "Sewerage & Drainage",
        sections: [
          {
            id: "sec_sd1",
            label: "Drainage Specifications",
            fields: [
              { name: "drainType", label: "Drain Type", type: "select", options: ["Open Drain", "Closed Pipeline", "Storm Water"] },
              { name: "length", label: "Length (m)", type: "number" },
              { name: "width", label: "Width (m)", type: "number" }
            ]
          },
          {
            id: "sec_sd2",
            label: "Operational Status",
            fields: [
              { name: "flowCapacity", label: "Flow Capacity", type: "number" },
              { name: "blockageStatus", label: "Blockage Status", type: "select", options: ["Clear", "Partial", "Critical"] },
              { name: "lastCleaningDate", label: "Last Cleaning Date", type: "date" }
            ]
          }
        ],
        documents: ["Drainage Plan", "Work Completion Report", "Inspection Report", "Maintenance Log"]
      },
      ELECTRICAL: {
        label: "Electrical Infrastructure",
        sections: [
          {
            id: "sec_el1",
            label: "Asset Identification",
            fields: [
              { name: "poleId", label: "Pole ID / Transformer No", type: "text" },
              { name: "poleType", label: "Pole/Tower Type", type: "text" },
              { name: "lightType", label: "Light/Lamp Type", type: "select", options: ["LED", "Sodium Vapor", "Solar"] }
            ]
          },
          {
            id: "sec_el2",
            label: "Power Configuration",
            fields: [
              { name: "transformerCapacity", label: "Transformer Capacity (kVA)", type: "number" },
              { name: "powerLoad", label: "Power Load (kW)", type: "number" },
              { name: "lastMaintenanceDate", label: "Last Maintenance Date", type: "date" }
            ]
          }
        ],
        documents: ["Installation Report", "Electricity Board Approval", "Maintenance Log", "Safety Certificate"]
      },
      URBAN_ENVIRONMENT: {
        label: "Urban Environment",
        sections: [
          {
            id: "sec_ue1",
            label: "Park & Greenery Details",
            fields: [
              { name: "parkName", label: "Park/Garden Name", type: "text" },
              { name: "areaSize", label: "Area Size (sqm)", type: "number" },
              { name: "treeCount", label: "Tree Count", type: "number" }
            ]
          },
          {
            id: "sec_ue2",
            label: "Management",
            fields: [
              { name: "facilityAvailable", label: "Facilities Available", type: "text" },
              { name: "maintenanceAgency", label: "Maintenance Agency", type: "text" }
            ]
          }
        ],
        documents: ["Development Plan", "Plantation Record", "Maintenance Agreement", "Inspection Report"]
      },
      WASTE_MANAGEMENT: {
        label: "Waste Management",
        sections: [
          {
            id: "sec_wm1",
            label: "Processing Details",
            fields: [
              { name: "wasteType", label: "Waste Type", type: "select", options: ["Solid", "Liquid", "Hazardous", "E-Waste"] },
              { name: "collectionFrequency", label: "Collection Frequency", type: "text" },
              { name: "processingMethod", label: "Processing Method", type: "text" }
            ]
          },
          {
            id: "sec_wm2",
            label: "Resource Allocation",
            fields: [
              { name: "capacity", label: "Capacity (Tons)", type: "number" },
              { name: "vehicleAssigned", label: "Vehicle Assigned", type: "text" }
            ]
          }
        ],
        documents: ["Waste Management License", "Vehicle Allocation Record", "Processing Plant Approval", "Inspection Report"]
      }
    }
  },
  MOVABLE: {
    label: "Movable Assets",
    types: {
      VEHICLES: {
        label: "Vehicles",
        sections: [
          {
            id: "sec_v1",
            label: "Registration & Identification",
            fields: [
              { name: "vehicleNo", label: "Vehicle Number", type: "text" },
              { name: "registrationNo", label: "Registration Number", type: "text" },
              { name: "driverAssigned", label: "Driver Assigned", type: "text" }
            ]
          },
          {
            id: "sec_v2",
            label: "Technical Specifications",
            fields: [
              { name: "engineNumber", label: "Engine Number", type: "text" },
              { name: "chassisNumber", label: "Chassis Number", type: "text" },
              { name: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric", "CNG"] }
            ]
          },
          {
            id: "sec_v3",
            label: "Compliance & Lifecycle",
            fields: [
              { name: "purchaseDate", label: "Purchase Date", type: "date" },
              { name: "insuranceExpiry", label: "Insurance Expiry", type: "date" },
              { name: "fitnessExpiry", label: "Fitness Expiry", type: "date" }
            ]
          }
        ],
        documents: ["RC Book", "Insurance Policy", "Fitness Certificate", "PUC Certificate", "Invoice/Purchase Bill"]
      },
      IT_ASSETS: {
        label: "IT Assets",
        sections: [
          {
            id: "sec_it1",
            label: "Device Identification",
            fields: [
              { name: "serialNumber", label: "Serial Number", type: "text" },
              { name: "brand", label: "Brand", type: "text" },
              { name: "model", label: "Model", type: "text" }
            ]
          },
          {
            id: "sec_it2",
            label: "Hardware Configuration",
            fields: [
              { name: "processor", label: "Processor", type: "text" },
              { name: "ram", label: "RAM", type: "text" },
              { name: "storage", label: "Storage", type: "text" }
            ]
          },
          {
            id: "sec_it3",
            label: "Support & Assignment",
            fields: [
              { name: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
              { name: "assignedTo", label: "Assigned To", type: "text" }
            ]
          }
        ],
        documents: ["Purchase Invoice", "Warranty Card", "AMC Agreement", "Installation Report"]
      },
      OFFICE_EQUIPMENT: {
        label: "Office Equipment",
        fields: [
          { name: "itemType", label: "Item Type", type: "text" },
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "condition", label: "Condition", type: "select", options: ["New", "Good", "Used", "Repair Required"] },
          { name: "assignedTo", label: "Assigned To", type: "text" },
          { name: "purchaseDate", label: "Purchase Date", type: "date" }
        ],
        documents: ["Purchase Invoice", "Warranty Card", "AMC Agreement", "Installation Report"]
      },
      MACHINERY_TOOLS: {
        label: "Machinery & Tools",
        fields: [
          { name: "machineType", label: "Machine Type", type: "text" },
          { name: "capacity", label: "Capacity", type: "text" },
          { name: "manufacturer", label: "Manufacturer", type: "text" },
          { name: "purchaseDate", label: "Purchase Date", type: "date" },
          { name: "serviceDate", label: "Last Service Date", type: "date" },
          { name: "operatorAssigned", label: "Operator Assigned", type: "text" }
        ],
        documents: ["Invoice/Warranty", "Insurance Card", "AMC Agreement", "Installation Report"]
      },
      MISCELLANEOUS: {
        label: "Miscellaneous",
        fields: [
          { name: "itemDescription", label: "Item Description", type: "text" },
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "condition", label: "Condition", type: "text" },
          { name: "remarks", label: "Remarks", type: "text" }
        ],
        documents: ["Purchase Invoice", "Warranty Document", "Stock Register Entry"]
      },
      CCTV_CAMERAS: {
        label: "CCTV Cameras",
        fields: [
          { name: "cameraType", label: "Camera Type", type: "text" },
          { name: "resolution", label: "Resolution", type: "text" },
          { name: "storageType", label: "Storage Type", type: "text" },
          { name: "installationDate", label: "Installation Date", type: "date" },
          { name: "vendorName", label: "Vendor Name", type: "text" },
          { name: "ipAddress", label: "IP Address", type: "text" }
        ],
        documents: ["Purchase Record", "Stock Entry", "Usage Log"]
      },
      IOT_SENSORS: {
        label: "IoT Sensors",
        fields: [
          { name: "sensorType", label: "Sensor Type", type: "text" },
          { name: "sensorModel", label: "Sensor Model", type: "text" },
          { name: "frequency", label: "Frequency", type: "text" },
          { name: "connectivityType", label: "Connectivity Type", type: "text" },
          { name: "batteryStatus", label: "Battery Status", type: "text" },
          { name: "installationDate", label: "Installation Date", type: "date" }
        ],
        documents: ["Installation Report", "AMC Agreement", "Vendor Contact", "Network Configuration Document"]
      },
      TRAFFIC_SIGNALS: {
        label: "Traffic Signals",
        fields: [
          { name: "signalType", label: "Signal Type", type: "text" },
          { name: "noOfTimers", label: "No Of Timers", type: "number" },
          { name: "powerBackup", label: "Power Backup", type: "checkbox" },
          { name: "operationalHours", label: "Operational Hours", type: "text" },
          { name: "installationDate", label: "Installation Date", type: "date" },
          { name: "maintenanceAgency", label: "Maintenance Agency", type: "text" }
        ],
        documents: ["Installation Certificate", "Service Agreement", "Calibration Report", "Maintenance Log"]
      }
    }
  }
};
