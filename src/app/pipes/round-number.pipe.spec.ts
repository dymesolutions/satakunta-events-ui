import { RoundNumberPipe } from '@app/pipes/round-number.pipe';

describe('RoundNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new RoundNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
