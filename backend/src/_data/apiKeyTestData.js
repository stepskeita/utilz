// Example API key creation data
const createExamples = [
  // Standard API key
  {
    "name": "Production API Key",
    "expiresAt": "2026-05-21T00:00:00.000Z",
    "permissions": {
      "allowedEndpoints": ["/api/v1/topup", "/api/v1/networks"],
      "readOnly": false,
      "adminAccess": false
    },
    "ipRestrictions": ["203.0.113.1", "192.168.1.0/24"]
  },

  // Development key with read-only access
  {
    "name": "Dev Key",
    "permissions": {
      "allowedEndpoints": ["/api/v1/topup"],
      "readOnly": true,
      "adminAccess": false
    }
  },

  // Admin key with full access
  {
    "name": "Admin Key",
    "permissions": {
      "allowedEndpoints": ["*"],
      "readOnly": false,
      "adminAccess": true
    }
  }
];

// Example API key update data
const updateExamples = [
  // Update permissions
  {
    "permissions": {
      "allowedEndpoints": ["/api/v1/topup", "/api/v1/networks", "/api/v1/transactions"],
      "readOnly": false
    }
  },

  // Deactivate key
  {
    "isActive": false
  },

  // Update expiry
  {
    "expiresAt": "2027-01-01T00:00:00.000Z"
  }
];