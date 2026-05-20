export type JobContentBlock =
  | { kind: 'callout'; title: string; body: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string; emphasis?: boolean }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'faq'; items: { question: string; answers: string[] }[] }
  | { kind: 'cities'; items: string[] };

export interface JobPageContent {
  imagePath: string;
  imageAlt: string;
  h1: string;
  slogan: string;
  intro?: string;
  metaTitle: string;
  metaDescription: string;
  body: JobContentBlock[];
}
