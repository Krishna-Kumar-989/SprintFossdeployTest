const headers = { 'Content-Type': 'application/json' };

export const api = {
  // Auth
  login: (data) => fetch('/login', { method: 'POST', headers, body: JSON.stringify(data) }),
  signup: (data) => fetch('/signup', { method: 'POST', headers, body: JSON.stringify(data) }),
  checkAuth: () => fetch('/check'),
  logout: () => fetch('/logout'),
  
  // Items
  getItems: (filters) => fetch('/items/all', { method: 'POST', headers, body: JSON.stringify(filters) }),
  getItemDetails: (id) => fetch('/details', { method: 'POST', headers, body: JSON.stringify({ id }) }),
  registerItem: (formData) => fetch('/registration', { method: 'POST', body: formData }),
  markResolved: (itemId) => fetch('/markasresolved', { 
    method: 'POST', 
    headers, 
    body: JSON.stringify({ info_id: itemId, case_resol_status: true }) 
  }),
  
  // Claims
  submitClaim: (data) => fetch('/claim', { method: 'POST', headers, body: JSON.stringify(data) }),
  getClaims: (itemId) => fetch(`/claims/${itemId}`),
  
  // User
  getUserItems: (username) => fetch('/account_item_list', { 
    method: 'POST', 
    headers, 
    body: JSON.stringify({ user_who_registered: username }) 
  }),
  updateProfile: (data) => fetch('/profile', { method: 'PUT', headers, body: JSON.stringify(data) }),
  getPublicProfile: (username) => fetch(`/users/${username}`),
  
  // Notifications
  getNotifications: () => fetch('/api/notifications'),
  markNotificationRead: (id) => fetch(`/api/notifications/${id}/read`, { method: 'POST' }),
  
  // Admin
  getStats: () => fetch('/admin/stats'),
  getUsers: () => fetch('/admin/users'),
  getAdminItems: () => fetch('/admin/items'),
  deleteUser: (id) => fetch(`/admin/users/${id}`, { method: 'DELETE' }),
  deleteItem: (id) => fetch(`/admin/items/${id}`, { method: 'DELETE' }),
  
  // Archives
  getArchivedItems: (username) => fetch('/items/archived', { 
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
