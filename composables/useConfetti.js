import confetti from 'canvas-confetti';

export const useConfetti = () => {
  confetti({
    particleCount: 20,
    spread: 90,
    origin: { y: 0.7 }
  });
}
