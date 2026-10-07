import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { parseRichText } from '../../lib/relay/colors';
import { RichText, Time } from './RichText';

describe('RichText', () => {
    it('renders WeeChat colors as classes', () => {
        const { container } = render(
            <RichText parts={parseRichText('\x19F05green\x1c plain')} />,
        );
        const spans = container.querySelectorAll(':scope > span');
        expect(spans[0].className).toBe('cwf-green cwb-default');
        expect(spans[0].textContent).toBe('green');
        expect(spans[1].textContent).toBe(' plain');
    });

    it('never renders message text as HTML', () => {
        const evil =
            '<img src=x onerror="alert(1)"> https://e.com/"><script>alert(1)</script> #chan"><b>';
        const { container } = render(<RichText parts={parseRichText(evil)} />);
        expect(container.querySelector('img, script, b')).toBeNull();
        expect(container.textContent).toBe(evil);
    });

    it('renders links that open in a new tab', () => {
        const { container } = render(
            <RichText parts={parseRichText('see https://weechat.org')} />,
        );
        const link = container.querySelector('a')!;
        expect(link.href).toBe('https://weechat.org/');
        expect(link.target).toBe('_blank');
        expect(link.rel).toBe('noopener noreferrer');
    });

    it('does not link hostmasks', () => {
        const parts = parseRichText('\x1927~alice@https.example.com');
        expect(parts[0].classes).toContain('cof-chat_host');
        const { container } = render(<RichText parts={parts} />);
        expect(container.querySelector('a')).toBeNull();
    });

    it('opens channels', () => {
        const onChannel = vi.fn();
        const { getByText } = render(
            <RichText parts={parseRichText('join #weechat')} onChannel={onChannel} />,
        );
        fireEvent.click(getByText('#weechat'));
        expect(onChannel).toHaveBeenCalledWith('#weechat');
    });

    it('shows color swatches and code', () => {
        const { container } = render(
            <RichText parts={parseRichText('#ff8800 and `code`')} />,
        );
        expect(
            (container.querySelector('.colourbox') as HTMLElement).style
                .backgroundColor,
        ).toBe('rgb(255, 136, 0)');
        expect(container.querySelector('code')!.textContent).toBe('code');
    });

    it('limits the length of prefixes', () => {
        const { container } = render(
            <RichText
                parts={parseRichText('averyveryverylongnickname')}
                maxLength={10}
            />,
        );
        expect(container.textContent).toBe('averyveryv+');
    });
});

describe('Time', () => {
    it('colors times and delimiters', () => {
        const { container } = render(
            <Time date={new Date(2024, 0, 1, 9, 5, 7)} format="%H:%M:%S" />,
        );
        const spans = [...container.querySelectorAll('span')];
        expect(spans.map((s) => s.textContent)).toEqual(['09', ':', '05', ':', '07']);
        expect(spans[1].className).toContain('cof-chat_time_delimiters');
        expect(spans[0].className).toContain('cof-chat_time ');
    });
});
