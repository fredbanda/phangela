import mongoose, { Schema, model } from "mongoose";

const ExperienceSchema = new Schema({
    company: String,
    position: String,
    address: String,
    city: String,
    startDate: String,
    endDate: String,
    jobSummary: String,
});

const EducationSchema = new Schema({
    institution: String,
    qualification: String,
    address: String,
    city: String,
    startDate: String,
    endDate: String,
    educationSummary: String,
});

const SkillSchema = new Schema({
    name: String,
    level: String,
});

const PortfolioSchema = new Schema({
    title: String,
    description: String,
    url: String,
    createdAt: Date,
    updatedAt: Date,
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
    github: String,
    linkedin: String,
    summary: String,
    themeColor: String,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],
    portfolio: [PortfolioSchema],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.models.Resume || model("Resume", ResumeSchema)

export default Resume;
