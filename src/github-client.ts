import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

import { GithubConfig } from './config';

export type GithubRelease =
  RestEndpointMethodTypes['repos']['listReleases']['response']['data'][number];

export type GithubReleaseAsset = GithubRelease['assets'][number];

export class GithubClient extends Octokit {
  constructor(readonly config: GithubConfig) {
    super({
      auth: config.authToken,
    });
  }

  async listReleases(): Promise<readonly GithubRelease[]> {
    const { data } = await this.repos.listReleases({
      repo: this.config.repo,
      owner: this.config.owner,
    });
    return data;
  }
}
