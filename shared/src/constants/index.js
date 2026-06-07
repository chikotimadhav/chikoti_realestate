// ============================================================
// CHIKOTI REAL ESTATE — SHARED CONSTANTS
// Used by: buyer-portal, seller-portal, admin-portal, backend
// ============================================================

export const API_BASE_URL = {
  development: 'http://localhost:5000/api',
  production:  'https://api.chikotirealestate.com/api',
};

export const PORTALS = {
  buyer:  { dev: 'http://localhost:3001', prod: 'https://www.chikotirealestate.com'    },
  seller: { dev: 'http://localhost:3002', prod: 'https://chikoti-realestate-seller-portal.vercel.app/' },
  admin:  { dev: 'http://localhost:3003', prod: 'https://admin.chikotirealestate.com'  },
};

export const PROPERTY_TYPES   = ['Agriculture', 'Commercial', 'Residential'];
export const LISTING_TYPES    = ['Sale', 'Rent', 'Lease'];
export const PROPERTY_STATUSES = ['pending', 'approved', 'rejected'];

export const SOIL_TYPES    = ['Black Soil','Red Soil','Alluvial','Laterite','Sandy','Clay'];
export const WATER_SOURCES = ['Borewell','Open Well','Canal','River','Rainfed','Lake'];
export const FENCING_TYPES = ['Barbed Wire','Chain Link','Stone Wall','Compound Wall','No Fencing'];
export const AGRI_FACILITIES = ['Road Access','Market Nearby','Warehouse','Labour Available','Transport Facility','Irrigation Channel'];
export const COMM_AMENITIES  = ['Air Conditioning','Generator Backup','CCTV Security','Fire Safety','WiFi','Signage','Washroom'];
export const RES_AMENITIES   = ['Parking','Security','Gym','Swimming Pool','Lift','Garden','Club House','Play Area','Power Backup','Water Supply'];

export const FOOTFALL_OPTIONS    = ['Low', 'Medium', 'High'];
export const FURNISHING_OPTIONS  = ['Unfurnished', 'Semi-furnished', 'Fully Furnished'];
export const BUSINESS_TYPES      = ['Retail Shop','Office Space','Restaurant','Showroom','Warehouse'];

export const USER_ROLES = { ADMIN: 'admin', SELLER: 'seller', BUYER: 'buyer' };

export const STATUS_COLORS = {
  pending:  { bg: '#FEF3C7', text: '#D97706', label: 'Pending'  },
  approved: { bg: '#D1FAE5', text: '#059669', label: 'Approved' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Rejected' },
};

export const COMPANY = {
  name:    'Chikoti Real Estate',
  tagline: 'Your Trusted Partner in Property Investments',
  phone:   '+91 98765 43210',
  email:   'info@chikotirealestate.com',
  address: 'Hyderabad, Telangana, India',
  whatsapp:'919876543210',
  mapCenter: { lat: 17.385044, lng: 78.486671 },
};
