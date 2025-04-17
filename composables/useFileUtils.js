export const useFileUtils = () => {
  // Export data from localStorage to a file
  const exportFromLocalStorage = () => {
    if (!process.client) return;

    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FriendCare_localstorage_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data from a file to localStorage
  const importToLocalStorage = (event) => {
    if (!process.client) return;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const jsonData = JSON.parse(content);
          // Store data in localStorage
          for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
              localStorage.setItem(key, jsonData[key]);
            }
          }
          alert('Daten wurden erfolgreich importiert!');
          // Reload page after successful import
          location.reload();
        } catch (error) {
          alert('Fehler beim Verarbeiten der Datei: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    exportFromLocalStorage,
    importToLocalStorage,
  };
};
