import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Card from '../ui/Card';
import { getAllProjects, createProject, deleteProject, updateProject } from '../../services/projectApi';
import type { Project } from '../../types';

const MAX_FILE_SIZE_MB = 5;

// ✅ Predefined categories from schema
const CATEGORY_OPTIONS = ['Fullstack', 'Frontend', 'Backend', 'Landing', 'UI/UX', 'Other'];

const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    tags: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    liveUrl: '',
    repoUrl: '',
  });

  const normalizeProject = (p: any): Project => {
    let tagsArr: string[] = [];

    if (Array.isArray(p.tags)) {
      tagsArr = p.tags.map((t: any) => String(t).trim()).filter((t: string) => t.length > 0);
    } else if (typeof p.tags === 'string') {
      tagsArr = p.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    } else {
      tagsArr = [];
    }

    return {
      ...p,
      tags: tagsArr,
      category: p.category || '',
    } as Project;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        if (!Array.isArray(data)) throw new Error('Invalid project data');
        const formattedProjects = data.map((project: any) => normalizeProject(project));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(`❌ File too large! Max size is ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = '';
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, image: file, imagePreview: previewUrl }));
    } else {
      setForm(prev => ({ ...prev, image: null, imagePreview: '' }));
    }
  };

  const openModal = (type: 'add' | 'edit', project?: Project) => {
    if (type === 'edit' && project) {
      setSelectedProject(project);
      setForm({
        title: project.title || '',
        category: project.category || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        description: project.description || '',
        image: null,
        imagePreview: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        repoUrl: project.repoUrl || '',
      });
    } else {
      setForm({
        title: '',
        category: '',
        tags: '',
        description: '',
        image: null,
        imagePreview: '',
        liveUrl: '',
        repoUrl: '',
      });
      setSelectedProject(null);
    }
    setModalType(type);
  };

  const isChanged = useMemo(() => {
    if (!selectedProject || modalType !== 'edit') return true;

    const tagsString = Array.isArray(selectedProject.tags)
      ? selectedProject.tags.join(', ')
      : selectedProject.tags || '';

    const hasFieldChanges =
      form.title !== (selectedProject.title || '') ||
      form.category !== (selectedProject.category || '') ||
      form.description !== (selectedProject.description || '') ||
      form.liveUrl !== (selectedProject.liveUrl || '') ||
      form.repoUrl !== (selectedProject.repoUrl || '') ||
      form.tags.trim() !== tagsString.trim();

    const hasImageChange = !!form.image;

    return hasFieldChanges || hasImageChange;
  }, [form, selectedProject, modalType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.tags || !form.category) {
      toast.warning('⚠️ Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('description', form.description);

    const tagsArray = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    tagsArray.forEach(tag => formData.append('tags[]', tag));

    formData.append('liveUrl', form.liveUrl);
    formData.append('repoUrl', form.repoUrl);
    if (form.image) formData.append('image', form.image);

    setIsSubmitting(true);
    try {
      if (modalType === 'add') {
        const res = await createProject(formData as any);
        const newProjectRaw = ((res as any).project || res) || null;

        if (newProjectRaw) {
          const newProject = normalizeProject(newProjectRaw);
          setProjects(prev => [newProject, ...prev]);
        }
        toast.success('✅ Project added successfully!');
      } else if (modalType === 'edit' && selectedProject) {
        await updateProject(selectedProject._id, formData);
        const updatedList = await getAllProjects();
        const formatted = updatedList.map((project: any) => normalizeProject(project));
        setProjects(formatted);
        toast.success('📝 Project updated!');
      }

      setModalType(null);
      setForm({
        title: '',
        category: '',
        tags: '',
        description: '',
        image: null,
        imagePreview: '',
        liveUrl: '',
        repoUrl: '',
      });
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      toast.error(err?.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget._id);
      setProjects(prev => prev.filter(p => p._id !== deleteTarget._id));
      toast.success('🗑️ Project deleted');
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      toast.error(err?.message || 'Failed to delete project');
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div className="ml-0 lg:ml-66" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="w-full h-full mt-16 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <Button
            onClick={() => openModal('add')}
            className="flex items-center gap-2 overflow-hidden border border-slate-700 shadow-md hover:scale-103"
          >
            <PlusCircle className="w-5 h-5" /> Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-slate-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-slate-400">No projects found.</p>
          ) : (
            projects.map(project => (
              <motion.div
                key={project._id}
                className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-md group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal('edit', project)}
                    className="p-2 rounded-full bg-slate-700 hover:bg-blue-600 text-white"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="p-2 rounded-full bg-slate-700 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                  {project.category && <p className="text-teal-400 text-sm font-semibold mb-2">{project.category}</p>}
                  <p className="text-slate-400 text-sm mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(project.tags) ? project.tags : []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-slate-700 text-teal-300 rounded-full font-semibold border border-slate-600 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between text-blue-400 text-sm mt-6 font-medium">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Repo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-lg border border-slate-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {modalType === 'add' ? 'Add Project' : 'Edit Project'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />

                {/* ✅ Category Dropdown */}
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />

                <input type="file" accept="image/*" onChange={handleFileChange} className="text-white" />
                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-md mt-2 border border-slate-700"
                  />
                )}

                <input
                  name="liveUrl"
                  placeholder="Live URL"
                  value={form.liveUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />
                <input
                  name="repoUrl"
                  placeholder="Repo URL"
                  value={form.repoUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (modalType === 'edit' && !isChanged)}
                    className={`px-5 py-2 rounded-md text-white ${
                      isSubmitting || (modalType === 'edit' && !isChanged)
                        ? 'bg-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : modalType === 'add' ? 'Add' : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg text-white font-semibold mb-3">
                Delete "{deleteTarget.title}"?
              </h3>
              <p className="text-slate-400 text-sm mb-5">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                >
                  {isDeleting ? 'Deleting ...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsView;
