

import { Trash } from "lucide-react";
import { useMemo } from "react";
function ImageGallery<T extends {url: string}>({ images }: { images: T[]}) {
  

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
  
      return grid
    }, [images]);
    return (
      <div className="grid grid-cols-3 gap-3">
          {
              grid.map((col) => (
                  <div className="flex flex-col gap-3">
                      {
                          col.map((image) => (
                             <div className="group relative">
                              <div className="absolute  bg-slate-700 bg-opacity-50 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                                  <div className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full">
                                      <Trash className="w-4 h-4 text-black"/>
                                  </div>
                              </div>
                               <img className="w-full h-auto" src={image.url}/>
                             </div>
                          ))
                      }
                  </div>
              ))
          }
      </div>
    );
}

  
export default ImageGallery