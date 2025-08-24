"use client";

import { Button } from '@/components/ui/button';
import DownloadIcon from "../../../../../assets/downloadicon.png";
import PrintIcon from "../../../../../assets/printericon.png";
import ShareIcon from "../../../../../assets/shareicon.png";
import EditIcon from "../../../../../assets/editicon.png";
import Image from 'next/image';
import { useResume } from '@/context/resume';
import { useState, useEffect, useRef } from 'react';
import PrintPreviewCard from '@/components/cards/print-preview-card';
import { useRouter } from 'next/navigation';

// React-PDF imports
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Register fonts for better ATS compatibility - with fallbacks
try {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', fontWeight: 'normal' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hiJ-Ek-_EeA.woff2', fontWeight: 'bold' },
    ],
  });
} catch (error) {
  console.error('Font registration failed:', error);
}

// PDF Styles - Clean and ATS-friendly
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica', // Changed from 'Inter' to system font as fallback
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  contactInfo: {
    fontSize: 10,
    color: '#4a4a4a',
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1a1a1a',
    marginTop: 4,
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 8,
    color: '#333',
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 12,
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    fontSize: 10,
    color: '#333',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
  },
});

// Helper function to safely get nested properties
const safeGet = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

// PDF Document Component
const ResumePDF = ({ resume }) => {
  if (!resume) {
    console.log('ResumePDF: No resume data provided');
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
  
  console.log('ResumePDF: Processing resume with name:', resumeData.name);
  console.log('ResumePDF: Experience items:', resumeData.experience.length);
  console.log('ResumePDF: Full experience data:', resumeData.experience);

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
              // Handle different possible property names for job data - ensure no empty strings
              const jobTitle = (job.position || 'Position Title').toString().trim();
              const company = (job.company ||  'Company Name').toString().trim();
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
                <View key={index} style={{ marginBottom: 12 }}>
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
            })}
          </View>
        )}

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.divider} />
            {resumeData.education.map((edu, index) => {
              const degree = (edu.degree || edu.qualification || edu.title || edu.program || 'Degree').toString().trim();
              const school = (edu.school || edu.institution || edu.university || edu.college || 'Institution').toString().trim();
              const startDate = (edu.startDate || edu.startYear || edu.from || 'Start').toString().trim();
              const endDate = (edu.endDate || edu.endYear || edu.to || edu.graduationDate || 'End').toString().trim();
              const location = (edu.location || edu.city || edu.address || '').toString().trim();
              
              return (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={styles.jobTitle}>{degree}</Text>
                  <Text style={styles.company}>{school}</Text>
                  <Text style={styles.dateLocation}>
                    {startDate} - {endDate}{location && location.length > 0 ? ` | ${location}` : ''}
                  </Text>
                  {edu.gpa && edu.gpa.toString().trim().length > 0 && (
                    <Text style={styles.description}>GPA: {edu.gpa.toString().trim()}</Text>
                  )}
                  {(edu.honors || edu.achievements || edu.description) && (
                    (() => {
                      const extraInfo = (edu.honors || edu.achievements || edu.description || '').toString().trim();
                      return extraInfo.length > 0 ? (
                        <Text style={styles.description}>{extraInfo}</Text>
                      ) : null;
                    })()
                  )}
                </View>
              );
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

export default function DownloadResumePage({ params }) {
  const { resumes } = useResume();
  const [currentResume, setCurrentResume] = useState(null);
  const router = useRouter();
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      const padding = 32;
      const availableWidth = windowWidth - padding;
      const a4WidthMm = 210;
      const mmToPx = 3.779527559;
      const a4WidthPx = a4WidthMm * mmToPx;
      if (availableWidth < a4WidthPx) {
        return availableWidth / a4WidthPx;
      }
    }
    return 1;
  });
  const resumeRef = useRef(null);

  useEffect(() => {
    if (resumes && params?._id) {
      const resume = resumes.find((resume) => resume._id === params._id);
      console.log('Found resume:', resume);
      console.log('Resume structure:', resume ? Object.keys(resume) : 'No resume found');
      if (resume) {
        console.log('Resume data structure:');
        console.log('- Name:', resume.name || resume.personalInfo?.name || 'NOT FOUND');
        console.log('- Email:', resume.email || resume.personalInfo?.email || 'NOT FOUND');
        console.log('- Experience count:', (resume.experience || []).length);
        console.log('- Education count:', (resume.education || []).length);
        console.log('- Skills count:', (resume.skills || []).length);
      }
      setCurrentResume(resume);
    }
  }, [resumes, params._id]);

  useEffect(() => {
    const updateScale = () => {
      if (typeof window !== 'undefined') {
        const windowWidth = window.innerWidth;
        const padding = 32;
        const availableWidth = windowWidth - padding;
        const a4WidthMm = 210;
        const mmToPx = 3.779527559;
        const a4WidthPx = a4WidthMm * mmToPx;
        if (availableWidth < a4WidthPx) {
          setScale(availableWidth / a4WidthPx);
        } else {
          setScale(1);
        }
      }
    };

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const createSafeFilename = (resume) => {
    if (!resume) return `resume-${params._id}`;
    
    // Try multiple possible name locations
    const name = resume.personalInfo?.name || resume.name || resume.fullName;
    
    if (!name) return `resume-${params._id}`;
    
    const safeName = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    return `${safeName}_resume`;
  };

// Resume Print from here
const printResume = () => {
  if (typeof window !== 'undefined' && currentResume && resumeRef.current) {
    const printWindow = window.open('', '_blank');
    const resumeContent = resumeRef.current.innerHTML;
    
    // Get all stylesheets from the current page
    const stylesheets = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle CORS issues with external stylesheets
          console.warn('Could not access stylesheet:', styleSheet.href);
          return '';
        }
      })
      .join('\n');

    // Get computed styles for common elements to ensure they're preserved
    const getComputedStylesForElement = (selector) => {
      const element = resumeRef.current.querySelector(selector);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        return {
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          color: computedStyle.color,
          lineHeight: computedStyle.lineHeight,
          marginTop: computedStyle.marginTop,
          marginBottom: computedStyle.marginBottom,
          paddingTop: computedStyle.paddingTop,
          paddingBottom: computedStyle.paddingBottom,
        };
      }
      return {};
    };

    // Extract key styles for common resume elements
    const titleStyle = getComputedStylesForElement('h1, .name, .resume-name');
    const sectionTitleStyle = getComputedStylesForElement('h2, .section-title');
    const jobTitleStyle = getComputedStylesForElement('.job-title, .position-title');
    const companyStyle = getComputedStylesForElement('.company, .company-name');
    const bulletStyle = getComputedStylesForElement('.bullet-point, ul li');

    const createStyleString = (styles) => {
      return Object.entries(styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join(' ');
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Resume - ${currentResume.name || 'Resume'}</title>
          <meta charset="utf-8">
          <style>
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            
            * {
              box-sizing: border-box;
            }
            
            body { 
              margin: 0; 
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 10px; 
              line-height: 1.2; 
              color: #333;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .print-container { 
              background: white; 
              width: 100%;
              max-width: none;
              padding: 0;
              margin: 0;
            }
            
            /* Prevent awkward breaks */
            .job-entry, .education-entry, .section { 
              page-break-inside: avoid; 
              margin: 0 0 4px 0;
              padding: 0;
            }
            
            h1, h2, h3, .section-title { 
              page-break-after: avoid; 
              margin: 0;
              padding: 0;
            }
            
            /* Resume-specific styles - BLACK AND WHITE ONLY */
            h1, .name, .resume-name {
              font-size: 20px !important;
              font-weight: 700 !important;
              margin: 0 !important;
              padding: 0 !important;
              color: black !important;
              text-decoration: none !important;
            }
            
            h2, .section-title {
              font-size: 13px !important;
              font-weight: 600 !important;
              margin: 8px 0 3px 0 !important;
              padding: 0 0 1px 0 !important;
              color: black !important;
              border-bottom: 1px solid black !important;
              text-decoration: none !important;
            }
            
            .job-title, .position-title {
              font-size: 11px !important;
              font-weight: 600 !important;
              color: black !important;
              margin: 4px 0 1px 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
            }
            
            .company, .company-name {
              font-size: 10px !important;
              font-weight: 500 !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
            }
            
            .date-location, .date-range {
              font-size: 9px !important;
              color: black !important;
              margin: 0 0 2px 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
            }
            
            .bullet-point, .description {
              font-size: 9px !important;
              line-height: 1.2 !important;
              color: black !important;
              margin: 1px 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
            }
            
            .bullet-point {
              margin-left: 8px !important;
              text-indent: -8px !important;
            }
            
            /* Contact info */
            .contact-info, .contact-info * {
              font-size: 9px !important;
              color: black !important;
              margin: 0 0 4px 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
              line-height: 1.2 !important;
            }
            
            /* Skills and other sections */
            .skills-list, .skill-item {
              font-size: 9px !important;
              color: black !important;
              text-decoration: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Dividers */
            .divider, hr {
              border: none !important;
              border-bottom: 1px solid black !important;
              margin: 2px 0 !important;
              padding: 0 !important;
            }
            
            /* Remove ALL colors and underlines */
            * {
              color: black !important;
              text-decoration: none !important;
            }
            
            a, a:visited, a:hover, a:active {
              color: black !important;
              text-decoration: none !important;
            }
            
            /* Ensure proper spacing - MINIMAL GAPS */
            p {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            div {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Remove any default spacing from common elements */
            ul, ol {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            li {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Hide any unwanted elements */
            button, .no-print, .print-button {
              display: none !important;
            }
            
            /* Custom styles from your app */
            ${stylesheets}
          </style>
        </head>
        <body>
          <div class="print-container">
            ${resumeContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content and styles to load before printing
    setTimeout(() => {
      printWindow.print();
      // Don't auto-close to let user see the preview
      // printWindow.close();
    }, 1500);
  }
};

// Resume share starts here
  const shareResume = () => {
    if (navigator.share && currentResume) {
      const userName = currentResume?.personalInfo?.name || currentResume?.name || 'Professional';
      navigator.share({
        title: `${userName}'s Resume`,
        text: `Check out ${userName}'s professional resume`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Resume link copied to clipboard!');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Resume link copied to clipboard!');
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-gray-100">
      <div className="max-w-4xl text-center w-full">
        <h2 className="font-bold text-lg sm:text-xl mb-4 px-2">
          🎉 Congratulations on finishing your ATS-Ready CV!
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-10 text-sm sm:text-base px-2">
          Your resume is now optimized for ATS systems with searchable text and proper formatting.
          Download as PDF, print, or share with your network.
        </p>

        {/* Resume Preview */}
        <div 
          ref={resumeRef}
          className="resume-pdf-container shadow-lg mx-auto bg-white overflow-hidden"
          style={{
            width: 'min(100%, 210mm)',
            minHeight: 'auto',
            boxSizing: 'border-box',
            padding: 'clamp(10px, 3vw, 15mm)',
          }}
        >
          {currentResume ? (
            <PrintPreviewCard resume={currentResume} />
          ) : (
            <div className="flex justify-center items-center h-32 sm:h-64">
              <p className="text-sm sm:text-base">Loading resume...</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-10 mt-6 sm:mt-8 px-4">
          {/* Edit Button */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={EditIcon} 
                alt="edit icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={() => router.push(`/dashboard/resume/edit/${params._id}`)}
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Edit
            </Button>
          </div>

          {/* Download Button - Now uses React-PDF */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={DownloadIcon} 
                alt="download icon" 
                fill
                className="object-contain"
              />
            </div>
            {currentResume ? (
              <PDFDownloadLink
                document={<ResumePDF resume={currentResume} />}
                fileName={`${createSafeFilename(currentResume)}.pdf`}
                className="w-full sm:w-32"
              >
                {({ blob, url, loading, error }) => {
                  if (error) {
                    console.error('PDF generation error:', error);
                  }
                  return (
                    <Button 
                      className="w-full sm:w-32 text-sm"
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : error ? 'Error - Try Again' : 'Download PDF'}
                    </Button>
                  );
                }}
              </PDFDownloadLink>
            ) : (
              <Button className="w-full sm:w-32 text-sm" disabled>
                Download PDF
              </Button>
            )}
          </div>

          {/* Print Button */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={PrintIcon} 
                alt="print icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={printResume} 
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Print
            </Button>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 relative">
              <Image 
                src={ShareIcon} 
                alt="share icon" 
                fill
                className="object-contain"
              />
            </div>
            <Button 
              onClick={shareResume} 
              className="w-full sm:w-32 text-sm" 
              disabled={!currentResume}
            >
              Share
            </Button>
          </div>
        </div>

        <div className="my-10 sm:my-20" />
      </div>
    </div>
  );
}