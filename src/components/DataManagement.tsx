import React, { useRef } from 'react';
import { Save, Upload } from 'lucide-react';
import { exportToFile, importFromFile } from '../services/migrationService';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importFromFile(file);
        window.location.reload(); // Refresh to load new data
      } catch (error) {
        console.error('Import failed:', error);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToFile}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <Save size={20} />
        Export Data
      </button>
      
      <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition-colors">
        <Upload size={20} />
        Import Data
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}