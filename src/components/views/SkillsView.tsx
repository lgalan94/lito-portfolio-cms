import { useState, useEffect, type Key } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { createSkill, getAllSkills, deleteSkill } from "../../services/skillsApi";
import Card from "../ui/Card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

interface Skill {
  _id: Key | null | undefined;
  name: string;
  category: string;
  icon: string;
}

const SkillsView = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");
  const [newSkillIcon, setNewSkillIcon] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return <p className="text-gray-400">Loading skills...</p>;

  // ✅ Add skill with fade-in animation
  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;

    const newSkillData = {
      name: newSkillName,
      category: newSkillCategory,
      icon:
        newSkillIcon ||
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg",
    };

    setIsAdding(true);
    try {
      const savedSkill = await createSkill(newSkillData);

      const skillName = savedSkill?.name || newSkillData.name;

      await new Promise((resolve) => setTimeout(resolve, 300)); // subtle delay for effect

      // ✨ Animate addition
      setSkills((prev) => [...prev, savedSkill]);
      const updatedSkills = await getAllSkills();
      toast.success(`Added ${skillName} successfully!`);
      setSkills(updatedSkills);

      setNewSkillName("");
      setNewSkillCategory("Frontend");
      setNewSkillIcon("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save skill:", error);
      toast.error("Failed to add skill.");
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Delete skill with fade-out animation
  const handleDeleteSkill = async (id: string) => {
    setDeletingId(id);
    setIsDeleting(true);
    try {
      await deleteSkill(id);
      await new Promise((resolve) => setTimeout(resolve, 600)); // delay for exit animation

      setSkills((prev) => prev.filter((s) => s._id !== id));
      toast.success("Skill deleted successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill.");
    } finally {
      setDeletingId(null);
      setIsDeleting(false)
    }
  };

  return (
    <div className="ml-66">
      <Card className="w-full h-full mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold">My Skills</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 overflow-hidden border border-slate-700 shadow-md hover:scale-103"
          >
            <PlusCircle className="w-5 h-5" />
            Add Skill
          </Button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill._id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={`relative text-slate-400 flex flex-col items-center p-4 bg-slate-800/90 overflow-hidden border border-slate-700 shadow-md rounded-xl hover:bg-slate-800 transition group ${
                  deletingId === skill._id ? "opacity-50" : ""
                }`}
              >
                {skill.icon && (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-10 h-10 mb-2 transition-transform group-hover:scale-110"
                  />
                )}
                <span className="text-sm font-medium text-white">
                  {skill.name}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {skill.category}
                </span>

                {/* Delete Button (only on hover) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeletingId(skill._id as string)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border border-slate-700 text-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-semibold text-white">
                            {skill.name}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-slate-500">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSkill(skill._id as string)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          { isDeleting ? "Deleting ..." : "Delete" }
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Skill Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-slate-900 border border-slate-700 text-gray-200">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm">Skill Name</label>
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Vue.js"
                  className="mt-1 bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="text-sm">Category</label>
                <Select
                  value={newSkillCategory}
                  onValueChange={setNewSkillCategory}
                >
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-gray-200 border-slate-700">
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm">Icon URL</label>
                <Input
                  value={newSkillIcon}
                  onChange={(e) => setNewSkillIcon(e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  className="mt-1 bg-slate-800 border-slate-700"
                />

              <div className="mt-6 text-sm">
                <a
                  href="https://devicon.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span>👉</span> Go to Dev Icons
                </a>
              </div>

              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSkill} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Skill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default SkillsView;
