import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const validId = await transactionsRepository.findOne(id);

    if (!validId) {
      throw new AppError('Invalid id, transaction not exists');
    }

    await transactionsRepository.delete(validId);
  }
}

export default DeleteTransactionService;
