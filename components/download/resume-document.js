"use client";

import { Document, Page, Text, View, Font } from '@react-pdf/renderer';
import styles from "../download/resume-styles";

console.log('ResumePDFDocument: Component loaded');

// Register fonts for better ATS compatibility - with fallbacks
try {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', fontWeight: 'normal' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hiJ-Ek-_EeA.woff2', fontWeight: 'bold' },
    ],
  });
  console.log('ResumePDFDocument: Fonts registered successfully');
} catch (error) {
  console.error('ResumePDFDocument: Font registration failed:', error);
}

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const ResumePDFDocument = ({ resume }) => {
  console.log('ResumePDFDocument: Rendering PDF with resume:', !!resume);
  
  if (!resume) {
    console.log('ResumePDFDocument: No resume data provided');
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.name}>Resume Not Found</Text>
            <Text style={styles.description}>Please try again or contact support.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Try multiple possible data structures
  const personalInfo = resume.personalInfo || {};
  console.log('ResumePDFDocument: Personal info keys:', Object.keys(personalInfo));
  
  const resumeData = {
    // Try personalInfo first, then root level properties - ensure no empty strings
    name: personalInfo.name || resume.name || resume.fullName || 'Your Name',
    job: personalInfo.job || resume.job || '',
    email: (personalInfo.email || resume.email || '').toString().trim(),
    phone: (personalInfo.phone || resume.phone || '').toString().trim(),
    address: (personalInfo.address || resume.address || resume.city || resume.location || '').toString().trim(),
    location: (personalInfo.location || resume.location || resume.city || resume.address || '').toString().trim(),
    city: (personalInfo.city || resume.city || resume.location || '').toString().trim(),
    linkedin: (personalInfo.linkedin || resume.linkedin || '').toString().trim(),
    github: (personalInfo.github || resume.github || '').toString().trim(),
    portfolio: (personalInfo.portfolio || resume.portfolio || resume.website || '').toString().trim(),
    summary: (resume.summary || resume.professionalSummary || resume.objective || '').toString().trim(),
    experience: Array.isArray(resume.experience) ? resume.experience : (Array.isArray(resume.workExperience) ? resume.workExperience : (Array.isArray(resume.jobs) ? resume.jobs : [])),
    education: Array.isArray(resume.education) ? resume.education : (Array.isArray(resume.educationHistory) ? resume.educationHistory : []),
    skills: Array.isArray(resume.skills) ? resume.skills : (Array.isArray(resume.technicalSkills) ? resume.technicalSkills : (Array.isArray(resume.coreSkills) ? resume.coreSkills : []))
  };
  
  console.log('ResumePDFDocument: Processing resume with name:', resumeData.name);
  console.log('ResumePDFDocument: Experience items:', resumeData.experience.length);
  console.log('ResumePDFDocument: Full resume data structure:', {
    name: resumeData.name,
    email: resumeData.email,
    experienceCount: resumeData.experience.length,
    educationCount: resumeData.education.length,
    skillsCount: resumeData.skills.length
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {resumeData.name || 'Your Name'}
          </Text>
          <Text style={styles.jobTitle}>
            {resumeData.job || ''}
          </Text>

          {/* Phone & Email in one line */}
          {(resumeData.email || resumeData.phone) && (
            <Text style={styles.contactInfo}>
              {[
                resumeData.email,
                resumeData.phone
              ].filter(Boolean).join(" | ")}
            </Text>
          )}

          {/* Address, Location, City in one line */}
          {(resumeData.address || resumeData.location || resumeData.city) && (
            <Text style={styles.contactInfo}>
              {[
                resumeData.address,
                resumeData.location,
                resumeData.city
              ].filter(Boolean).join(", ")}
            </Text>
          )}

          {/* Links in one line */}
          {(resumeData.linkedin || resumeData.github || resumeData.portfolio) && (
            <Text style={styles.contactInfo}>
              {[
                resumeData.linkedin,
                resumeData.github,
                resumeData.portfolio
              ].filter(Boolean).join(" | ")}
            </Text>
          )}
        </View>

        {/* Summary Section */}
        {resumeData.summary && resumeData.summary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>
              {stripHtml(resumeData.summary)}
            </Text>
          </View>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.divider} />
            {resumeData.experience.map((job, index) => {
              return <ExperienceItem key={index} job={job} index={index} />;
            })}
          </View>
        )}

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.divider} />
            {resumeData.education.map((edu, index) => {
              return <EducationItem key={index} education={edu} />;
            })}
          </View>
        )}

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>
              {resumeData.skills.map((skill, index) => {
                // Handle different skill data structures - ensure no empty strings
                let skillText = '';
                if (typeof skill === 'string') {
                  skillText = skill.trim();
                } else if (typeof skill === 'object' && skill !== null) {
                  skillText = (skill.name || skill.skill || skill.title || skill.technology || '').toString().trim();
                } else {
                  skillText = (skill || '').toString().trim();
                }
                return skillText && skillText.length > 0 ? skillText + (index < resumeData.skills.length - 1 ? ' • ' : '') : '';
              }).filter(text => text.length > 0).join('')}
            </Text>
          </View>
        )}

        {/* Fallback content if no sections are populated */}
        {!resumeData.summary && 
         (!resumeData.experience || resumeData.experience.length === 0) && 
         (!resumeData.education || resumeData.education.length === 0) && 
         (!resumeData.skills || resumeData.skills.length === 0) && (
          <View style={styles.section}>
            <Text style={styles.description}>
              Resume content is being processed. Please ensure all sections are properly filled out in the resume builder.
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Experience Item Component for PDF
const ExperienceItem = ({ job, index }) => {
  // Handle different possible property names for job data - ensure no empty strings
  const jobTitle = (job.position || 'Position Title').toString().trim();
  const company = (job.company || 'Company Name').toString().trim();
  const startDate = (job.startDate || 'Start').toString().trim();
  
  // Fix end date logic - handle current jobs properly
  let endDate;
  if (job.isCurrent || job.current || job.isCurrentJob || job.endDate === 'Present') {
    endDate = 'Present';
  } else {
    endDate = (job.endDate || job.endYear || job.to || 'Present').toString().trim();
    // Convert "End" to "Present" if it's likely a current job
    if (endDate === 'End' && (job.isCurrent || job.current)) {
      endDate = 'Present';
    }
  }
  
  const location = (job.location || job.city || job.address || '').toString().trim();
  
  // Try multiple possible field names for job descriptions
  const description = (
    job.jobSummary ||  // This is your main field based on the log
    job.summary || 
    job.description || 
    job.details || 
    job.jobDescription ||
    job.workDescription ||
    job.content ||
    job.duties ||
    ''
  ).toString().trim();
  
  console.log(`Experience ${index} - FULL JOB OBJECT:`, job);
  console.log(`Experience ${index} - Available Fields:`, Object.keys(job));
  console.log(`Experience ${index} - Description Field Value:`, description || 'NO DESCRIPTION FOUND');
  
  // Function to parse HTML content and extract bullet points
  const parseHtmlToBullets = (htmlContent) => {
    if (!htmlContent || typeof htmlContent !== 'string') return [];
    
    // Check if content contains HTML list structure
    if (htmlContent.includes('<ul>') && htmlContent.includes('<li>')) {
      // Extract content between <li> tags
      const liMatches = htmlContent.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (liMatches) {
        return liMatches.map(li => {
          // Remove HTML tags and decode entities
          return stripHtml(li.replace(/<\/?li[^>]*>/gi, '').trim());
        }).filter(bullet => bullet.length > 0);
      }
    }
    
    // Check for other HTML list structures or fallback to text parsing
    if (htmlContent.includes('<ol>') && htmlContent.includes('<li>')) {
      const liMatches = htmlContent.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (liMatches) {
        return liMatches.map(li => {
          return stripHtml(li.replace(/<\/?li[^>]*>/gi, '').trim());
        }).filter(bullet => bullet.length > 0);
      }
    }
    
    // If no HTML list structure, try to parse as plain text
    const plainText = stripHtml(htmlContent);
    
    // Try to split by periods and also common bullet separators
    let bullets = [];
    
    // First try splitting by periods for sentences
    const sentences = plainText.split(/\.(?=[A-Z])/);
    
    if (sentences.length > 2) {
      bullets = sentences;
    } else {
      // Try other potential separators
      const semicolonSplit = plainText.split(/;(?=\s*[A-Z])/);
      const pipeSplit = plainText.split(/\|/);
      const newlineSplit = plainText.split(/\n/);
      
      if (semicolonSplit.length > 1) bullets = semicolonSplit;
      else if (pipeSplit.length > 1) bullets = pipeSplit;
      else if (newlineSplit.length > 1) bullets = newlineSplit;
      else bullets = [plainText]; // Keep as single paragraph
    }
    
    // Clean and filter bullets
    return bullets
      .map(bullet => bullet.trim())
      .filter(bullet => bullet.length > 0);
  };
  
  // Parse the description into bullet points
  const bulletPoints = parseHtmlToBullets(description);
  console.log(`Job ${index} - Parsed bullets:`, bulletPoints);
  
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.jobTitle}>{jobTitle}</Text>
      <Text style={styles.company}>{company}</Text>
      <Text style={styles.dateLocation}>
        {startDate} - {endDate}{location && location.length > 0 ? ` | ${location}` : ''}
      </Text>
      
      {/* Render bullet points */}
      {bulletPoints && bulletPoints.length > 0 && (
        <View>
          {bulletPoints.length > 1 ? (
            // Render as bullet points if we have multiple items
            bulletPoints.map((bullet, bulletIndex) => (
              <Text key={bulletIndex} style={styles.bulletPoint}>
                • {bullet}{bullet.endsWith('.') ? '' : '.'}
              </Text>
            ))
          ) : (
            // Render as single paragraph if only one item
            <Text style={styles.description}>
              {bulletPoints[0]}
            </Text>
          )}
        </View>
      )}
      
      {/* Check for bullet points in different possible array fields (fallback) */}
      {(job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0) && (
        <View>
          {job.responsibilities.map((resp, respIndex) => {
            const respText = stripHtml((resp || '').toString().trim());
            return respText && respText.length > 0 ? (
              <Text key={respIndex} style={styles.bulletPoint}>
                • {respText}
              </Text>
            ) : null;
          }).filter(Boolean)}
        </View>
      )}
      
      {(job.achievements && Array.isArray(job.achievements) && job.achievements.length > 0) && (
        <View>
          {job.achievements.map((achievement, achIndex) => {
            const achText = stripHtml((achievement || '').toString().trim());
            return achText && achText.length > 0 ? (
              <Text key={achIndex} style={styles.bulletPoint}>
                • {achText}
              </Text>
            ) : null;
          }).filter(Boolean)}
        </View>
      )}
      
      {/* Check for bullet points in other possible fields */}
      {(job.duties && Array.isArray(job.duties) && job.duties.length > 0) && (
        <View>
          {job.duties.map((duty, dutyIndex) => {
            const dutyText = stripHtml((duty || '').toString().trim());
            return dutyText && dutyText.length > 0 ? (
              <Text key={dutyIndex} style={styles.bulletPoint}>
                • {dutyText}
              </Text>
            ) : null;
          }).filter(Boolean)}
        </View>
      )}
      
      {(job.bulletPoints && Array.isArray(job.bulletPoints) && job.bulletPoints.length > 0) && (
        <View>
          {job.bulletPoints.map((bullet, bulletIndex) => {
            const bulletText = stripHtml((bullet || '').toString().trim());
            return bulletText && bulletText.length > 0 ? (
              <Text key={bulletIndex} style={styles.bulletPoint}>
                • {bulletText}
              </Text>
            ) : null;
          }).filter(Boolean)}
        </View>
      )}
      
      {(job.tasks && Array.isArray(job.tasks) && job.tasks.length > 0) && (
        <View>
          {job.tasks.map((task, taskIndex) => {
            const taskText = stripHtml((task || '').toString().trim());
            return taskText && taskText.length > 0 ? (
              <Text key={taskIndex} style={styles.bulletPoint}>
                • {taskText}
              </Text>
            ) : null;
          }).filter(Boolean)}
        </View>
      )}
    </View>
  );
};

// Education Item Component for PDF
const EducationItem = ({ education }) => {
  const degree = (education.degree || education.qualification || education.title || education.program || 'Degree').toString().trim();
  const school = (education.school || education.institution || education.university || education.college || 'Institution').toString().trim();
  const startDate = (education.startDate || education.startYear || education.from || 'Start').toString().trim();
  const endDate = (education.endDate || education.endYear || education.to || education.graduationDate || 'End').toString().trim();
  const location = (education.location || education.city || education.address || '').toString().trim();
  
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.jobTitle}>{degree}</Text>
      <Text style={styles.company}>{school}</Text>
      <Text style={styles.dateLocation}>
        {startDate} - {endDate}{location && location.length > 0 ? ` | ${location}` : ''}
      </Text>
      {education.gpa && education.gpa.toString().trim().length > 0 && (
        <Text style={styles.description}>GPA: {education.gpa.toString().trim()}</Text>
      )}
      {(education.honors || education.achievements || education.description) && (
        (() => {
          const extraInfo = (education.honors || education.achievements || education.description || '').toString().trim();
          return extraInfo.length > 0 ? (
            <Text style={styles.description}>{extraInfo}</Text>
          ) : null;
        })()
      )}
    </View>
  );
};

export default ResumePDFDocument;