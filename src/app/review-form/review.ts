export interface IReview {
  readonly _id?: string;
  readonly group: string;
  readonly tags: string[];
  readonly content: string;
  readonly images: string[];
  readonly rating: number;
  readonly authorId: string;
  readonly name: string;
}
