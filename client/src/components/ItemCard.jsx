import { escapeHtml } from '../services/api';

export default function ItemCard({ item, onViewDetails }) {
  const statusClass = item.lost_or_found === 'lost' ? 'tag-lost' : 'tag-found';

  const imageHtml = item.image_url ? (
    <div style={{ height: '200px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  ) : (
    <div style={{ height: '200px', width: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
      <span style={{ fontSize: '3rem', opacity: 0.3 }}></span>
    </div>
  );

  return (
    <div className="item-card">
      {imageHtml}
      <div className="item-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.4 }}>{escapeHtml(item.name)}</h3>
          <span className={`tag ${statusClass}`}>{item.lost_or_found}</span>
        </div>
        
        <div className="item-meta" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span>{item.timestamp}</span>
          </div>
          {item.place && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>
              <span>{escapeHtml(item.place)}</span>
            </div>
          )}
        </div>

        {item.description && (
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.95rem', 
            marginBottom: '1rem', 
            flex: 1, 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {escapeHtml(item.description)}
          </p>
        )}
        
        <button 
          className="btn btn-outline btn-sm" 
          style={{ width: '100%', marginTop: 'auto' }}
          onClick={() => onViewDetails(item)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
