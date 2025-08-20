import mongoose, { Schema, model } from "mongoose";

const ExperienceSchema = new Schema({
    company: String,
    position: String,
    address: String,
    address: String,
    city: String,
    startDate: String,
    endDate: String,
    summary: String,
});

const EducationSchema = new Schema({
    institution: String,
    qualification: String,
    address: String,
    city: String,
    startDate: String,
    endDate: String,
    summary: String,
});

const SkillSchema = new Schema({
    name: String,
    level: String,
});

const ResumeSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    title: String,
    name: String,
    job: String,
    address: String,
    email: String,
    phone: String,
    location: String,
    city: String,
    summary: String,
    themeColor: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.models.Resume || model("Resume", ResumeSchema)

export default Resume;
