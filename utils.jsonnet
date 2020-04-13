local cache(name, path) = {
  name: 'cache-' + name,
  path: path,
};

{
  shell(step_name, commands, environment={})::
   {
      name: step_name,
      image: 'alpine',
      commands: commands,
   },
  golang(step_name, commands, environment={}, version="1.13.8", cache_name="golang")::
    {
      name: step_name,
      image: 'golang:' + version,
      volumes: [cache(cache_name,'/cache')],
      environment: { GOPATH: '/cache/go', GOCACHE: '/cache/go-build' } + environment,
      commands: commands,
    },

  node(step_name, commands, environment={},  version="latest", cache_path="/drone/src/node_modules", cache_name="node")::
    {
      name: step_name,
      image: 'node:' + version,
      volumes: [cache(cache_name, cache_path) ],
      commands: commands,
    },

  rust(step_name, commands, environment={}, version="latest", cache_name="rust")::
   {
      name: step_name,
      image: 'rust:' + version,
      volumes: [cache(cache_name,'/drone/src/target')],
      environment: { CARGO_HOME: '/drone/src/target/cache' } + environment,
      commands: commands,
   },

  adjust_deployment(deployment, env)::
    [x + '-' + env + ':' + x for x in deployment]
  ,

  publish(step_name, repo, when, tags=[], auto_tag=false, dockerfile="Dockerfile")::
    {
      name: step_name,
      image: 'plugins/docker',
      volumes: [ { name: 'docker', path: '/var/run/docker.sock' } ] ,  
      settings: {
        dockerfile: dockerfile,
        daemon_off: true,
        auto_tag: auto_tag,
        username: { from_secret: 'docker-username' },
        password: { from_secret: 'docker-password' },
        registry: 'registry.cn-hongkong.aliyuncs.com',
        repo: 'registry.cn-hongkong.aliyuncs.com/imtoken/' + repo,
        tags: tags,
      },
      when: when,
    },

  deploy(step_name, env, namespace, repo, deployment, when, tag='${DRONE_COMMIT_SHA:0:8}'):: {
    name: step_name,
    image: 'registry.cn-hongkong.aliyuncs.com/imtoken/drone-k8s:latest',
    settings: {
      kubernetes_server: { from_secret: 'gcp-server-' + env },
      kubernetes_token: { from_secret: 'gcp-token-' + env },
      namespace: namespace,
      repo: 'registry.cn-hongkong.aliyuncs.com/imtoken/' + repo,
      tag: tag,
      deployment: deployment,
    },
    when: when,
  },

  default_slack: {
    name: 'slack',
    image: 'plugins/slack',
    when: { status: ['success', 'failure'] },
    settings: {
      webhook: { from_secret: "drone-slack" },
      template: ||| 
        {{#if build.pull }}
        *{{#success build.status}}✔{{ else }}✘{{/success}} {{ uppercasefirst build.status }}*: <https://github.com/{{ repo.owner }}/{{ repo.name }}/pull/{{ build.pull }}|Pull Request #{{ build.pull }}>
        {{else}}
        *{{#success build.status}}✔{{ else }}✘{{/success}} {{ uppercasefirst build.status }}: Build #{{ build.number }}* (type: `{{ build.event }}`)
        {{/if}}
        Commit: {{ build.message.title }}(<https://github.com/{{ repo.owner }}/{{ repo.name }}/commit/{{ build.commit }}|{{ truncate build.commit 8 }}>)
        {{#if build.tag }}
        Tag: <https://github.com/{{ repo.owner }}/{{ repo.name }}/commits/{{ build.tag }}|{{ repo.name }} {{ build.tag }}>
        {{else}}
        Branch: <https://github.com/{{ repo.owner }}/{{ repo.name }}/commits/{{ build.branch }}|{{ repo.name }} {{ build.branch }}>
        {{/if}}
        Author: {{ build.author }}
        <{{ build.link }}|Visit build page ↗>
      |||,
    },
  },

  volumes(repo, cache_names = ["node", "golang", "rust"])::
    [{ name: 'cache-' + cache_name, host: { path: '/usr/local/var/cache/drone/' + repo + '/' + cache_name } } for cache_name in cache_names ] + 
    [{ name: 'docker', host: { path: '/var/run/docker.sock' } }],

  default_publish(repo, dockerfile="Dockerfile")::
    [
      self.publish('publish-on-develop-' + repo, 
                   repo,
                   { branch: ['hotfix/*', 'feature/*', 'support/*'] },
                   ['${DRONE_COMMIT_SHA:0:8}'],
                   dockerfile = dockerfile),
      self.publish('publish-on-release-' + repo,
                   repo,
                   { branch: ['release/*'] },
                   ['${DRONE_COMMIT_SHA:0:8}', 'staging'],
                   dockerfile = dockerfile),
      self.publish('publish-on-stable-branch-' + repo,
                   repo,
                   { branch: ['develop', 'master'] },
                   ['${DRONE_COMMIT_SHA:0:8}', '${DRONE_COMMIT_BRANCH}', '${DRONE_COMMIT_BRANCH}-${DRONE_COMMIT_SHA:0:8}'],
                   dockerfile = dockerfile),
      self.publish('publish-on-tag-' + repo, 
                   repo,
                   { event: ['tag'] },
                   auto_tag = true,
                   dockerfile = dockerfile),
    ],

  default_trigger: {
    ref: ['refs/heads/develop', 'refs/heads/master', 'refs/heads/hotfix/*', 'refs/heads/feature/*', 'refs/heads/support/*', 'refs/heads/release/*', 'refs/tags/*'],
    event: ['push', 'tag'],
  },

  default_secrets: [
    {
      kind: 'secret',
      name: 'gcp-bucket-sa',
      get: {
        path: 'drone-gcp-sa-secrets',
        name: 'sa',
      },
    },

    {
      kind: 'secret',
      name: 'docker-username',
      get: {
        path: 'image-registry-aliyun',
        name: 'username',
      },
    },

    {
      kind: 'secret',
      name: 'docker-password',
      get: {
        path: 'image-registry-aliyun',
        name: 'password',
      },
    },

    {
      kind: 'secret',
      name: 'gcp-server-dev',
      get: {
        path: 'drone-kubeconfig-gcp-dev',
        name: 'server',
      },
    },

    {
      kind: 'secret',
      name: 'gcp-token-dev',
      get: {
        path: 'drone-kubeconfig-gcp-dev',
        name: 'token',
      },
    },

    {
      kind: 'secret',
      name: 'gcp-server-staging',
      get: {
        path: 'drone-kubeconfig-gcp-staging',
        name: 'server',
      },
    },

    {
      kind: 'secret',
      name: 'gcp-token-staging',
      get: {
        path: 'drone-kubeconfig-gcp-staging',
        name: 'token',
      },
    },

    {
      kind: 'secret',
      name: 'drone-slack',
      get: {
        path: 'drone-slack-secrets',
        name: 'slack_webhook',
      },
    },
  ],
}