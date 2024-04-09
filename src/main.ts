import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';

import { CapgoConfig } from './config';
import { GithubClient } from './github-client';
import { CapgoController } from './capgo.controller';

void new App({
  imports: [new FrameworkModule()],
  config: CapgoConfig,
  controllers: [CapgoController],
  providers: [GithubClient],
})
  .setup((module, { github, ...config }: CapgoConfig) => {
    module.getImportedModuleByClass(FrameworkModule).configure(config);
  })
  .loadConfigFromEnv({ prefix: 'CAPGO_' })
  .run(['server:start']);
