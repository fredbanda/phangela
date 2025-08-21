'use server';
import Resume from '@/models/resume';
import dbConnect from '@/utils/db';
import { currentUser } from '@clerk/nextjs/server';

const checkOwnership = async (resumeId) => {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error('User not authenticated');
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const saveResumeToDB = async (data) => {
  try {
    dbConnect();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const { _id, ...rest } = data;

    const resume = await Resume.create({ ...rest, userEmail });
    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserResumesFromDB = async () => {
  try {
    dbConnect();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const resumes = await Resume.find({ userEmail });
    return JSON.parse(JSON.stringify(resumes));
  } catch (error) {
    throw new Error(error);
  }
};

export const getResumeFromDB = async (_id) => {
  try {
    dbConnect();
    const resume = await Resume.findById(_id);
    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateResumeFromDB = async (data) => {
  try {
    await dbConnect();
    const { _id, ...rest } = data;
    await checkOwnership(_id);
    const resume = await Resume.findByIdAndUpdate(
      _id,
      { ...rest },
      { new: true }
    );
    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateExperienceOnDB = async (data) => {
  try {
    dbConnect();
    const { _id, experience } = data; // ✅ only pick what you need
    await checkOwnership(_id);

    const resume = await Resume.findByIdAndUpdate(
      _id,
      { experience },   // ✅ now it’s just the array
      { new: true, runValidators: true }
    );

    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateEducationOnDB = async (data) => {
  try {
    dbConnect();
    const { _id, education } = data; // ✅ only pick what you need
    await checkOwnership(_id);

    const resume = await Resume.findByIdAndUpdate(
      _id,
      { education },   // ✅ now it’s just the array
      { new: true, runValidators: true }
    );

    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const getEducationFromDB = async (_id) => {
  try {
    dbConnect();
    const resume = await Resume.findById(_id);
    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

export const getExperienceFromDB = async (_id) => {
  try {
    dbConnect();
    const resume = await Resume.findById(_id);
    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    throw new Error(error);
  }
};

