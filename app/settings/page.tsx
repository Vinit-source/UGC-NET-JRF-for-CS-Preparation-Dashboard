'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDB } from '@/lib/db';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY_PRIMARY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    setIsSaving(true);
    localStorage.setItem('GEMINI_API_KEY_PRIMARY', apiKey);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('API Key saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 500);
  };

  const handleExport = async () => {
    try {
      setExportStatus('Exporting...');
      const db = await getDB();
      
      const keyvalData: {key: string, value: any}[] = [];
      let cursor = await db.transaction('keyval').store.openCursor();
      while (cursor) {
        keyvalData.push({ key: cursor.key as string, value: cursor.value });
        cursor = await cursor.continue();
      }

      const data = {
        keyval: keyvalData,
        scores: await db.getAll('scores'),
        focus: await db.getAll('focus'),
        schedule: await db.getAll('schedule'),
        journal: await db.getAll('journal'),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ugc-net-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('Export successful!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed. Check console.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Importing...');
      const text = await file.text();
      const data = JSON.parse(text);
      
      const db = await getDB();
      
      // Clear existing data
      await db.clear('keyval');
      await db.clear('scores');
      await db.clear('focus');
      await db.clear('schedule');
      await db.clear('journal');

      // Import new data
      if (data.keyval) {
        const tx = db.transaction('keyval', 'readwrite');
        for (const item of data.keyval) {
          await tx.store.put(item.value, item.key);
        }
        await tx.done;
      }
      
      if (data.scores) {
        const tx = db.transaction('scores', 'readwrite');
        for (const item of data.scores) await tx.store.put(item);
        await tx.done;
      }
      if (data.focus) {
        const tx = db.transaction('focus', 'readwrite');
        for (const item of data.focus) await tx.store.put(item);
        await tx.done;
      }
      if (data.schedule) {
        const tx = db.transaction('schedule', 'readwrite');
        for (const item of data.schedule) await tx.store.put(item);
        await tx.done;
      }
      if (data.journal) {
        const tx = db.transaction('journal', 'readwrite');
        for (const item of data.journal) await tx.store.put(item);
        await tx.done;
      }

      setImportStatus('Import successful! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('Import failed. Invalid file format.');
    }
  };

  return (
    <div className="h-full w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your API keys and data backups.</p>
      </div>

      <div className="space-y-8">
        {/* API Key Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-indigo-500" />
            Gemini API Key
          </h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            To use the AI Analysis feature, you need to provide your own Google Gemini API key. 
            Your key is stored securely in your browser's local storage and is never sent to our servers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key (AIzaSy...)"
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSaveKey}
              disabled={isSaving || !apiKey}
              className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Key'}
            </button>
          </div>
          {saveStatus && (
            <p className="mt-3 text-sm font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              {saveStatus}
            </p>
          )}
        </div>

        {/* Data Management Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Data Management</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            All your progress, scores, and journal entries are stored locally in your browser. 
            You can export this data as a backup or import it to another device.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Export */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Export Data</h3>
              <p className="text-xs text-slate-500 mb-4">Download a JSON file containing all your data.</p>
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Backup
              </button>
              {exportStatus && (
                <p className={cn("mt-2 text-xs", exportStatus.includes('failed') ? "text-red-500" : "text-emerald-600")}>
                  {exportStatus}
                </p>
              )}
            </div>

            {/* Import */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Import Data</h3>
              <p className="text-xs text-slate-500 mb-4">Restore your data from a previously exported JSON file.</p>
              <label className="w-full flex items-center justify-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                Import Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              {importStatus && (
                <p className={cn("mt-2 text-xs", importStatus.includes('failed') ? "text-red-500" : "text-emerald-600")}>
                  {importStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
