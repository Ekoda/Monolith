import fetchMock from 'jest-fetch-mock';
import {logger} from "@/backend/logging";
import {fetchOrThrow} from "@/utils/apiUtils";

fetchMock.enableMocks();

jest.mock('@/backend/logging', () => ({
    logger: {
        log: jest.fn(() => Promise.resolve())
    },
}));

describe('fetchOrThrow', () => {

    beforeEach(() => {
        fetchMock.resetMocks();
        (logger.log as jest.Mock).mockClear();
    });

    it('returns the response when the status code indicates success', async () => {
        const mockResponse = { ok: true, status: 200 };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const response = await fetchOrThrow('/success-url');

        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
    });

    it('logs an error and throws when the status code indicates an error', async () => {
        const mockResponse = { ok: false, status: 404, statusText: 'Not Found' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 404, statusText: 'Not Found' });

        await expect(fetchOrThrow('/error-url')).rejects.toThrow('HTTP error: 404 Not Found');
        expect(logger.log).toHaveBeenCalledWith(
            expect.objectContaining({
                level: 'error',
                message: 'HTTP error: 404 Not Found',
            })
        );
    });

});