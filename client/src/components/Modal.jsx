export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal open" 
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {title && (
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
