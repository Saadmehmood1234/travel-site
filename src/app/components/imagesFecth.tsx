"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

type PixabayImage = {
  id: number;
  webformatURL: string;
  tags: string;
};

export default function Home() {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(
        `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_KEY}&q=travel&image_type=photo&per_page=20&page=${page}`
      );
      const data = await res.json();
      setImages((prev) => [...prev, ...data.hits]);
    };
    fetchImages();
  }, [page]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <Image
            key={img.id}
            src={img.webformatURL}
            alt={img.tags}
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setPage((p) => p + 1)}
      >
        Load More
      </button>
    </div>
  );
}
