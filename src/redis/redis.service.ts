import { RedisClientType, createClient } from 'redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  client: RedisClientType;

  NAMESPACE = 'cache-service';

  TTL = 30 * 60 * 60; // 30 minutes

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:6379`,
    });
    this.client.connect().catch((err) => console.log(err));
  }

  get(key: string) {
    return new Promise((resolve, reject) => {
      this.client
        .get(key)
        .then((val) => {
          if (val) {
            resolve(JSON.parse(val));
          }
          resolve(null);
        })
        .catch((err) => reject(err));
    });
  }

  set(key: string, value: string) {
    this.client.set(key, JSON.stringify(value), { EX: this.TTL }).catch((err) => console.log(err));
  }

  del(key: string) {
    this.client.del(key).catch((err) => console.log(err));
  }
}
