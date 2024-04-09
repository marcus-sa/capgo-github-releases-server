import { beforeEach, describe, test, vitest } from 'vitest';
import { InjectorContext } from '@deepkit/injector';

import { CapgoController, CapgoUpdatesRequest } from './capgo.controller';
import { GithubClient } from './github-client';
import { CapgoConfig } from './config';

describe('CapgoController', () => {
  const listReleases = vitest.fn();
  let capgo: CapgoController;

  beforeEach(() => {
    listReleases.mockReset();

    const injector = InjectorContext.forProviders([
      CapgoController,
      CapgoConfig,
      {
        provide: GithubClient,
        useValue: {
          listReleases,
        },
      },
    ]);

    capgo = injector.get<CapgoController>();
  });

  describe('updates', () => {
    test('returns no update', async () => {
      listReleases.mockResolvedValueOnce([
        {
          tag_name: 'v0.0.1',
          prerelease: true,
          assets: [
            {
              browser_download_url: 'http://localhost',
            },
          ],
        },
      ]);

      const result = await capgo.updates({
        version_name: 'v0.0.1',
      } as CapgoUpdatesRequest);

      expect(result).toMatchInlineSnapshot(`
        {
          "message": "NO_UPDATES",
          "version": "v0.0.1",
        }
      `);
    });

    test('returns new update', async () => {
      listReleases.mockResolvedValueOnce([
        {
          tag_name: 'v0.0.2',
          prerelease: true,
          assets: [
            {
              browser_download_url: 'http://localhost',
            },
          ],
        },
        {
          tag_name: 'v0.0.1',
          prerelease: true,
          assets: [
            {
              browser_download_url: 'http://localhost',
            },
          ],
        },
        {
          tag_name: 'v0.0.3',
          prerelease: true,
          assets: [
            {
              browser_download_url: 'http://localhost',
            },
          ],
        },
      ]);

      const result = await capgo.updates({
        version_name: 'v0.0.1',
      } as CapgoUpdatesRequest);

      expect(result).toMatchInlineSnapshot(`
        {
          "url": "http://localhost",
          "version": "v0.0.3",
        }
      `);
    });
  });
});
