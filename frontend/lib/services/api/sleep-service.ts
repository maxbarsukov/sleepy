import { AxiosResponse } from 'axios';

import { SleepDto } from '@/lib/dto/sleep-dto';
import { SleepSummaryDto } from '@/lib/dto/sleep-summary-dto';
import api from '@/lib/services/api';

export default class SleepService {
  /**
   * Get all sleeps
   * @returns {Promise<AxiosResponse<SleepSummaryDto[]>>} List of sleeps
   */
  static async getAll(): Promise<AxiosResponse<SleepSummaryDto[]>> {
    return api.get<SleepSummaryDto[]>('/sleep/');
  }

  /**
   * Get a sleep by ID
   * @param {number} id Sleep ID
   * @returns {Promise<AxiosResponse<SleepDto>>} Sleep data items
   */
  static async getById(id: number): Promise<AxiosResponse<SleepDto>> {
    return api.get<SleepDto>(`/sleep/${id}`);
  }

  /**
   * Get a grouped sleep data for graph by ID
   * @param {number} id Sleep ID
   * @returns {Promise<AxiosResponse<boolean[]>>} Is sleeping is quick for each sleep data item
   */
  static async getGraphById(id: number): Promise<AxiosResponse<boolean[]>> {
    return api.get<boolean[]>(`/sleep/${id}/graph`);
  }
}
