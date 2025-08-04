// post - Standard client creation
const post = {
  "name": "Acme Corporation",
  "email": "contact@acmecorp.com",
  "contactPerson": "John Doe",
  "contactPhone": "+1 (555) 123-4567",
  "address": "123 Business Ave, Suite 100, New York, NY 10001",
  "website": "https://www.acmecorp.com",
  "plan": "premium",
  "monthlyQuota": 5000,
  "notes": "Large enterprise client with multiple integration needs"
}

// put - Update client details
const put = {
  "name": "Acme Corporation Updated",
  "contactPerson": "Jane Smith",
  "contactPhone": "+1 (555) 987-6543",
  "plan": "enterprise",
  "monthlyQuota": 10000,
  "notes": "Upgraded to enterprise plan in May 2025"
}

// Additional client examples for various scenarios
const clients = [
  // Small Business Client
  {
    "name": "TechStart Solutions",
    "email": "info@techstart.io",
    "contactPerson": "Mark Johnson",
    "contactPhone": "+1 (212) 555-8899",
    "address": "45 Innovation Lane, San Francisco, CA 94107",
    "website": "https://www.techstart.io",
    "plan": "basic",
    "monthlyQuota": 1000,
    "notes": "Early-stage startup, potential for growth"
  },

  // Enterprise Client
  {
    "name": "Global Logistics Inc.",
    "email": "partnerships@globallogistics.com",
    "contactPerson": "Sarah Williams",
    "contactPhone": "+1 (404) 777-1234",
    "address": "1200 Corporate Boulevard, Atlanta, GA 30326",
    "website": "https://www.globallogistics.com",
    "plan": "enterprise",
    "monthlyQuota": 20000,
    "notes": "International shipping company, high volume API user"
  },

  // International Client
  {
    "name": "EuroTech Partners",
    "email": "operations@eurotech.eu",
    "contactPerson": "Hans Mueller",
    "contactPhone": "+49 30 5557890",
    "address": "Berliner Straße 45, 10969 Berlin, Germany",
    "website": "https://www.eurotech.eu",
    "plan": "premium",
    "monthlyQuota": 8000,
    "notes": "European operations, multiple integration points"
  },

  // Minimal Required Fields Client
  {
    "name": "Minimal Services",
    "email": "contact@minimal.co",
    "contactPerson": "Jane Minimal"
  },

  // Financial Services Client
  {
    "name": "SecurePay Financial",
    "email": "api@securepay.com",
    "contactPerson": "Robert Chen",
    "contactPhone": "+1 (415) 555-9876",
    "address": "888 Financial District, New York, NY 10005",
    "website": "https://www.securepay.com",
    "plan": "enterprise",
    "monthlyQuota": 15000,
    "notes": "Financial services provider, requires enhanced security"
  }
]

// API Key creation test data
const createApiKey = {
  "name": "Production API Key",
  "expiresAt": "2026-05-21T00:00:00.000Z",
  "permissions": {
    "allowedEndpoints": [
      "/api/v1/topup",
      "/api/v1/networks"
    ],
    "readOnly": false,
    "adminAccess": false
  },
  "ipRestrictions": [
    "203.0.113.1",
    "203.0.113.0/24"
  ]
}

// API Key update test data
const updateApiKey = {
  "name": "Production API Key (Updated)",
  "isActive": true,
  "permissions": {
    "allowedEndpoints": [
      "/api/v1/topup",
      "/api/v1/networks",
      "/api/v1/transactions"
    ],
    "readOnly": false
  },
  "ipRestrictions": [
    "203.0.113.1",
    "203.0.113.0/24",
    "198.51.100.0/24"
  ]
}

// Development API Key with limited permissions
const createDevApiKey = {
  "name": "Development API Key",
  "expiresAt": "2025-11-21T00:00:00.000Z",
  "permissions": {
    "allowedEndpoints": [
      "/api/v1/topup"
    ],
    "readOnly": true,
    "adminAccess": false
  },
  "ipRestrictions": [
    "127.0.0.1",
    "192.168.1.0/24"
  ]
}

// Test API Key with no restrictions
const createTestApiKey = {
  "name": "Test Environment Key",
  "expiresAt": "2025-08-21T00:00:00.000Z",
  "permissions": {
    "allowedEndpoints": ["*"],
    "readOnly": false,
    "adminAccess": false
  },
  "ipRestrictions": null
}

// Usage stats query parameters
const usageStatsQuery = {
  startDate: "2025-04-01",
  endDate: "2025-05-01"
}

// Invalid test cases for validation testing
const invalidData = {
  // Missing required fields
  missingRequiredFields: {
    "name": "Incomplete Client",
    // missing email and contactPerson
    "plan": "basic"
  },

  // Invalid email format
  invalidEmail: {
    "name": "Invalid Email Client",
    "email": "not-an-email",
    "contactPerson": "John Smith"
  },

  // Invalid phone format
  invalidPhone: {
    "name": "Bad Phone Client",
    "email": "contact@example.com",
    "contactPerson": "John Smith",
    "contactPhone": "not-a-phone"
  },

  // Invalid website URL
  invalidWebsite: {
    "name": "Bad Website Client",
    "email": "contact@example.com",
    "contactPerson": "John Smith",
    "website": "not-a-url"
  },

  // Invalid plan
  invalidPlan: {
    "name": "Bad Plan Client",
    "email": "contact@example.com",
    "contactPerson": "John Smith",
    "plan": "ultra" // not in allowed plans
  }
}

// Update scenarios
const updateScenarios = {
  // Deactivate client
  deactivate: {
    "isActive": false
  },

  // Change plan only
  changePlan: {
    "plan": "premium"
  },

  // Update contact info
  updateContact: {
    "contactPerson": "New Contact Person",
    "contactPhone": "+1 (888) 555-1234",
    "email": "newcontact@example.com"
  },

  // Update quota
  updateQuota: {
    "monthlyQuota": 12000
  }
}

export default {
  post,
  put,
  clients,
  createApiKey,
  updateApiKey,
  createDevApiKey,
  createTestApiKey,
  usageStatsQuery,
  invalidData,
  updateScenarios
}