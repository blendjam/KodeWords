import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const assets = [
  "/KodeWords/texture.png",
  "/KodeWords/assets/agent/blue.png",
  "/KodeWords/assets/agent/gray.png",
  "/KodeWords/assets/agent/red.png",
  "/KodeWords/assets/bg/black.png",
  "/KodeWords/assets/bg/blue.png",
  "/KodeWords/assets/bg/gray.png",
  "/KodeWords/assets/bg/red.png",
  "/KodeWords/assets/card/black.png",
  "/KodeWords/assets/card/blue.png",
  "/KodeWords/assets/card/gray.png",
  "/KodeWords/assets/card/red.png",
  "/KodeWords/assets/icon/fullscreen.png",
];

function AssetLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const promises = assets.map((asset) => {
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
