export type ChatMessageDto = {
  fullName: string;
  sender: number;
  content: string;
  type: string;
  projectId: number;
  sent?: Date;
};
