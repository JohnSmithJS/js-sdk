Echo.Tests.Fixtures.canvases["js-sdk-tests/test-canvas-008"] = {
    "id": "test.canvas.008",
    "title": "Test canvas with Auth control",
    "backplane": {
        "serverBaseURL": "https://api.echoenabled.com/v1",
        "busName": "jskit"
    },
    "apps": [{
        "id": "auth",
        "script": "identityserver.pack.js",
        "component": "Echo.IdentityServer.Controls.Auth",
        "config": {
            "appkey": "echo.jssdk.tests.aboutecho.com",
            "identityManager": {
                "login": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="},
                "signup": {"width": 400, "height": 240, "url": "https://echo.rpxnow.com/openid/embed?flags=stay_in_window,no_immediate&token_url=http%3A%2F%2Fjs-kit.com%2Fapps%2Fjanrain%2Fwaiting.html&bp_channel="}
            }
        }
    }]
};
