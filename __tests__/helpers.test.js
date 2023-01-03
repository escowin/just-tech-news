const {format_date, format_plural, format_url} = require('../utils/helpers');

test('format_date() returns a date string', () => {
    const date = new Date('2022-12-31 16:29:03');

    expect(format_date(date)).toBe('12/31/2022');
});

test('format_plural() returns a pluralized words', () => {
    const word1 = format_plural('tiger', 2);
    const word2 = format_plural('lion', 1);

    expect(word1).toBe("tigers");
    expect(word2).toBe("lion");
});

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.second-test.com/qwerty/');
    const url3 = format_url('https://www.third-test.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('second-test.com');
    expect(url3).toBe('third-test.com');
});