// resumeStyles.js
import { StyleSheet } from '@react-pdf/renderer';

const resumeStyles = StyleSheet.create({
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
    marginBottom: 6,
    color: '#1a1a1a',
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
    divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
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
    color: '#333',
  },
  skillItem: {
    fontSize: 10,
    color: '#333',
    marginBottom: 3,
  },

  section: {
    marginBottom: 16,
  },
});

export default resumeStyles;
