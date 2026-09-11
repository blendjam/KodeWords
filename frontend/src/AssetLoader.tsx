import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const assets = [
  "/kodewords/texture.png",
  "/kodewords/assets/agent/blue.png",
  "/kodewords/assets/agent/gray.png",
  "/kodewords/assets/agent/red.png",
  "/kodewords/assets/bg/black.png",
  "/kodewords/assets/bg/blue.png",
  "/kodewords/assets/bg/gray.png",
  "/kodewords/assets/bg/red.png",
  "/kodewords/assets/card/black.png",
  "/kodewords/assets/card/blue.png",
  "/kodewords/assets/card/gray.png",
  "/kodewords/assets/card/red.png",
  "/kodewords/assets/icon/fullscreen.png",
];

function AssetLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const promises = assets.map(asset => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = asset;
            img.onload = () => resolve();
            img.onerror = () => reject(`Failed to load asset: ${asset}`);
          });
        });
        await Promise.all(promises);
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Handle asset loading error, maybe show an error message
      }
    };

    preloadAssets();
  }, []);

  if (loading) {
    return <div className="LoadingScreen">Loading Assets...</div>;
  }

  return <Outlet />;
}

export default AssetLoader;
