module.exports = {
    files: [
        'build/**/*.css',
        'build/**/*.js',
        'build/**/*.html',
    ],
    server: {
        baseDir: "build"
    },
    open: false,
    socket: {
        domain: 'localhost:3000'
    },
    https: true,
    notify: false,
};
