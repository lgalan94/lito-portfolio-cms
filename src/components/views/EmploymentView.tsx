import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import {
  createEmployment,
  getAllEmployment,
  deleteEmployment,
  updateEmployment,
} from "../../services/employmentApi";
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
import { Textarea } from "../ui/textarea";
import type { Employment } from "../../types";

const EmploymentView = () => {
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // ✅ Fetch employment data
  useEffect(() => {
    const fetchEmployment = async () => {
      try {
        const data = await getAllEmployment();
        setEmployments(data);
      } catch (error) {
        console.error("Error fetching employment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployment();
  }, []);

  if (loading) return <p className="text-gray-400">Loading employment...</p>;

  // ✅ Add or Update employment
  const handleSubmitEmployment = async () => {
    const { title, company, location, startDate, endDate, description } = formData;

    if (!title.trim() || !company.trim()) {
      toast.error("Title and company are required.");
      return;
    }

    const newEmploymentData = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      description: description
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean), // ✅ Converts multiple lines into array
    };

    setIsAdding(true);
    try {
      if (isEditing && editingId) {
        await updateEmployment(editingId, newEmploymentData);
        toast.success("Employment updated successfully!");
      } else {
        await createEmployment(newEmploymentData);
        toast.success(`Added ${title} at ${company}`);
      }

      const updated = await getAllEmployment();
      setEmployments(updated);

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save employment:", error);
      toast.error("Failed to save employment.");
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Edit employment
  const handleEditEmployment = (emp: Employment) => {
  setFormData({
    title: emp.title,
    company: emp.company,
    location: emp.location,
    startDate: emp.startDate,
    endDate: emp.endDate || "",
    description: Array.isArray(emp.description)
      ? emp.description.join("\n")
      : emp.description, // ✅ handles both array and string
  });
  setEditingId(emp._id as string);
  setIsEditing(true);
  setIsModalOpen(true);
};


  // ✅ Delete employment
  const handleDeleteEmployment = async (id: string) => {
    setDeletingId(id);
    setIsDeleting(true);
    try {
      await deleteEmployment(id);
      await new Promise((r) => setTimeout(r, 500));
      setEmployments((prev) => prev.filter((e) => e._id !== id));
      toast.success("Employment deleted successfully!");
    } catch (error) {
      console.error("Error deleting employment:", error);
      toast.error("Failed to delete employment.");
    } finally {
      setDeletingId(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="ml-66">
      <Card className="w-full h-full mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold">Employment History</h2>
          <Button
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                description: "",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 overflow-hidden border border-slate-700 shadow-md hover:scale-103"
          >
            <PlusCircle className="w-5 h-5" />
            Add Employment
          </Button>
        </div>

        {/* Employment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {employments.map((emp) => (
              <motion.div
                key={emp._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={`relative p-4 bg-slate-800/90 border border-slate-700 shadow-md rounded-xl hover:bg-slate-800 transition group ${
                  deletingId === emp._id ? "opacity-50" : ""
                }`}
              >
                <div className="flex flex-col">
                  <h3 className="text-white text-lg font-semibold">{emp.title}</h3>
                  <p className="text-slate-400">{emp.company}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {emp.startDate} - {emp.endDate || "Present"}
                  </p>
                  <p className="text-xs text-slate-500">{emp.location}</p>

                  <ul className="list-disc ml-5 mt-2 text-sm text-slate-300 space-y-1">
                    {Array.isArray(emp.description) ? (
                      emp.description.map((d, i) => <li key={i}>{d}</li>)
                    ) : (
                      <li>{emp.description}</li>
                    )}
                  </ul>

                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    onClick={() => handleEditEmployment(emp)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeletingId(emp._id as string)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border border-slate-700 text-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Employment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-semibold text-white">
                            {emp.title} at {emp.company}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-slate-500">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEmployment(emp._id as string)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add / Edit Employment Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-slate-900 border border-slate-700 text-gray-200">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Employment" : "Add New Employment"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <div>
                <label className="text-sm">Job Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Frontend Developer"
                  className="mt-1 bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="text-sm">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g. TechNova Solutions"
                  className="mt-1 bg-slate-800 border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Start Date</label>
                  <Input
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    placeholder="e.g. Jan 2022"
                    className="mt-1 bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-sm">End Date</label>
                  <Input
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    placeholder="e.g. Present"
                    className="mt-1 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Manila, Philippines"
                  className="mt-1 bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="text-sm">Description (One per line)</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="List achievements or tasks (one per line)"
                  className="mt-1 bg-slate-800 border-slate-700 h-28"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEmployment} disabled={isAdding}>
                {isAdding
                  ? "Saving..."
                  : isEditing
                  ? "Update Employment"
                  : "Add Employment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default EmploymentView;
