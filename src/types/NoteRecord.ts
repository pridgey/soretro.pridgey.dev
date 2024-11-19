export type NoteRecord = {
  id?: string;
  session: string;
  user: string;
  note: string;
  x: number;
  y: number;
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};
