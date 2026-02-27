import type { Plugin, UserConfig } from 'vite';

export interface BirdactylPluginOptions {
  pluginId: string;
}

export function birdactylPlugin(options: BirdactylPluginOptions): Plugin {
  return {
    name: 'birdactyl-plugin-ui',
    config(): UserConfig {
      return {
        build: {
          lib: {
            entry: 'src/index.tsx',
            formats: ['es'],
            fileName: () => 'bundle.js',
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'react-router-dom',
              'react/jsx-runtime',
            ],
            output: {
              globals: {
                'react': 'window.BIRDACTYL.React',
                'react-dom': 'window.BIRDACTYL.ReactDOM',
                'react-router-dom': 'window.BIRDACTYL.ReactRouterDOM',
                'react/jsx-runtime': 'window.BIRDACTYL_JSX',
              },
            },
          },
          minify: true,
          sourcemap: false,
        },
        define: {
          'process.env.PLUGIN_ID': JSON.stringify(options.pluginId),
        },
      };
    },
  };
}

export function createViteConfig(options: BirdactylPluginOptions): UserConfig {
  return {
    plugins: [birdactylPlugin(options)],
    build: {
      lib: {
        entry: 'src/index.tsx',
        formats: ['es'],
        fileName: () => 'bundle.js',
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react-router-dom',
          'react/jsx-runtime',
        ],
        output: {
          globals: {
            'react': 'window.BIRDACTYL.React',
            'react-dom': 'window.BIRDACTYL.ReactDOM',
            'react-router-dom': 'window.BIRDACTYL.ReactRouterDOM',
            'react/jsx-runtime': 'window.BIRDACTYL_JSX',
          },
        },
      },
    },
  };
}
