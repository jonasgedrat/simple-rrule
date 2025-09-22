import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist'],
        typecheck: {
            enabled: true,
            ignoreSourceErrors: false,
            checker: 'tsc',
            tsconfig: './tsconfig.json',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                'test/',
                '**/*.d.ts',
                '**/*.config.*',
            ],
        },
    },
})
