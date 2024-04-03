import { ReactNode, useMemo } from "react";
function ImageGallery<T extends { url: string }>({
  images,
  overlayContent,
}: {
  images: T[];
  overlayContent?: (image: T) =>  ReactNode;
}) {
  const grid = useMemo(() => {
    const grid: T[][] = [];
    const numCol = 3;

    for (let i = 0; i < numCol; i++) {
      grid.push([]);
    }

    let curInx = 0;
    while (curInx < images.length) {
      const c = curInx % 3;
      grid[c].push(images[curInx]);
      curInx++;
    }

    return grid;
  }, [images]);

  return (
    <div className="grid grid-cols-3 gap-3 h-auto">
      {grid.map((col, i) => (
        <div key={i} className="flex flex-col gap-3 h-auto">
          {col.map((image, j) => (
            <div key={j} className="group relative  h-auto">
              {overlayContent && (
                <div className="absolute  bg-slate-700 bg-opacity-50 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  {overlayContent(image)}
                </div>
              )}
              <img className="w-full h-full" src={image.url} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ImageGallery;
