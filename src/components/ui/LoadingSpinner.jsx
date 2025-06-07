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
  const validatedSize = ['small', 'default', 'large'].includes(size) ? size : 'default';

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
  size: PropTypes.oneOf(['small', 'default', 'large']),
  tip: PropTypes.string,
  delay: PropTypes.number,
  fullscreen: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  indicator: PropTypes.node,
  overlayColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  textColor: PropTypes.string,
  centered: PropTypes.bool,
  backgroundBlur: PropTypes.bool,
};

export default LoadingSpinner;
