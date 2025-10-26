'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, Users, Video, Brush } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [active, setActive] = useState('document');

  // Update active button based on current route
  useEffect(() => {
    if (pathname.startsWith('/document')) {
      setActive('document');
    } else if (pathname.startsWith('/whiteboard')) {
      setActive('whiteboard');
    } else if (pathname.startsWith('/videocallpop')) {
      setActive('video');
    } else if (pathname.startsWith('/member')) {
      setActive('members');
    } 
  }, [pathname]);

  const handleClick = (section) => {
    setActive(section);
    switch (section) {
      case 'document':
        router.push('/document'); 
        break;
      case 'whiteboard':
        router.push('/whiteboard');
        break;
      case 'video':
        router.push('/videocallpop');
        break;
      case 'members':
        router.push('/members');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="bg-gray-900 text-white w-16 md:w-56 flex flex-col items-center md:items-stretch p-2 space-y-3">
      <h1 className="hidden md:block text-xl font-bold mb-4 text-center">Workspace</h1>

      

      <button
        onClick={() => handleClick('document')}
        className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 ${
          active === 'document' ? 'bg-gray-700' : ''
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="hidden md:inline">Documents</span>
      </button>

      <button
        onClick={() => handleClick('whiteboard')}
        className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 ${
          active === 'whiteboard' ? 'bg-gray-700' : ''
        }`}
      >
        <Brush className="w-5 h-5" />
        <span className="hidden md:inline">Whiteboard</span>
      </button>

      <button
        onClick={() => handleClick('video')}
        className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 ${
          active === 'video' ? 'bg-gray-700' : ''
        }`}
      >
        <Video className="w-5 h-5" />
        <span className="hidden md:inline">Video Call</span>
      </button>

      <button
        onClick={() => handleClick('members')}
        className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 ${
          active === 'members' ? 'bg-gray-700' : ''
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="hidden md:inline">Members</span>
      </button>
    </div>
  );
}
