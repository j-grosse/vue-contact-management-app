import confetti from 'canvas-confetti';

export const useConfetti = (friend = null) => {

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
    } 

  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(400, 1000),
    ticks: 100,
    particleCount: randomInRange(150, 250),
    origin: { y: 0.4},
    scalar: 1.5,
  });

  if (friend) {
    showFriendImage(friend);
  }
}

function showFriendImage(friend) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none';
  overlay.style.animation = 'fadeInOut 2.5s ease-in-out forwards';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'bg-white dark:bg-gray-800 rounded-full p-1 shadow-2xl border-1 border-white';
  imageContainer.style.transform = 'scale(0)';
  imageContainer.style.animation = 'scaleInOut 2.5s ease-in-out forwards';
  
  const img = document.createElement('img');
  img.src = friend.photo || 'https://i.imgur.com/tdi3NGa.png';
  img.alt = friend.name;
  img.className = 'w-64 h-64 rounded-full object-cover';
  
//   const nameLabel = document.createElement('div');
//   nameLabel.className = 'text-center mt-2 text-sm font-medium text-gray-800 dark:text-gray-200';
//   nameLabel.textContent = friend.name;
  
  imageContainer.appendChild(img);
//   imageContainer.appendChild(nameLabel);
  overlay.appendChild(imageContainer);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    @keyframes scaleInOut {
      0% { transform: scale(0); }
      10% { transform: scale(1.2); }
      20% { transform: scale(1); }
      70% { transform: scale(1); }
      100% { transform: scale(0); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, 4000);
}
