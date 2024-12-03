export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1] // Custom easing for smooth resting
    }
  }
};

export const fadeIn = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

export const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

// For staggered children animations
export const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

// For hover animations
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1]
  }
};

// For tap animations
export const tapScale = {
  scale: 0.98,
  transition: {
    duration: 0.2,
    ease: [0.32, 0.72, 0, 1]
  }
};
