const ZEN_STORAGE_KEY = 'relaxaZenMode';

const applyZenClass = (enabled) => {
  document.body.classList.toggle('zen-mode', enabled);
};

const initializeZenMode = () => {
  const enabled = localStorage.getItem(ZEN_STORAGE_KEY) === 'true';
  applyZenClass(enabled);
  return enabled;
};

const toggleZenMode = () => {
  const current = localStorage.getItem(ZEN_STORAGE_KEY) === 'true';
  const next = !current;
  localStorage.setItem(ZEN_STORAGE_KEY, String(next));
  applyZenClass(next);
  return next;
};

export { initializeZenMode, toggleZenMode };
