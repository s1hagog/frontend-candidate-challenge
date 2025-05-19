interface PopupProps {
  onClose: () => void
  children: React.ReactNode
}

const Popup = ({ onClose, children }: PopupProps) => {
  return (
    <div className="fullscreen-popup" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
