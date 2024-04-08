
import React from 'react';
import { FaUsers, FaRegCalendarAlt, FaDollarSign } from 'react-icons/fa';
import Image from 'next/image'; // Import Image component from next/image

import jobscan from '../assets/icons/jobscan.png'; // Import your local icons
import simplify from '../assets/icons/simplify.png';
 
// Define a type for FlexDirection
type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type TextAlign = 'left' | 'right' | 'center' | 'justify';

const StatsSection: React.FC = () => {
  return (
    <div style={styles.statsSection}>
      <StatItem label="JobScan ATS resume match rate" value={"70%+ "} icon={<FaDollarSign />} />
      <StatItem label="Simplify.jobs resume match score" value={"80%+"} icon={<FaDollarSign />} />
      <StatItem label="Completely Free" value="$0" icon={<FaDollarSign />} />
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  icon: JSX.Element;
}

const styles = {
  statsSection: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '60px',
    marginBottom: '30px',
  },
  statItem: {
    textAlign: 'center' as TextAlign,
    fontSize: '18px',
    marginBottom: '20px',
    display: 'flex',
    FlexDirection: 'row', // Arrange items horizontally
    alignItems: 'center',
    justifyContent: 'space-between', // Space between value and label
  },
  label: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#333',
    textAlign: 'left' as TextAlign, // Ensure textAlign is of type TextAlign
    maxWidth: '220px',
    lineHeight: 1.2
  },
  value: {
    fontSize: '38px',
    color: '#333',
    fontWeight: 600,
    marginRight: '10px', // Add spacing between value and label
  },
};

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
  return (
    <div style={styles.statItem}> 

      {/* <div style={styles.icon}>{icon}</div> */}
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div> 
    </div>
  );
};

export default StatsSection;
