import React from 'react';
import '../styles/components/button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  // Build Overwatch CSS classes
  const owClasses = ['ow-button'];
  
  // Add variant class
  if (variant === 'secondary') {
    owClasses.push('ow-button--secondary');
  } else if (variant === 'outline') {
    owClasses.push('ow-button--outline');
  }
  
  // Add size class
  if (size === 'small') {
    owClasses.push('ow-button--small');
  } else if (size === 'large') {
    owClasses.push('ow-button--large');
  }
  
  return (
    <button
      className={`${owClasses.join(' ')} ${className}`}
      onBlur={(e) => e.currentTarget.blur()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;