'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMembers, addMember, removeMember } from '@/lib/api/membersApi';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data || []);
    } catch (err) {
      toast.error('Failed to load members');
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      const member = await addMember(newMemberEmail);
      setMembers((prev) => [...prev, member]);
      setNewMemberEmail('');
      toast.success('Member added');
    } catch {
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Members</h1>

      <div className="flex gap-2">
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="Enter email"
          className="flex-1 px-2 py-1 border rounded focus:outline-none"
        />
        <button
          onClick={handleAddMember}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex justify-between items-center border-b pb-1">
            <span>{member.email}</span>
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
