import { describe, expect, it } from 'vitest';
import { formatTime, formatTimeText } from './time-format';

// 2024-03-05 07:08:09.123, local time
const date = new Date(2024, 2, 5, 7, 8, 9, 123);

describe('formatTime', () => {
    it('formats 24h times', () => {
        expect(formatTimeText(date, '%H:%M:%S')).toBe('07:08:09');
        expect(formatTimeText(date, '%H:%M')).toBe('07:08');
        expect(formatTimeText(date, '%T')).toBe('07:08:09');
        expect(formatTimeText(date, '%R')).toBe('07:08');
        expect(formatTimeText(date, '%k')).toBe(' 7');
    });

    it('formats 12h times', () => {
        const evening = new Date(2024, 2, 5, 19, 8, 9);
        expect(formatTimeText(evening, '%I:%M %p')).toBe('07:08 PM');
        expect(formatTimeText(evening, '%l:%M%P')).toBe(' 7:08pm');
        expect(formatTimeText(evening, '%r')).toBe('07:08:09 PM');
        expect(formatTimeText(new Date(2024, 2, 5, 0, 5), '%I %p')).toBe('12 AM');
    });

    it('formats dates', () => {
        expect(formatTimeText(date, '%Y-%m-%d')).toBe('2024-03-05');
        expect(formatTimeText(date, '%F')).toBe('2024-03-05');
        expect(formatTimeText(date, '%d/%m/%y')).toBe('05/03/24');
        expect(formatTimeText(date, '%D')).toBe('03/05/24');
        expect(formatTimeText(date, '%a %b %e')).toBe('Tue Mar  5');
        expect(formatTimeText(date, '%A %B')).toBe('Tuesday March');
    });

    it('formats sub-seconds (%.N, WeeChat >= 4.2)', () => {
        expect(formatTimeText(date, '%H:%M:%S.%.3')).toBe('07:08:09.123');
        expect(formatTimeText(date, '%S%.6')).toBe('09123000');
    });

    it('marks delimiters between fields', () => {
        expect(formatTime(date, '%H:%M')).toEqual([
            { text: '07', delimiter: false },
            { text: ':', delimiter: true },
            { text: '08', delimiter: false },
        ]);
    });

    it('removes ${...} expressions (colors) of WeeChat', () => {
        expect(formatTimeText(date, '${color:252}%H${color:245}:${color:252}%M')).toBe(
            '07:08',
        );
    });

    it('keeps %% and unknown specifiers', () => {
        expect(formatTimeText(date, '100%% %Q')).toBe('100% %Q');
    });

    it('uses the default format when empty', () => {
        expect(formatTimeText(date, '')).toBe('07:08:09');
    });
});
