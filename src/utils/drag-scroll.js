// src/utils/drag-scroll.js

export function enableDragScroll(container) {
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const onMouseLeave = () => {
    isDown = false;
    container.classList.remove('active');
    container.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    isDown = false;
    container.classList.remove('active');
    container.style.cursor = 'grab';
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const onTouchStart = (e) => {
    isDown = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  };

  const onTouchEnd = () => {
    isDown = false;
  };

  const onTouchMove = (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseleave', onMouseLeave);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('touchstart', onTouchStart);
  container.addEventListener('touchend', onTouchEnd);
  container.addEventListener('touchmove', onTouchMove);

  // Fonksiyon temizliği için
  return () => {
    container.removeEventListener('mousedown', onMouseDown);
    container.removeEventListener('mouseleave', onMouseLeave);
    container.removeEventListener('mouseup', onMouseUp);
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchend', onTouchEnd);
    container.removeEventListener('touchmove', onTouchMove);
  };
}
