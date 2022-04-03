#!/usr/bin/env node

import { copy } from 'esbuild-plugin-copy';
import * as esbuild from "esbuild";

esbuild.build({
    entryPoints: ['src/background.ts', 'src/appendAlert.ts', 'src/options.ts'],
    bundle: true,
    outdir: "dist",
    inject: ["config/config.prod.ts"],
    plugins: [
        copy({
            assets: {   
                from: ['./public/*', 'manifest.json'],
                to: ['./dist'],
            }
        })
    ]
}).catch(() => process.exit(1));