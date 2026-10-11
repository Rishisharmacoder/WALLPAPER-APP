import { API_KEY } from "@/constants/config";

const BASE_URL = 'https://pixabay.com/api/'


export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL?: string;
  imageURL?: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export const fetchWallpapers = async (
  query: string = "",
  category: string = "",
  colors: string = "",
  page: number = 1,
) => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: "photo",
      safeSearch: "true",
      editors_choice: "true",
      per_page: "20",
      page: page.toString(),
    });

    if (category) params.append("category", category);
    if (colors) params.append("colors", colors);

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      console.error("Pixabay API Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response body:", text);
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data: PixabayResponse = await response.json();

    return data.hits;
  } catch (error) {
    console.error(error);
  }
};