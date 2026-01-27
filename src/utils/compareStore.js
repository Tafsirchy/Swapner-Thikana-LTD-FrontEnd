'use client';

import { toast } from 'react-hot-toast';

let compareList = [];
let compareListeners = [];

export const getCompareList = () => [...compareList];

export const addToCompare = (property) => {
  if (compareList.length >= 4) {
    toast.error('You can compare up to 4 properties');
    return false;
  }
  if (!compareList.find(p => p._id === property._id)) {
    compareList = [...compareList, property];
    notifyListeners();
    // toast.success('Added to comparison'); // Optional, since bar will show feedback
    return true;
  }
  return false;
};

export const removeFromCompare = (propertyId) => {
  const exists = compareList.find(p => p._id === propertyId);
  if (exists) {
    compareList = compareList.filter(p => p._id !== propertyId);
    notifyListeners();
    // toast.success('Removed from comparison');
    return true;
  }
  return false;
};

export const clearCompare = () => {
  if (compareList.length > 0) {
    compareList = [];
    notifyListeners();
    toast.success('Comparison cleared');
  }
};

export const subscribeToCompare = (listener) => {
  compareListeners.push(listener);
  listener(compareList);
  return () => {
    compareListeners = compareListeners.filter(fn => fn !== listener);
  };
};

const notifyListeners = () => {
  compareListeners.forEach(fn => fn(compareList));
};
