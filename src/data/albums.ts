import metadata from "../../.astro/photo-metadata.json";
export interface Photo {
  filename: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
}
export interface Album {
  slug: string;
  title: string;
  date: string;
  sortDate: string;
  description: string;
  coverImage: string;
  photos: Photo[];
}
const files = import.meta.glob<Album>("./albums/*.json", {
  eager: true,
  import: "default",
});
export const albums = Object.values(files).sort((a, b) =>
  b.sortDate.localeCompare(a.sortDate),
);
export const photoPath = (album: Album, filename: string) =>
  `/photos/${album.slug}/${filename}`;

export function thumbnail(album: Album, photo: Photo) {
  return (
    metadata as Record<
      string,
      { thumbnailUrl: string; width: number; height: number }
    >
  )[`${album.slug}/${photo.filename}`];
}
