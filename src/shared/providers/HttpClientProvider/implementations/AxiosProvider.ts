import axios, { AxiosInstance } from 'axios';

class AxiosProvider {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }
}

export default new AxiosProvider().client;
