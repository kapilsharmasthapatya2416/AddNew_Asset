import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssessmentYearsPagedServerCV } from '@/lib/api/floor-cv-weightageMaster.service';
import { ApiError } from '@/lib/utils/api';



import { apiClient } from '@/services/api.service';

describe('getAssessmentYearsPagedServerCV', () => {

  let getSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    getSpy = vi.spyOn(apiClient, 'get');
    vi.clearAllMocks();
  });

  it('returns paged response when data is array', async () => {
    const mockData = [
      { yearRangeCVId: 1, yearId: 1, name: '2020-21' },
      { yearRangeCVId: 2, yearId: 2, name: '2021-22' }
    ];
    getSpy.mockResolvedValue({ success: true, data: mockData });
    const result = await getAssessmentYearsPagedServerCV(1, 10);
    expect(result.items.length).toBe(2);
    expect(result.items[0].yearId).toBe(1);
    expect(result.items[1].yearId).toBe(2);
    expect(result.pageNumber).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('returns paged response when data is object with items', async () => {
    const mockData = {
      items: [
        { yearRangeCVId: 3, yearId: 3, name: '2022-23' }
      ],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false
    };
    getSpy.mockResolvedValue({ success: true, data: mockData });
    const result = await getAssessmentYearsPagedServerCV(1, 10);
    expect(result.items.length).toBe(1);
    expect(result.items[0].yearId).toBe(3);
  });

  it('throws ApiError when response is not success', async () => {
    getSpy.mockResolvedValue({ success: false, error: 'fail' });
    await expect(getAssessmentYearsPagedServerCV(1, 10)).rejects.toThrow(ApiError);
  });

  it('throws ApiError when data is undefined', async () => {
    getSpy.mockResolvedValue({ success: true, data: undefined });
    await expect(getAssessmentYearsPagedServerCV(1, 10)).rejects.toThrow(ApiError);
  });

  it('throws ApiError when data is invalid format', async () => {
    getSpy.mockResolvedValue({ success: true, data: 123 });
    await expect(getAssessmentYearsPagedServerCV(1, 10)).rejects.toThrow(ApiError);
  });
});
