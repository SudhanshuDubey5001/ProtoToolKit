export interface StorageData {
  [key: string]: any;
}

export const saveToLocalStorage = (tabId: string, data: StorageData): void => {
  try {
    localStorage.setItem(`experiment_toolkit_${tabId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (tabId: string): StorageData | null => {
  try {
    const savedData = localStorage.getItem(`experiment_toolkit_${tabId}`);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearFromLocalStorage = (tabId: string): void => {
  try {
    localStorage.removeItem(`experiment_toolkit_${tabId}`);
  } catch (error) {
    console.error('Failed to clear from localStorage:', error);
  }
};
