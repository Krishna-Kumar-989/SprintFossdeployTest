const BASE_URL = 'https://sprintfossdeploytest.onrender.com';
const headers = { 'Content-Type': 'application/json' };
const fetchOptions = { credentials: 'include' };

export const api = {
  // Auth
  login: (data) => fetch(`${BASE_URL}/login`, { ...fetchOptions, method: 'POST', headers, body: JSON.stringify(data) }),
  signup: (data) => fetch(`${BASE_URL}/signup`, { ...fetchOptions, method: 'POST', headers, body: JSON.stringify(data) }),
  checkAuth: () => fetch(`${BASE_URL}/check`, fetchOptions),
  logout: () => fetch(`${BASE_URL}/logout`, fetchOptions),
  
  // Items
  getItems: (filters) => fetch(`${BASE_URL}/items/all`, { ...fetchOptions, method: 'POST', headers, body: JSON.stringify(filters) }),
  getItemDetails: (id) => fetch(`${BASE_URL}/details`, { ...fetchOptions, method: 'POST', headers, body: JSON.stringify({ id }) }),
  registerItem: (formData) => fetch(`${BASE_URL}/registration`, { ...fetchOptions, method: 'POST', body: formData }),
  markResolved: (itemId) => fetch(`${BASE_URL}/markasresolved`, { 
    ...fetchOptions,
    method: 'POST', 
    headers, 
    body: JSON.stringify({ info_id: itemId, case_resol_status: true }) 
  }),
  
  // Claims
  submitClaim: (data) => fetch(`${BASE_URL}/claim`, { ...fetchOptions, method: 'POST', headers, body: JSON.stringify(data) }),
  getClaims: (itemId) => fetch(`${BASE_URL}/claims/${itemId}`, fetchOptions),
  
  // User
  getUserItems: (username) => fetch(`${BASE_URL}/account_item_list`, { 
    ...fetchOptions,
    method: 'POST', 
    headers, 
    body: JSON.stringify({ user_who_registered: username }) 
  }),
  updateProfile: (data) => fetch(`${BASE_URL}/profile`, { ...fetchOptions, method: 'PUT', headers, body: JSON.stringify(data) }),
  getPublicProfile: (username) => fetch(`${BASE_URL}/users/${username}`, fetchOptions),
  
  // Notifications
  getNotifications: () => fetch(`${BASE_URL}/api/notifications`, fetchOptions),
  markNotificationRead: (id) => fetch(`${BASE_URL}/api/notifications/${id}/read`, { ...fetchOptions, method: 'POST' }),
  
  // Admin
  getStats: () => fetch(`${BASE_URL}/admin/stats`, fetchOptions),
  getUsers: () => fetch(`${BASE_URL}/admin/users`, fetchOptions),
  getAdminItems: () => fetch(`${BASE_URL}/admin/items`, fetchOptions),
  deleteUser: (id) => fetch(`${BASE_URL}/admin/users/${id}`, { ...fetchOptions, method: 'DELETE' }),
  deleteItem: (id) => fetch(`${BASE_URL}/admin/items/${id}`, { ...fetchOptions, method: 'DELETE' }),
  
  // Archives
  getArchivedItems: (username) => fetch(`${BASE_URL}/items/archived`, { 
    ...fetchOptions,
    method: 'POST', 
    headers, 
    body: JSON.stringify({ username }) 
  }),
};

export function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
