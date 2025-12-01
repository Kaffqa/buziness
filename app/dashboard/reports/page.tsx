"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, File, Plus, MoreVertical, Upload, Edit2, Trash2 } from "lucide-react";

export default function ReportsPage() {
  const { folders, addFolder, updateFolder, deleteFolder } = useStore();
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const rootFolders = folders.filter((f) => f.parentId === null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({
        id: `folder-${Date.now()}`,
        name: newFolderName,
        parentId: null,
      });
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  const handleStartEdit = (folder: { id: string; name: string }) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
  };

  const handleSaveEdit = () => {
    if (editingFolder && editName.trim()) {
      updateFolder(editingFolder, editName);
      setEditingFolder(null);
      setEditName("");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      deleteFolder(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Files</h1>
          <p className="text-slate-500">Manage your documents and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button onClick={() => setShowNewFolder(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      {/* New Folder Form */}
      {showNewFolder && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") setShowNewFolder(false);
                }}
                autoFocus
              />
              <Button onClick={handleCreateFolder}>Create</Button>
              <Button variant="outline" onClick={() => setShowNewFolder(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Explorer Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {rootFolders.map((folder) => (
          <Card
            key={folder.id}
            className="group cursor-pointer transition-all hover:shadow-md"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              {editingFolder === folder.id ? (
                <div className="w-full space-y-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") setEditingFolder(null);
                    }}
                    autoFocus
                    className="text-sm"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleSaveEdit} className="flex-1">
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingFolder(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Folder className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-1 text-sm font-medium text-slate-900 line-clamp-2">
                    {folder.name}
                  </h3>
                  <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(folder);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for empty state */}
        {rootFolders.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Folder className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No folders yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Sample Files */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Sales Report Q1 2024.pdf", date: "2 days ago", size: "2.4 MB" },
              { name: "Inventory Summary.xlsx", date: "1 week ago", size: "1.8 MB" },
              { name: "Financial Statement.pdf", date: "2 weeks ago", size: "3.2 MB" },
            ].map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                    <File className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {file.date} • {file.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


