/**
 * redis util
 */
import { Application } from 'egg';

const ChAT_USER_SOCKET_KEY_PREFIX = 'chat:user:socket:';
const ChAT_SOCKET_USER_KEY_PREFIX = 'chat:socket:user:';
const ChAT_USER_FRIENDS_KEY_PREFIX = 'chat:user:friends:';

export class RedisChatService {
  async addUserSocket(app: Application, userid, socket) {
    await app.redis.sadd(ChAT_USER_SOCKET_KEY_PREFIX + userid, socket.id);
  }

  async findUserSocket(app: Application, userid) {
    const userLoginEnds = await app.redis.smembers(
      ChAT_USER_SOCKET_KEY_PREFIX + userid
    );
    return userLoginEnds;
  }

  async deleteUserSocket(app: Application, userid, socket) {
    await app.redis.srem(ChAT_USER_SOCKET_KEY_PREFIX + userid, socket.id);
  }

  async addSocketUser(app: Application, socket, userid) {
    await app.redis.set(ChAT_SOCKET_USER_KEY_PREFIX + socket.id, userid);
  }

  async findSocketUser(app: Application, socket) {
    const userid = await app.redis.get(ChAT_SOCKET_USER_KEY_PREFIX + socket.id);
    return userid;
  }

  async deleteSocketUser(app: Application, socket) {
    await app.redis.del(ChAT_SOCKET_USER_KEY_PREFIX + socket.id);
  }

  async getUserFriends(app: Application, userid) {
    const friends = await app.redis.zrange(
      ChAT_USER_FRIENDS_KEY_PREFIX + userid,
      0,
      -1,
      'WITHSCORES'
    );

    return friends;
  }

  async addUserFriend(app: Application, userid, score, friendid) {
    await app.redis.zadd(
      ChAT_USER_FRIENDS_KEY_PREFIX + userid,
      score,
      friendid
    );
  }

  async getUserFriendScore(app: Application, userid, friendid) {
    const score = await app.redis.zscore(
      ChAT_USER_FRIENDS_KEY_PREFIX + userid,
      friendid
    );

    return score;
  }

  async updateUserFriendScore(app: Application, userid, friendid, score) {
    await app.redis.zincrby(
      ChAT_USER_FRIENDS_KEY_PREFIX + userid,
      score,
      friendid
    );
  }

  async deleteUserFriend(app: Application, userid) {
    await app.redis.del(ChAT_USER_FRIENDS_KEY_PREFIX + userid);
  }
}

export const redisChatService = new RedisChatService();


const TB_USER_SOCKET_KEY_PREFIX = 'tb:user:socket:';
const TB_SOCKET_USER_KEY_PREFIX = 'tb:socket:user:';
const TB_USER_TOMATO_KEY_PREFIX = 'tb:user:tomato:';
export class RedisTomatoService {
  async addUserSocket(app: Application, userid, socket) {
    await app.redis.sadd(TB_USER_SOCKET_KEY_PREFIX + userid, socket.id);
  }

  async findUserSocket(app: Application, userid) {
    const userLoginEnds = await app.redis.smembers(
      TB_USER_SOCKET_KEY_PREFIX + userid
    );
    return userLoginEnds;
  }

  async deleteUserSocket(app: Application, userid, socket) {
    await app.redis.srem(TB_USER_SOCKET_KEY_PREFIX + userid, socket.id);
  }

  async addSocketUser(app: Application, socket, userid) {
    await app.redis.set(TB_SOCKET_USER_KEY_PREFIX + socket.id, userid);
  }

  async findSocketUser(app: Application, socket) {
    const userid = await app.redis.get(TB_SOCKET_USER_KEY_PREFIX + socket.id);
    return userid;
  }

  async deleteSocketUser(app: Application, socket) {
    await app.redis.del(TB_SOCKET_USER_KEY_PREFIX + socket.id);
  }

  async addUserTomato(app: Application, userid, tomato, EX) {
    await app.redis.set(
      TB_USER_TOMATO_KEY_PREFIX + userid,
      tomato,
      'EX',
      EX
    );
  }

  async findUserTomato(app: Application, userid) {
    const tomato = await app.redis.get(TB_USER_TOMATO_KEY_PREFIX + userid);
    return tomato;
  }

  async deleteUserTomato(app: Application, userid) {
    await app.redis.del(TB_USER_TOMATO_KEY_PREFIX + userid);
  }
}

export const redisTomatoService = new RedisTomatoService();
