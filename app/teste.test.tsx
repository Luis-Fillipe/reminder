import { render, screen, fireEvent } from '@testing-library/react';
import InputPage from './page'; // Componente de testar

describe('InputPage component', () => {
  it('renders "Cadastro de Lembretes" title', () => {
    render(<InputPage />);
    const titleElement = screen.getByText('Cadastro de Lembretes');
    expect(titleElement).toBeInTheDocument();
  });

  it('adds a reminder', () => {
    render(<InputPage />);
    const titleInput = screen.getByPlaceholderText('Titulo do Lembrete:');
    const dateInput = screen.getByPlaceholderText('Data do lembrete:');

    fireEvent.change(titleInput, { target: { value: 'Nova tarefa' } });
    fireEvent.change(dateInput, { target: { value: '2023-11-10' } });

    const criarButton = screen.getByText('Criar');
    fireEvent.click(criarButton);

  });

});
