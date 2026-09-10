import { useState } from "react";

export function FullScreenButton({ className }: { className?: string }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const onButtonClick = () => {
    const isMobile = window.innerWidth < 868;
    setIsFullScreen(!isFullScreen);
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }

    if (isMobile) {
      if (isFullScreen) {
        window.screen.orientation.unlock();
      } else {
        window.screen.orientation.lock("landscape-primary");
      }
    }
  };
  return (
    <button
      className={`flex items-center justify-center w-10 h-10 rounded-lg bg-white border-gray-500 border-2 ${className}`}
      onClick={onButtonClick}>
      <img className="w-6 h-6" src="/KodeWords/assets/icon/fullscreen.png" />
    </button>
  );
}
