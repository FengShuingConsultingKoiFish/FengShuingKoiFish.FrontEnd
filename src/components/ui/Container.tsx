import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="max-w-[2520px] mx-auto xl:px-[70px] md:px-10 sm:px-[120px] px-4 relative z-30 bg-transparent">
      {children}
    </div>
  );
};

export default Container;
