import { FrameworkConfig } from '@deepkit/framework';

export class GithubConfig {
  readonly authToken: string;
  readonly owner: string;
  readonly repo: string;
}

export class CapgoConfig extends FrameworkConfig {
  readonly github: GithubConfig;
}
