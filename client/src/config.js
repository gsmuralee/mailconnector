const BASE_URL = 'http://localhost:9085'
const constant = { 
    LOGIN: `/api/login`,
    SCHEDULE: `/api/reports/schedule/`,
    GET_SCHEDULE: `/api/alias/schedule/`,
    REPORTS: '/api/reports/alias',
    GET_REPORTS: '/api/reports/'

};

export const routes = (route, param='') => BASE_URL+constant[route]+param;