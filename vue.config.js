module.exports = {
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    // 自定义主题
                    modifyVars: {
                        'primary-color': '#01C9CF',
                    },
                    javascriptEnabled: true,
                    math: 'always'
                },
            },
        },
    },
};