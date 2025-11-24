/**
 * This file saves our expenses in localStorage
 * (localStorage means browser will remember data even after refresh)
 */

const KEY = "spend_tracker_v1";  // Just a name where we will store everything

/**
 * getExpenses()
 * ----------------
 * This function brings back all the expenses we saved.
 * If nothing is saved, it will simply give an empty array.
 */
export function getExpenses() {
  try {
    // Get the data from localStorage
    const raw = localStorage.getItem(KEY);

    // If nothing stored yet, return empty list
    if (!raw) {
      return [];
    }

    // localStorage stores only text, so convert text -> JS array
    return JSON.parse(raw);
  } catch (e) {
    console.error("read error", e);
    // If any error happens, just give back empty array
    return [];
  }
}

/**
 * saveExpenses(arr)
 * ------------------
 * This function saves all our expenses into localStorage.
 * Whatever list we pass, it will overwrite the old one.
 *
 * @param {Array} arr  - list of all expense objects
 */
export function saveExpenses(arr) {
  try {
    // Convert array -> text and save it
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (e) {
    console.error("save error", e);
  }
}
