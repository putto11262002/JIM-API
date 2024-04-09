'use client'
import { useState } from "react";
import Gallery from "../../../../components/image-gallery";
import { ModelImage } from "@jimmodel/shared";
import { cn } from "../../../../lib/utils";


const Tab = {
    BOOK: "book", 
    COMPOSITE: "composite",
    POLAROID: "polaroid"
}

function MediaTab({images}: {images: ModelImage[]}) {
    const [activeTab, setActiveTab] = useState<string>("book")
   const filteredImage = images.filter(image => image.type === activeTab).map((image) => ({
        src: image.url,
        width: image.width,
        height: image.height,
      })) 
  return (
    <div>
   
      <div className="">
        <div className=" py-1 px-2 flex justify-around gap-2 rounded-3xl bg-muted text-sm mx-auto max-w-[300px]">
          <MediaTabListItem label="Book" onSelect={() => setActiveTab(Tab.BOOK)} selected={activeTab === Tab.BOOK}/>
          <MediaTabListItem label="Composite" onSelect={() => setActiveTab(Tab.COMPOSITE)} selected={activeTab === Tab.COMPOSITE}/>
          <MediaTabListItem label="Polaroid" onSelect={() => setActiveTab(Tab.POLAROID)} selected={activeTab === Tab.POLAROID}/>
        </div>
      </div>
      <div className="mt-5">
       {filteredImage.length < 1 ? <p className="text-center text-sm text-muted-foreground">No Media Avaialble</p>  : <Gallery
          enableImageSelection={false}
          images={
           
            filteredImage
          }
          rowHeight={250}
          
        />}
      </div>
    </div>
  );
}

function MediaTabListItem({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <div
      onClick={() => onSelect()}
      className={cn("grow py-0.5 rounded-2xl text-center cursor-pointer", selected ? "bg-primary text-white" : "bg-muted text-primary")}
    >
      {label}
    </div>
  );
}

export default MediaTab;
