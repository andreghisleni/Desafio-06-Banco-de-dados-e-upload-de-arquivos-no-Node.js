import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: category_title,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type');
    }
    if (type === 'outcome') {
      const { total: balance } = await transactionsRepository.getBalance();

      if (balance < value) {
        throw new AppError('Insufficient Funds');
      }
    }
    const category = await categoriesRepository.findOne({
      title: category_title,
    });
    let category_id: string;
    if (!category) {
      const category = categoriesRepository.create({ title: category_title });
      await categoriesRepository.save(category);
      category_id = category.id;
    } else {
      category_id = category.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
