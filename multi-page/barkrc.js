const path = require('path')
const fs = require('fs')
const root = process.cwd()

module.exports = {
    pages: './pages',
    output: '/dist',
    assets: './assets',
    template: './index.html',
    alias: {
        '@': path.resolve(__dirname),
        'utils': path.resolve(__dirname, 'utils')
    }
}