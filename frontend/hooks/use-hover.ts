import { useState } from 'react';

const useHover = () => {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
    hovered,
  };
};

export default useHover;
