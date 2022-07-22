import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'local':
            return {
                API_URL: 'http://0.0.0.0:8081/v1',
                APP_URI: 'localhost:3000'
            }
        case 'development':
            return {
                API_URL: 'https://api-dev.moonfit.xyz/v1',
                // APP_URI: 'moonfit-web.netlify.app',
                APP_URI: '4021-222-252-31-240.ap.ngrok.io'
            }
        case 'production':
            return {
                API_URL: 'https://api-prod.moonfit.xyz/v1',
                APP_URI: 'app.moonfit.xyz'
            }
        default:
            return {
                API_URL: 'https://api-dev.moonfit.xyz/v1',
                APP_URI: 'moonfit-web.netlify.app'
            }
    }
}

export const COMMON_CONFIGS = getConfigs()