import { http, HttpBody, HttpInternalServerError } from '@deepkit/http';
import * as semver from 'semver';

import { GithubClient } from './github-client';

export interface CapgoUpdatesRequest {
  readonly version_name: string;
  readonly version_build: string;
  readonly version_os: string;
  readonly custom_id?: string;
  readonly is_prod?: boolean;
  readonly is_emulator?: boolean;
  readonly plugin_version: string;
  readonly platform: 'android' | 'ios';
  readonly app_id: string;
  readonly device_id: string;
}

export type CapgoUpdatesResponse =
  | {
      readonly version: string;
      readonly error?: string;
      readonly message: string;
    }
  | {
      readonly version: string;
      readonly url: string;
    };

@http.controller()
export class CapgoController {
  constructor(private readonly github: GithubClient) {}

  @http.GET('updates')
  async updates({
    version_name: version,
    is_prod: isProd,
  }: HttpBody<CapgoUpdatesRequest>): Promise<CapgoUpdatesResponse> {
    const releases = (await this.github.listReleases())
      .filter(release => (isProd ? !release.prerelease : release.prerelease))
      .sort((a, b) =>
        // newest first
        semver.compare(b.tag_name, a.tag_name),
      );

    const release = releases[0];

    if (!release) {
      throw new HttpInternalServerError(
        'Expected at least one release to exist',
      );
    }

    if (!release.tag_name) {
      throw new HttpInternalServerError('Expected release to have a tag');
    }

    if (release.tag_name === version) {
      return {
        version: release.tag_name,
        message: 'NO_UPDATES',
      };
    }

    return {
      version: release.tag_name,
      url: release.assets[0].browser_download_url,
    };
  }
}
