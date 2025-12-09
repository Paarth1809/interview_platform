/**
 * API Configuration for different environments
 * 
 * In development: Uses localhost
 * In production: Uses environment variables or fallback URLs
 * 
 * To configure for production deployment:
 * 1. Set environment variables in Netlify dashboard
 * 2. Variables must start with VITE_ prefix
 * 3. Example: VITE_JAVA_BACKEND_URL=https://your-backend.railway.app
 */

const API_CONFIG = {
    development: {
        JAVA_BACKEND: 'http://localhost:8080',
        PYTHON_AI: 'http://localhost:8001',
        NODE_BACKEND: 'http://localhost:3000'
    },
    production: {
        JAVA_BACKEND: import.meta.env.VITE_JAVA_BACKEND_URL || 'http://localhost:8080',
        PYTHON_AI: import.meta.env.VITE_PYTHON_AI_URL || 'http://localhost:8001',
        NODE_BACKEND: import.meta.env.VITE_NODE_BACKEND_URL || 'http://localhost:3000'
    }
};

// Determine current environment
const ENV = import.meta.env.MODE || 'development';

// Export the appropriate configuration
export const API_ENDPOINTS = API_CONFIG[ENV];

// Helper function to build full API URLs
export const buildApiUrl = (service, path) => {
    const baseUrl = API_ENDPOINTS[service];
    return `${baseUrl}${path}`;
};

// Export individual endpoints for convenience
export const JAVA_API = API_ENDPOINTS.JAVA_BACKEND;
export const PYTHON_API = API_ENDPOINTS.PYTHON_AI;
export const NODE_API = API_ENDPOINTS.NODE_BACKEND;

// Log configuration in development
if (ENV === 'development') {
    console.log('🔧 API Configuration:', API_ENDPOINTS);
}
