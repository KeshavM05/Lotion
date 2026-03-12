"use client";

import { useState } from "react";
import { useStore, type Project } from "@/lib/store";
import { Modal } from "@/components/ui/modal";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6"];

export default function ProjectsPage() {
  const store = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState(COLORS[0]);

  function openCreateModal() {
    setEditingProject(null);
    setFormName("");
    setFormDescription("");
    setFormColor(COLORS[0]);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setFormName(project.name);
    setFormDescription(project.description);
    setFormColor(project.color);
    setModalOpen(true);
  }

  function handleSave() {
    if (!formName.trim()) return;
    if (editingProject) {
      store.updateProject(editingProject.id, {
        name: formName.trim(),
        description: formDescription.trim(),
        color: formColor,
      });
    } else {
      store.addProject({
        name: formName.trim(),
        description: formDescription.trim(),
        color: formColor,
      });
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (editingProject) {
      store.deleteProject(editingProject.id);
      setModalOpen(false);
    }
  }

  function getProjectTasks(projectId: string) {
    return store.tasks.filter((t) => t.projectId === projectId);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          + New project
        </button>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {store.projects.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]">
            <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 20a2 2 0 002 2h16a2 2 0 002-2V8l-7-6H4a2 2 0 00-2 2v16z" />
              <path d="M14 2v6h6" />
            </svg>
            <p className="text-lg mb-1">No projects yet</p>
            <p className="text-sm">Create a project to organize your tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {store.projects.map((project) => {
              const tasks = getProjectTasks(project.id);
              const completedCount = tasks.filter((t) => t.completed).length;
              const totalCount = tasks.length;
              const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const isExpanded = expandedId === project.id;

              return (
                <div
                  key={project.id}
                  className="border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--muted)] transition-colors"
                >
                  {/* Color bar */}
                  <div className="h-1.5" style={{ backgroundColor: project.color }} />

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      >
                        <h3 className="font-semibold text-sm">{project.name}</h3>
                        {project.description && (
                          <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1 rounded hover:bg-[var(--accent)] text-[var(--muted)] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1.5">
                        <span>
                          {completedCount}/{totalCount} tasks
                        </span>
                        {totalCount > 0 && <span>{Math.round(progress)}%</span>}
                      </div>
                      <div className="h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: project.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Expanded task list */}
                    {isExpanded && tasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 py-1"
                          >
                            <button
                              onClick={() =>
                                store.updateTask(task.id, {
                                  completed: !task.completed,
                                  status: !task.completed ? "done" : "todo",
                                  completedAt: !task.completed
                                    ? new Date().toISOString()
                                    : null,
                                })
                              }
                              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                                task.completed
                                  ? "border-[var(--primary)] bg-[var(--primary)]"
                                  : "border-[var(--border)]"
                              }`}
                            >
                              {task.completed && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                            <span
                              className={`text-xs truncate ${
                                task.completed
                                  ? "line-through text-[var(--muted)]"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Project" : "New Project"}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm resize-none"
          />
          <div>
            <label className="text-xs text-[var(--muted)] mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    formColor === c
                      ? "scale-110 ring-2 ring-offset-2 ring-[var(--foreground)]"
                      : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            {editingProject ? (
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                {editingProject ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
