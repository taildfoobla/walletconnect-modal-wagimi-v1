import {getReactEnv} from "../utils/env"

const getConfigs = () => {
    const env = getReactEnv('ENV')
    switch (env) {
        case 'local':
            return {
                API_URL: 'http://0.0.0.0:8081/v1',
                APP_URI: 'localhost:3000'
            }
        case 'production':
            return {
                API_URL: 'https://api-prod.moonfit.xyz/v1',
                APP_URI: 'app.moonfit.xyz'
            }
        case 'development':
        default:
            return {
                API_URL: 'https://api-dev.moonfit.xyz/v1',
                APP_URI: 'dev-app.moonfit.xyz'
            }
    }
}

export const COMMON_CONFIGS = getConfigs()