import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LoadingSpinner = ({
  size = 'default',
  tip,
  delay = 0,
  fullscreen = false,
  className,
  wrapperClassName,
  indicator,
  overlayColor = 'rgba(255, 255, 255, 0.75)',
  spinnerColor,
  textColor,
  centered = true,
  backgroundBlur = false,
}) => {
  // Size validation and mapping
  const validatedSize = ['small', 'default', 'large'].includes(size) ? size : 'default';
  
  // Dynamic classes using classNames
  const spinnerClasses = classNames(
    {
      'custom-spinner': true,
      [`spinner-color-${spinnerColor}`]: spinnerColor,
    },
    className
  );

  const wrapperClasses = classNames(
    {
      'spinner-wrapper': true,
      'flex items-center justify-center': centered,
      'text-center': centered,
    },
    wrapperClassName
  );

  const overlayClasses = classNames(
    'fixed inset-0 z-[9999] transition-opacity duration-300',
    {
      'backdrop-blur-sm': backgroundBlur,
    }
  );

  const spinnerElement = (
    <Spin
      size={validatedSize}
      tip={tip}
      delay={delay}
      indicator={indicator}
      className={spinnerClasses}
      wrapperClassName={wrapperClasses}
      style={{
        '--spinner-color': spinnerColor,
        '--text-color': textColor,
      }}
    />
  );

  if (fullscreen) {
    return (
      <div 
        className={overlayClasses}
        style={{ backgroundColor: overlayColor }}
        role="status"
        aria-live="polite"
        aria-label={tip || 'Loading content'}
      >
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

LoadingSpinner.propTypes = {
  /** Size of the spinner */
  size: PropTypes.oneOf(['small', 'default', 'large']),
  /** Optional text displayed below the spinner */
  tip: PropTypes.string,
  /** Delay in milliseconds before showing the spinner */
  delay: PropTypes.number,
  /** Whether to display spinner as fullscreen overlay */
  fullscreen: PropTypes.bool,
  /** Additional class name for the spinner */
  className: PropTypes.string,
  /** Additional class name for the wrapper */
  wrapperClassName: PropTypes.string,
  /** Custom indicator element to replace default spinner */
  indicator: PropTypes.node,
  /** Color of the fullscreen overlay */
  overlayColor: PropTypes.string,
  /** Custom color for the spinner */
  spinnerColor: PropTypes.string,
  /** Custom color for the text */
  textColor: PropTypes.string,
  /** Whether to center the spinner in its container */
  centered: PropTypes.bool,
  /** Whether to add a blur effect to the background */
  backgroundBlur: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  size: 'default',
  delay: 0,
  fullscreen: false,
  centered: true,
  backgroundBlur: false,
  overlayColor: 'rgba(255, 255, 255, 0.75)',
};

export default LoadingSpinner;