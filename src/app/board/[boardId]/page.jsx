import Board from '@/components/Board';

export default function BoardPage({ params }) {
  return <Board boardId={params.boardId} />;
}
