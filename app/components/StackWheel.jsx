import React from 'react';

function getStackStyle(index, activeIndex) {
  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);

  return {
    transform: `translateY(${offset * 70}px) translateZ(${-absOffset * 60}px) scale(${Math.max(1.08 - absOffset * 0.15, 0.62)})`,
    opacity: Math.max(1 - absOffset * 0.35, 0),
    filter: `blur(${absOffset * 1.5}px)`,
    zIndex: 100 - absOffset,
    pointerEvents: absOffset > 2 ? 'none' : 'auto',
  };
}

export default function StackWheel({
  items,
  activeIndex,
  onSelect,
  itemClassName,
  renderTitle,
  renderSubtitle,
}) {
  return (
    <div className="cb-wheel">
      {items.map((item, index) => (
        <div
          key={`${item.id || item.name || index}-${index}`}
          className={`cb-btn ${itemClassName}${index === activeIndex ? ' active' : ''}`}
          style={getStackStyle(index, activeIndex)}
          onClick={() => onSelect(index)}
        >
          <h5>{renderTitle(item)}</h5>
          <span>{renderSubtitle(item)}</span>
        </div>
      ))}
    </div>
  );
}
