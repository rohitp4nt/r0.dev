import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FolderTree, ChevronRight, ArrowLeft, Code, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";

const BuilderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state || { prompt: '' };
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('// Select a file to view its contents');

  // Mock steps for demonstration
  const steps = [
    { id: 1, title: 'Initialize Project', status: 'completed' },
    { id: 2, title: 'Setup Dependencies', status: 'in-progress' },
    { id: 3, title: 'Generate Components', status: 'pending' },
    { id: 4, title: 'Apply Styling', status: 'pending' },
    { id: 5, title: 'Optimize & Build', status: 'pending' },
  ];

  // Mock file structure for demonstration
  const files = [
    { id: 1, name: 'package.json', type: 'file', content: '{\n  "name": "example",\n  "version": "1.0.0"\n}' },
    { id: 2, name: 'src', type: 'folder', items: [
      { id: 3, name: 'App.tsx', type: 'file', content: 'function App() {\n  return <div>Hello World</div>;\n}' },
      { id: 4, name: 'components', type: 'folder', items: [
        { id: 5, name: 'Header.tsx', type: 'file', content: 'export const Header = () => {\n  return <header>Header</header>;\n}' },
        { id: 6, name: 'Footer.tsx', type: 'file', content: 'export const Footer = () => {\n  return <footer>Footer</footer>;\n}' },
      ]},
    ]},
  ];

  const handleFileSelect = (file: any) => {
    if (file.type === 'file') {
      setSelectedFile(file.name);
      setFileContent(file.content);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-300 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        
        <h2 className="text-lg font-semibold mb-4 text-white">Build Steps</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg ${
                step.status === 'completed'
                  ? 'bg-green-900/50 text-green-300'
                  : step.status === 'in-progress'
                  ? 'bg-indigo-900/50 text-indigo-300'
                  : 'bg-gray-700/50 text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 mr-2" />
                <span>{step.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-white">Building Your Website</h1>
            <p className="text-gray-400">Based on prompt: {prompt}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 mb-4 flex space-x-4">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
        </div>

        <div className="flex-1 px-8 pb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg h-full overflow-hidden flex">
            {/* File Explorer */}
            <div className="w-64 border-r border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FolderTree className="h-6 w-6 text-indigo-400 mr-3" />
                <h2 className="text-lg font-semibold text-white">Project Files</h2>
              </div>
              
              <div className="space-y-2">
                {files.map((file) => (
                  <FileItem 
                    key={file.id} 
                    file={file} 
                    level={0} 
                    onSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === 'code' ? (
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  theme="vs-dark"
                  value={fileContent}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              ) : (
                <iframe
                  src="/preview"
                  className="w-full h-full bg-white"
                  title="Website Preview"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FileItemProps {
  file: {
    id: number;
    name: string;
    type: string;
    items?: Array<any>;
    content?: string;
  };
  level: number;
  onSelect: (file: any) => void;
  selectedFile: string | null;
}

const FileItem: React.FC<FileItemProps> = ({ file, level, onSelect, selectedFile }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer ${
          file.type === 'folder' 
            ? 'text-indigo-400' 
            : selectedFile === file.name
            ? 'bg-gray-700 text-white'
            : 'text-gray-300'
        }`}
        onClick={() => {
          if (file.type === 'folder') {
            setIsOpen(!isOpen);
          } else {
            onSelect(file);
          }
        }}
      >
        {file.type === 'folder' && (
          <ChevronRight
            className={`h-4 w-4 mr-2 transition-transform ${
              isOpen ? 'transform rotate-90' : ''
            }`}
          />
        )}
        <span>{file.name}</span>
      </div>
      
      {isOpen && file.items && (
        <div className="mt-1">
          {file.items.map((item) => (
            <FileItem 
              key={item.id} 
              file={item} 
              level={level + 1} 
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuilderPage;