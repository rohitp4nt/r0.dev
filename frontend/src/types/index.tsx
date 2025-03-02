export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript
  }
  export interface Step {
    id: number;
  title: string;
  status: 'pending' | 'completed' | 'in-progress';  
  code?: string;  
  path?: string;
    type: StepType;
  }

  export interface FileItem {
    id: number;
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    content?: string;
    path: string;
  }

  