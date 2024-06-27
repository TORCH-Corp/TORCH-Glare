import React, { ReactNode, useRef } from 'react';
import './style.scss';
import useDirectionCalc from '../../../hooks/useDirectionCalc';

interface Props {
  children: ReactNode;
  active: boolean; // if the component is active will be visible
  onClick?: () => void;
}


// this component is used with and dropdown menu to change the direction when hit the viewport
export const DynamicContainer: React.FC<Props> = ({ children, active, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  // useDirectionCalc hook used to change the direction of the child based on the viewport
  const dir = useDirectionCalc({
    ElementRef: ref,
    dirClasses: {
      left: '',
      right: '',
      top: 'Dynamic-Container-top',
      bottom: '',
    },
    isElementActive: active,
    trigger: children,
  });

  return (
    <section
      onClick={onClick}
      ref={ref}
      className={`Dynamic-Container ${dir}`}
      style={{ display: active ? 'flex' : 'none' }}
    >
      {children}
    </section>
  );
};
