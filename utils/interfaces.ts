export type ImageStatus = "GENERATING" | "READY" | "";
export interface ContentEvent {
  Content: string;
  cursor: string;
  imageUrl: string;
  imageStatus: ImageStatus;
}
