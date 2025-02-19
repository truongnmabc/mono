export const replaceYear = (year: string) => {
  try {
    const currentYear = new Date().getFullYear().toString();
    if (!year) return year;

    return year.replace(/\b(19|20)\d{2}\b/g, (matchedYear) => {
      if (parseInt(matchedYear, 10) < parseInt(currentYear, 10)) {
        return currentYear;
      }
      return matchedYear;
    });
  } catch (e) {
    console.error('Error replacing year:', e);
    return year;
  }
};
