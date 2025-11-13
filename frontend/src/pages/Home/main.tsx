import { useState } from 'react';
import { Button, Modal } from '@/core/components';
import { QuickAddTask, TaskList, TaskForm } from '@/domain/task/components';
import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
        <Button onClick={() => setCreateModalOpen(true)}>Nova Tarefa</Button>
      </header>

      <main className="space-y-6">
        <section>
          <QuickAddTask />
        </section>

        <section>
          <TaskList />
        </section>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Criar Nova Tarefa"
      >
        <TaskForm onSuccess={() => setCreateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HomePage;
