import { ApiDataPipe } from '@app/pipes/api-data.pipe';

describe('ApiDataPipe', () => {
  it('create an instance', () => {
    const pipe = new ApiDataPipe();
    expect(pipe).toBeTruthy();
  });
});
