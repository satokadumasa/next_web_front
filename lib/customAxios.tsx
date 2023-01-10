import axios from 'axios'; // Axios本体をインポート

const instance = axios.create(); // Axiosインスタンスを生成

instance.interceptors.request.use(
  (config) => {
    // 認証トークンをヘッダーに付与
    config.baseURL = process.env.NEXT_PUBLIC_API_SERVER,
    config.headers.common['access-token'] = localStorage.getItem('access-token'); // この例ではBearerトークンを設定
    config.headers.common['client'] = localStorage.getItem('client'); // この例ではBearerトークンを設定
    config.headers.common['uid'] = localStorage.getItem('uid'); // この例ではBearerトークンを設定
    return config;
  }
);

export default instance;
