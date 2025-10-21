import api from "./api";
import type { Skill } from "../types";

export const getAllSkills = async (): Promise<Skill[]> => {
    try {
        const response = await api.get('/skills/list');
        return response.data;
    } catch (error) {
        console.error('Error fetchng skills');
        throw error;
    }
}

export const createSkill = async (newSkill: Omit<Skill, "_id">): Promise<Skill> => {
  try {
    const response = await api.post("/skills/add", newSkill);
    return response.data;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};