import { nanoid } from "nanoid";

export type TodoType = {
  id: string;
  title: string;
};

const initialState: TodoType[] = [
  { id: nanoid(5), title: "DohKyungSoo" },
  { id: nanoid(5), title: "Kiyo" },
];

export default initialState;
